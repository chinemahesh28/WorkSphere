import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/Login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Unauthorized Access</h2>
        <p style={styles.message}>
          Invalid credentials or you do not have permission to access this page.
        </p>

        <button style={styles.button} onClick={handleBackToLogin}>
          Go Back to Login
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f9",
  },
  card: {
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "350px",
  },
  heading: {
    color: "#e74c3c",
    marginBottom: "15px",
  },
  message: {
    marginBottom: "25px",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Unauthorized;
