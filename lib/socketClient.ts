import { io } from "socket.io-client";

// Create a singleton socket client with polling fallback so the server
// initializes via HTTP before upgrading to websocket (fixes early-close).
const socket = io({
  path: "/api/socket",
  // Start with polling so the Next API route can spin up before upgrading.
  transports: ["polling", "websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 8,
  reconnectionDelay: 800,
  timeout: 10000,
});

socket.on("connect_error", (err) => {
  console.warn("socket-client:connect_error", err?.message);
});

socket.on("error", (err) => {
  console.warn("socket-client:error", err);
});

export default socket;
