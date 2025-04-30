import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const AllowedNotification = () => {
  const [allowedVehicles, setAllowedVehicles] = useState([]);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws",
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    });

    stompClient.onConnect = () => {
      console.log("Connected to WebSocket");

      // Subscribe to allowed vehicle notifications
      stompClient.subscribe("/topic/allowed-vehicle", (message) => {
        const vehicle = JSON.parse(message.body);
        console.log("Allowed vehicle received:", vehicle);
        
        // Add new vehicle to the list with a unique ID
        const vehicleWithId = {
          ...vehicle,
          id: Date.now(), // Use timestamp as unique ID
        };
        
        setAllowedVehicles(prev => [...prev, vehicleWithId]);

        // Remove notification after 10 seconds
        setTimeout(() => {
          setAllowedVehicles(prev => 
            prev.filter(v => v.id !== vehicleWithId.id)
          );
        }, 30000);
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("Broker reported error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
    };

    stompClient.activate();

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, []);

  const handleDelete = (id) => {
    setAllowedVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  if (allowedVehicles.length === 0) return null;

  return (
    <div className="notifications-container">
      {allowedVehicles.map(vehicle => (
        <div key={vehicle.id} className="alert alert-success mb-3 position-relative">
          <button 
            type="button" 
            className="btn-close position-absolute top-0 end-0 m-2"
            onClick={() => handleDelete(vehicle.id)}
            aria-label="Close"
          ></button>
          
          <h5>✅ Vehicle Entry</h5>
          <p className="mb-1">Vehicle Number: {vehicle.vehicleNumber}</p>
          <p className="mb-1">Entry Gate: {vehicle.entryGate}</p>
          <p className="mb-0">Time: {new Date(vehicle.entryTime).toLocaleTimeString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AllowedNotification;