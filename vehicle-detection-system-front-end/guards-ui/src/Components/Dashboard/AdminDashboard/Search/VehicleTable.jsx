import React, { useState } from 'react';

const VehicleTable = ({ vehicles, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  // Calculate indexes for current page
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = vehicles.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(vehicles.length / entriesPerPage);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Vehicle Records</h3>
          <button 
            className="btn btn-outline-primary"
            onClick={onRefresh}
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
        </div>
        <p className="text-center">No vehicles found</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Vehicle Records</h3>
        <button 
          className="btn btn-outline-primary"
          onClick={onRefresh}
        >
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Vehicle Number</th>
              <th>Vehicle Type</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Entry Gate</th>
              <th>Exit Gate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.vehicleNumber.toUpperCase()}</td>
                <td>{vehicle.vehicleType}</td>
                <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
                <td>{vehicle.exitTime ? new Date(vehicle.exitTime).toLocaleString() : '-'}</td>
                <td>{vehicle.entryGate}</td>
                <td>{vehicle.exitGate || '-'}</td>
                <td>
                  <span className={`badge ${vehicle.status === 'IN' ? 'bg-success' : 'bg-danger'}`}>
                    {vehicle.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, vehicles.length)} of {vehicles.length} entries
        </div>
        <div className="btn-group">
          <button 
            className="btn btn-outline-primary" 
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            className="btn btn-outline-primary" 
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleTable;