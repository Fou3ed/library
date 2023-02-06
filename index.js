"use-strict";
import {
  dotenv,
  express,
  cookieParser,
  helmet,
  createServer,
  process,
  Server,
  instrument,
} from "./dependencies.js";
dotenv.config();
import ioConversationEvents from './models/conversations/conversationEvents.js';
import ioMessageEvents from './models/messages/messageEvents.js';
import ioChatEvents from './models/chatEvents.js/userActionEvents.js';
import logger from "./config/newLogger.js";
import ioConnEvents from './models/connection/connectionEvents.js';
import dbServer from "./DB.js";
import ioUserEvents from './models/user/userEvents.js';

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  transports: ["websocket"],
  origin: ["http://localhost:5500", "https://admin.socket.io"],
});

ioConnEvents()
ioConversationEvents()
ioMessageEvents()
ioChatEvents()
ioUserEvents()

/***test */
// Routing

// Chatroom
// let numUsers = 0;

// io.on("connection", (socket) => {
//   let addedUser = false;

//   // when the client emits 'new message', this listens and executes
//   socket.on("new message", (data) => {
//     // we tell the client to execute 'new message'
//     socket.broadcast.emit("new message", {
//       username: socket.username,
//       message: data,
//     });
//   });

//   // when the client emits 'add user', this listens and executes
//   socket.on("add user", (username) => {
//     if (addedUser) return;

//     // we store the username in the socket session for this client
//     socket.username = username;
//     ++numUsers;
//     addedUser = true;
//     socket.emit("login", {
//       numUsers: numUsers,
//     });
//     // echo globally (all clients) that a person has connected
//     socket.broadcast.emit("user joined", {
//       username: socket.username,
//       numUsers: numUsers,
//     });
//   });

//   // when the client emits 'typing', we broadcast it to others
//   socket.on("typing", () => {
//     socket.broadcast.emit("typing", {
//       username: socket.username,
//     });
//   });

//   // when the client emits 'stop typing', we broadcast it to others
//   socket.on("stop typing", () => {
//     socket.broadcast.emit("stop typing", {
//       username: socket.username,
//     });
//   });

//   // when the user disconnects.. perform this
//   socket.on("disconnect", () => {
//     if (addedUser) {
//       --numUsers;

//       // echo globally that this client has left
//       socket.broadcast.emit("user left", {
//         username: socket.username,
//         numUsers: numUsers,
//       });
//     }
//   });
// });

/***************************  */

process.on("uncaughtException", (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log("shutting down...");
  process.exit(1);
});

/* It's a monitoring tool for socket.io. */
instrument(io, {
  auth: false,
  mode: "development",
});

/**
 * The app.use() function adds a new middleware to the app.
 *  Essentially, whenever a request hits your backend, Express will execute the functions you passed to app.use() in order.
 *
 *  express.json() is a built in middleware function in Express starting from v4.16.0. It parses incoming JSON requests and puts the parsed data in req.body.
 */
app.use(express.json());

/**
 * The express.urlencoded() function is a built-in middleware function in Express.
 * It parses incoming requests with urlencoded payloads and is based on body-parser.
 * inflate − This enables or disables the handling of the deflated or compressed bodies. Default: true
 *      limit − This controls the maximum size of the request body.
 *      extended − This option allows to choose between parsing the URL encoded data with the queryString Library or the qs Library.
 *     type − This determines the media type for the middleware that will be parsed.
 *     parameterLimit − This option controls the maximum number of parameters that are allowed in the URL-encoded data.
 */
app.use(
  express.urlencoded({
    extended: true,
  })
);

/**
 * Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
 *
 */
app.use(helmet());
/* It's a middleware that parses the cookies in the request header and puts them in the req.cookies
object. */
app.use(cookieParser());

/* It's a function that connects to the database. */
dbServer();

/* It's listening to the port number that is stored in the .env file. */
httpServer.listen(process.env.PORT, () => {
  console.log(`server up and running on port : ${process.env.PORT}`);
  logger.info("server is running smoothly");
});
