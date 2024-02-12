import { Server } from "socket.io";
import server from "../config/ServerCreator";

// class Notifier extends Server {
//   constructor(server: http.Server) {
//     super(server)
//   }
// }

export const notifier = new Server(server);