const VehicleStats = () => {
    // Dummy values for now — replace with props or API data later
    const vehiclesInside = 43;
    const vehiclesEnteredToday = 108;
  
    return (
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title mb-4">Vehicle Statistics</h5>
          <p className="fs-5">🚗 Vehicles Inside Campus: <strong>{vehiclesInside}</strong></p>
          <p className="fs-5">🛣️ Vehicles Entered Today: <strong>{vehiclesEnteredToday}</strong></p>
        </div>
      </div>
    );
  };
  
  export default VehicleStats;
  