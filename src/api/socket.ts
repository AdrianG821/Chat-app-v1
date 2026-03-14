import { io, Socket } from "socket.io-client"
import { getToken } from '../auth'



export const socket: Socket = io("http://localhost:3000", {
  autoConnect: false,
  auth: {
    token: getToken(),
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Socket connected")
})
