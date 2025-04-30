import AllowedNotification from "./AllowedNotification";
import { useState, useEffect, useContext } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { GlobalContext } from "../../ContextAPI/GlobalContext";

const GateDashboard = () => {
  const { gateNumber } = useContext(GlobalContext); // get gateNumber dynamically
  const [allowedVehicle, setAllowedVehicle] = useState(null);
  const [blockedVehicles, setBlockedVehicles] = useState([]);
  const [reason, setReason] = useState("");
  const [entryStatus, setEntryStatus] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // Changed from ws-endpoint to ws
      connectHeaders: {},
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    stompClient.onConnect = () => {
      setConnectionStatus("Connected");
      console.log("Connected to WebSocket");

      // Subscribe to topics
      stompClient.subscribe('/topic/blocked-vehicle', (message) => {
        const vehicle = JSON.parse(message.body);
        console.log("Blocked vehicle received:", vehicle);
        setBlockedVehicles(prev => [...prev, vehicle]);
      });

      stompClient.subscribe('/topic/allowed-vehicle', (message) => {
        const vehicle = JSON.parse(message.body);
        console.log("Allowed vehicle received:", vehicle);
        setAllowedVehicle(vehicle);
      });
    };

    stompClient.onStompError = (frame) => {
      setConnectionStatus("Error");
      console.error('STOMP error:', frame.headers['message']);
      console.error('Details:', frame.body);
    };

    stompClient.onWebSocketError = (event) => {
      setConnectionStatus("Error");
      console.error('WebSocket error:', event);
    };

    stompClient.onWebSocketClose = (event) => {
      setConnectionStatus("Disconnected");
      console.log('WebSocket connection closed:', event);
    };

    // Activate the client
    try {
      stompClient.activate();
    } catch (error) {
      setConnectionStatus("Error");
      console.error('Failed to activate STOMP client:', error);
    }

    // Cleanup on component unmount
    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, []);

  const handleStopEntry = (vehicle) => {
    setEntryStatus(`Entry Stopped for vehicle ${vehicle.vehicleNumber}`);
  
    fetch(`http://localhost:8080/api/blocked-vehicles/response/${vehicle.vehicleNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allow: false,
        guardId: "Guard_001",
        reason: "Vehicle not permitted at this gate"
      })
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to process stop entry");
      return response.text(); // ✅ use .text()
    })
    .then(() => {
      setBlockedVehicles(prev => 
        prev.filter(v => v.vehicleNumber !== vehicle.vehicleNumber)
      );
      // Do not clear reason here
    })
    .catch(error => {
      console.error("Error processing stop entry:", error);
      alert("Failed to process stop entry. Please try again.");
    });
  };
  

  // const handleAllowEntry = (vehicle) => {
  //   if (!reason.trim()) {
  //     alert("Please provide a reason for allowing entry");
  //     return;
  //   }
  
  //   setEntryStatus(`Allowed ${vehicle.vehicleNumber} with reason: ${reason}`);
  
  //   fetch(`http://localhost:8080/api/blocked-vehicles/response/${vehicle.vehicleNumber}`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       allow: true,
  //       guardId: "Guard_001",
  //       reason: reason
  //     })
  //   })
  //   .then(response => {
  //     if (!response.ok) throw new Error("Failed to process allow entry");
  //     return response.text(); // ✅ use .text()
  //   })
  //   .then(() => {
  //     setBlockedVehicles(prev => 
  //       prev.filter(v => v.vehicleNumber !== vehicle.vehicleNumber)
  //     );
  //     setReason(""); // ✅ Clear reason after allowing
  //   })
  //   .catch(error => {
  //     console.error("Error processing allow entry:", error);
  //     alert("Failed to process allow entry. Please try again.");
  //   });
  // };
  const handleAllowEntry = (vehicle) => {
    if (!reason.trim()) {
      alert("Please provide a reason for allowing entry");
      return;
    }

    setEntryStatus(`Allowed ${vehicle.vehicleNumber} with reason: ${reason}`);

    fetch(`http://localhost:8080/api/blocked-vehicles/response/${vehicle.vehicleNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allow: true,
        guardId: "Guard_001",
        reason: reason
      })
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to process allow entry");
      return response.text();
    })
    .then(() => {
      setBlockedVehicles(prev => prev.filter(v => v.vehicleNumber !== vehicle.vehicleNumber));
      setReason("");

      // Now make additional POST to create vehicle entry
      const entryData = {
        vehicleNumber: vehicle.vehicleNumber,
        entryGate: gateNumber ? parseInt(gateNumber) : 1, // use dynamic gateNumber, fallback to 1
        vehicleType: vehicle.vehicleType || "PRIVATE", // default to PRIVATE if type missing
        imageName: vehicle.imageName || "default.jpg"   // default if missing
      };

      return fetch("http://localhost:8080/api/vehicles/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entryData)
      });
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to insert vehicle entry");
      console.log("Vehicle entry inserted successfully");
    })
    .catch(error => {
      console.error("Error during allow entry + vehicle entry:", error);
      alert("Failed to allow entry and insert vehicle. Please try again.");
    });
  };
  
  return (
    <div className="container-fluid mt-4">
      {/* Connection Status */}
      <div className={`alert ${connectionStatus === "Connected" ? "alert-success" : "alert-warning"} mb-4`}>
        <strong>WebSocket Status:</strong> {connectionStatus}
      </div>

      <div className="row">
        {/* Left Half: Blocked Notifications */}
        <div className="col-md-6 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title mb-4">🚨 Blocked Vehicle Alerts</h5>

              {blockedVehicles.length > 0 ? (
                blockedVehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="alert alert-danger d-flex flex-column gap-3 mb-3"
                  >
                    <div className="fs-5">
                      <strong>⚠️ Blocked Vehicle Detected:</strong>{" "}
                      <span
                        className="badge bg-danger fs-4 p-2"
                        style={{
                          border: "2px solid white",
                          boxShadow: "0 0 10px rgba(255,0,0,0.7)",
                        }}
                      >
                        {vehicle.vehicleNumber}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStopEntry(vehicle)}
                      >
                        Stop Entry
                      </button>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Reason for allowing..."
                        style={{ maxWidth: "250px" }}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />

                      <button
                        className="btn btn-success"
                        onClick={() => handleAllowEntry(vehicle)}
                        disabled={!reason.trim()}
                      >
                        Allow Entry
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No blocked vehicles detected right now.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Half: Allowed Notifications */}
        <div className="col-md-6 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title mb-4">✅ Allowed Vehicle Notifications</h5>
              <AllowedNotification vehicle={allowedVehicle} />
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {entryStatus && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="alert alert-info">
              <strong>Status:</strong> {entryStatus}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GateDashboard;