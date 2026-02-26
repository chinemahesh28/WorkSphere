import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Dashboard from "./pages/admin/Dashboard";
import ManageTrainer from "./pages/admin/ManageTrainers";
import ManageAnalysts from "./pages/admin/ManageAnalysts";
import ManageCounsellor from "./pages/admin/ManageCounsellors";

import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import AnalystDashboard from "./pages/analyst/AnalystDashboard";
import CounsellorDashboard from "./pages/counsellor/CounsellorDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Default page when /admin loads */}
          <Route index element={<Dashboard />} />

          {/* Sidebar routes */}
          <Route path="trainers" element={<ManageTrainer />} />
          <Route path="analysts" element={<ManageAnalysts />} />
          <Route path="counsellors" element={<ManageCounsellor />} />
        </Route>

        {/* ================= OTHER ROLES ================= */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute user={user} allowedRole="TRAINER">
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyst"
          element={
            <ProtectedRoute user={user} allowedRole="ANALYST">
              <AnalystDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/counsellor"
          element={
            <ProtectedRoute user={user} allowedRole="COUNSELLOR">
              <CounsellorDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;