import { useGlobalContext } from "../ContextAPI/GlobalContext";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, gateNumber, setIsLoggedIn, setGateNumber, userType } = useGlobalContext();
  const location = useLocation();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGateNumber(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("gateNumber");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <span className="fs-5 fw-semibold">BBAU Vehicle Management System</span>
        </a>

        {isLoggedIn && (
          <>
            {userType === "admin" && (
              <div className="navbar-nav mx-auto mb-2 mb-lg-0 justify-content-center flex-grow-1 ">
                <Link 
                  to="/admin-dashboard" 
                  className={`nav-link ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/blocking" 
                  className={`nav-link ${location.pathname === '/blocking' ? 'active' : ''}`}
                >
                  Blocking
                </Link>
                <Link 
                  to="/search-vehicles" 
                  className={`nav-link ${location.pathname === '/search-vehicles' ? 'active' : ''}`}
                >
                  Search Vehicles
                </Link>
              </div>
            )}
            {/* Render this div only if the user is logged in and gateNumber is not null */}
            <div className="d-flex align-items-center gap-3">
              {userType === "guard" && 
                <span className="text-light fs-5 fw-semibold">GATE: {gateNumber}</span>
              }
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;