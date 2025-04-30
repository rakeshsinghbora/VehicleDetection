import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlockedVehiclesTable from './BlockedVehiclesTable';
import BlockVehicleForm from './BlockVehicleForm';

const BlockedDashboard = () => {
  const [blockedVehicles, setBlockedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBlockedVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/blocked-vehicles/all');
      setBlockedVehicles(response.data);
      setLoading(false);
    } catch  {
      setError('Error fetching blocked vehicles data');
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchBlockedVehicles();
    setShowForm(false); // Hide form after successful submission
  };
  
  useEffect(() => {
    fetchBlockedVehicles();
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Blocked Vehicles Management</h2>
        <button 
          className={`btn ${showForm ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <><i className="bi bi-x-lg"></i> Close Form</>
          ) : (
            <><i className="bi bi-plus-lg"></i> Block/Allow Vehicle</>
          )}
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <BlockVehicleForm onSuccess={handleFormSuccess} />
        </div>
      )}

      <BlockedVehiclesTable 
        vehicles={blockedVehicles} 
        onRefresh={fetchBlockedVehicles}
      />
    </div>
  );
};

export default BlockedDashboard;