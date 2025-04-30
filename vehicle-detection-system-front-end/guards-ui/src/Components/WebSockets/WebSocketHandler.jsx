// // WebSocketHandler.jsx
// import React, { useEffect, useState } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { useGlobalContext } from "../ContextAPI/GlobalContext";

// const WebSocketHandler = () => {
//   const [messages, setMessages] = useState([]);
//   const { gateNumber } = useGlobalContext(); // Get the selected gate number from global state
//   const [stompClient, setStompClient] = useState(null);

//   //   useEffect(() => {
//   //     if (gateNumber) {
//   //       const client = new Client({
//   //         brokerURL: 'ws://localhost:8080/ws', // URL of your Spring Boot WebSocket endpoint
//   //         connectHeaders: {
//   //           // You can add authentication headers here if needed
//   //           // Authorization: 'Bearer ' + yourToken,
//   //         },
//   //         debug: (str) => console.log(str),
//   //         reconnectDelay: 5000,
//   //         heartbeatIncoming: 4000,
//   //         heartbeatOutgoing: 4000,
//   //       });

//   //       client.onConnect = () => {
//   //         console.log('WebSocket Connected');
//   //         // Subscribe to the relevant topic based on gateNumber or any other parameters
//   //         client.subscribe(`/topic/gate/${gateNumber}`, (message) => {
//   //           // Handle incoming messages (you can parse them as JSON if needed)
//   //           setMessages((prevMessages) => [...prevMessages, message.body]);
//   //         });
//   //       };

//   //       client.activate();
//   //       setStompClient(client);

//   //       return () => {
//   //         if (client) {
//   //           client.deactivate();
//   //         }
//   //       };
//   //     }
//   //   }, [gateNumber]);
//   useEffect(() => {
//     if (gateNumber) {
//       const client = new Client({
//         webSocketFactory: () => new SockJS("http://localhost:8080/ws"), // <-- use SockJS factory
//         connectHeaders: {
//           // Optional headers
//         },
//         debug: (str) => console.log(str),
//         reconnectDelay: 5000,
//         heartbeatIncoming: 4000,
//         heartbeatOutgoing: 4000,
//       });

//       client.onConnect = () => {
//         console.log("WebSocket Connected");
//         client.subscribe(`/topic/gate/${gateNumber}`, (message) => {
//           setMessages((prevMessages) => [...prevMessages, message.body]);
//         });
//       };

//       client.activate();
//       setStompClient(client);

//       return () => {
//         if (client) {
//           client.deactivate();
//         }
//       };
//     }
//   }, [gateNumber]);

//   return (
//     <div>
//       <h3>Gate {gateNumber} Messages:</h3>
//       <ul>
//         {messages.map((message, index) => (
//           <li key={index}>{message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default WebSocketHandler;


// WebSocketHandler.jsx
import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useGlobalContext } from "../ContextAPI/GlobalContext";

const WebSocketHandler = () => {
  const [messages, setMessages] = useState([]);
  const { gateNumber } = useGlobalContext();
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (gateNumber) {
      const client = new Client({
        webSocketFactory: () => new SockJS("/ws"),
        connectHeaders: {},
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log("✅ WebSocket Connected");
        client.subscribe(`/topic/gate/${gateNumber}`, (message) => {
          setMessages((prevMessages) => [...prevMessages, message.body]);
        });
      };

      client.onStompError = (frame) => {
        console.error("❌ Broker error: " + frame.headers['message']);
        console.error("Details: " + frame.body);
      };

      client.onWebSocketError = (event) => {
        console.error("❌ WebSocket error", event);
      };

      client.onWebSocketClose = (event) => {
        console.warn("⚠️ WebSocket closed", event);
      };

      client.activate();
      setStompClient(client);

      return () => {
        if (client && client.active) {
          client.deactivate();
        }
      };
    }
  }, [gateNumber]);

  return (
    <div>
      <h3>Gate {gateNumber} Messages:</h3>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketHandler;
