import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmData, setConfirmData] = useState(null);
  const resolveRef = useRef(null);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const showConfirm = useCallback((message, title = 'Confirm Action') => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setConfirmData({ message, title });
    });
  }, []);

  const handleConfirm = (result) => {
    if (resolveRef.current) resolveRef.current(result);
    resolveRef.current = null;
    setConfirmData(null);
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info: (msg) => addToast(msg, 'info'),
    confirm: showConfirm,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} setToasts={setToasts} />
      {confirmData && <ConfirmModal data={confirmData} onConfirm={handleConfirm} />}
    </ToastContext.Provider>
  );
};

const ConfirmModal = ({ data, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg">{data.title}</h3>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-600 text-sm leading-relaxed">{data.message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => onConfirm(false)}
            className="px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(true)}
            className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

const icons = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const colorMap = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-indigo-500 text-white',
};

const ToastContainer = ({ toasts, setToasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${colorMap[t.type]} px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn`}
        >
          <div className="flex-shrink-0">{icons[t.type]}</div>
          <p className="text-sm font-medium flex-1">{t.message}</p>
          <button
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ToastProvider;
