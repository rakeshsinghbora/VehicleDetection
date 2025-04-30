import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate("/admin-login");
  };

  const handleGuardLogin = () => {
    navigate("/guard-login");
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">Welcome to Detection System</h1>
      <div className="d-flex gap-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleAdminLogin}
        >
          Login as Admin
        </button>
        <button
          className="btn btn-success btn-lg"
          onClick={handleGuardLogin}
        >
          Login as Guard
        </button>
      </div>
    </div>
  );
};

export default Home;