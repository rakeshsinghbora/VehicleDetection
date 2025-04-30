import { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "../ContextAPI/GlobalContext";
import { useNavigate } from "react-router-dom";

const GateLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGate, setSelectedGate] = useState("");

  const { setIsLoggedIn, setGateNumber,setUserType } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      if (res.status === 200) {
        setIsLoggedIn(true);
        setGateNumber(selectedGate);
        setUserType('guard');
        navigate("/guard-dashboard");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="mb-3 text-center">Guard Login</h3>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Select Gate</label>
            <select 
              className="form-select"
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              required
            >
              <option value="">Choose a gate...</option>
              <option value="1">Gate 1</option>
              <option value="2">Gate 2</option>
              <option value="3">Gate 3</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GateLogin;