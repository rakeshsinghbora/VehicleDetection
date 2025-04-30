import React, { useState } from 'react';
import axios from 'axios';

const BlockVehicleForm = ({ onSuccess }) => {
  const [formType, setFormType] = useState('block'); // 'block' or 'allow'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    blockedBy: '',
    blockedReason: '',
    allowedBy: '',
    allowedReason: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formType === 'block') {
        await axios.post('http://localhost:8080/api/blocked-vehicles/block', {
          vehicleNumber: formData.vehicleNumber.toUpperCase(),
          blockedBy: formData.blockedBy,
          blockedReason: formData.blockedReason
        });
      } else {
        await axios.put(`http://localhost:8080/api/blocked-vehicles/allow/${formData.vehicleNumber}`, {
          allowedBy: formData.allowedBy,
          allowedReason: formData.allowedReason
        });
      }
      
      // Reset form
      setFormData({
        vehicleNumber: '',
        blockedBy: '',
        blockedReason: '',
        allowedBy: '',
        allowedReason: ''
      });
      
      // Notify parent component
      if (onSuccess) onSuccess();
      
      // Show success message
      alert(`Vehicle successfully ${formType === 'block' ? 'blocked' : 'allowed'}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${formType === 'block' ? 'active' : ''}`}
              onClick={() => setFormType('block')}
            >
              Block Vehicle
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${formType === 'allow' ? 'active' : ''}`}
              onClick={() => setFormType('allow')}
            >
              Allow Vehicle
            </button>
          </li>
        </ul>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Vehicle Number</label>
            <input
              type="text"
              className="form-control"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter vehicle number"
            />
          </div>

          {formType === 'block' ? (
            <>
              <div className="mb-3">
                <label className="form-label">Blocked By</label>
                <input
                  type="text"
                  className="form-control"
                  name="blockedBy"
                  value={formData.blockedBy}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter who is blocking"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Block Reason</label>
                <textarea
                  className="form-control"
                  name="blockedReason"
                  value={formData.blockedReason}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter reason for blocking"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label">Allowed By</label>
                <input
                  type="text"
                  className="form-control"
                  name="allowedBy"
                  value={formData.allowedBy}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter who is allowing"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Allow Reason</label>
                <textarea
                  className="form-control"
                  name="allowedReason"
                  value={formData.allowedReason}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter reason for allowing"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              formType === 'block' ? 'Block Vehicle' : 'Allow Vehicle'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlockVehicleForm;