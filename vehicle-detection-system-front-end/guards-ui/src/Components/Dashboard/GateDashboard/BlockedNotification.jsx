import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BlockedNotification = () => {
  const [blockedVehicles, setBlockedVehicles] = useState([]); // Changed to an array
  const [reason, setReason] = useState("");
  const [entryStatus, setEntryStatus] = useState("");

  useEffect(() => {
    // Create a new STOMP client
    const stompClient = new Client({
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // Reconnect after 5 seconds if the connection is lost
      heartbeatIncoming: 4000, // Heartbeat interval for incoming messages
      heartbeatOutgoing: 4000, // Heartbeat interval for outgoing messages
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"), // Use SockJS for fallback
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      // Subscribe to the blocked vehicle topic
      stompClient.subscribe("/topic/blocked-vehicle", (message) => {
        const vehicle = JSON.parse(message.body);
        console.log("Blocked vehicle received:", vehicle);

        // Add new vehicle to the list
        setBlockedVehicles((prevVehicles) => [...prevVehicles, vehicle]);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    // Activate the STOMP client
    stompClient.activate();

    // Cleanup WebSocket connection on component unmount
    return () => {
      stompClient.deactivate();
    };
  }, []);

  // const clearNotification = () => {
  //   setReason("");
  // };

  const handleStopEntry = (vehicle) => {
    setEntryStatus(`Entry Stopped for vehicle ${vehicle.vehicleNumber}`);
    alert(`Entry has been stopped for ${vehicle.vehicleNumber}.`);
    setBlockedVehicles((prevVehicles) => prevVehicles.filter(v => v.vehicleNumber !== vehicle.vehicleNumber)); // Remove vehicle from the list
  };

  const handleAllowEntry = (vehicle) => {
    setEntryStatus(`Allowed ${vehicle.vehicleNumber} with reason: ${reason}`);
    alert(`Vehicle ${vehicle.vehicleNumber} allowed with reason: ${reason}`);

    // Send allow entry response to the backend
    fetch("http://localhost:8080/api/vehicles/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleNumber: vehicle.vehicleNumber,
        entryGate: vehicle.entryGate, // Use the appropriate gate
        vehicleType: vehicle.vehicleType,
        imageName: vehicle.imageName,
        reason: reason, // Add the reason for allowing
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to process the response.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Allow response sent:", data);
        alert("Response processed successfully.");
      })
      .catch((error) => {
        console.error("Error sending allow response:", error);
        alert("Failed to process the response. Please try again.");
      });

    setReason(""); // Reset reason input after sending allow entry
  };

  return (
    <div className="card shadow">
      <div className="card-body">
        <h5 className="card-title mb-4">🚨 Blocked Vehicle Alerts</h5>

        {blockedVehicles.length > 0 ? (
          blockedVehicles.map((vehicle, index) => (
            <div key={index} className="alert alert-danger d-flex flex-column gap-3">
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
                  Entry Stopped
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
                  Allow
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No blocked vehicles detected right now.</p>
        )}

        {/* Show latest status */}
        {entryStatus && (
          <div className="mt-3 alert alert-info">
            <strong>Status:</strong> {entryStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedNotification;
