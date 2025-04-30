import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrafficGraph from './TrafficGraph';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:8080/api/vehicles/statistics/${today}`);
      setStats(response.data);
      setLoading(false);
    } catch  {
      setError('Error fetching statistics');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStatistics, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center m-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Dashboard Overview</h2>
          <p className="text-muted">Statistics for {stats?.date}</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-outline-primary"
            onClick={fetchStatistics}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Total Entered Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-car-front fs-1"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{stats?.totalEntered}</h3>
                  <div className="text-white-50">Total Vehicles Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currently Inside Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-box-arrow-in-right fs-1"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{stats?.currentlyInside}</h3>
                  <div className="text-white-50">Currently Inside</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currently Outside Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-box-arrow-right fs-1"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{stats?.currentlyOutside}</h3>
                  <div className="text-white-50">Currently Outside</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Date Card */}
        <div className="col-sm-6 col-xl-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-calendar-event fs-1"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{new Date().toLocaleDateString()}</h3>
                  <div className="text-white-50">Current Date</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <TrafficGraph />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;