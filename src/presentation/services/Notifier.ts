import { Server } from "socket.io";
import server from "../factory/ServerCreator";

// class Notifier extends Server {
//   constructor(server: http.Server) {
//     super(server)
//   }
// }

export const notifier = new Server(server);