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
// import path from 'path'
dotenv.config();
import ioConversationEvents from './models/conversations/conversationEvents.js';
import ioMessageEvents from './models/messages/messageEvents.js';
import ioChatEvents from './models/chatEvents.js/userActionEvents.js';
import logger from "./config/newLogger.js";
import ioConnEvents from './models/connection/connectionEvents.js';
import dbServer from "./DB.js";
import ioUserEvents from './models/user/userEvents.js';
import ioAppEvents from "./models/app/appEvents.js";
import ioConversationMembersEvents from "./models/convMembers/convMembersEvents.js"
import redisAdapter from 'socket.io-redis'
const app = express();
const httpServer = createServer(app);



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

export const io = new Server(httpServer, {
  pingTimeout: 60000, // Set the timeout to 60 seconds
  cors: {
    origin: ["http://localhost:5500", "https://admin.socket.io","http://localhost:3000","http://192.168.1.19:3000/","http://143.198.55.254:3000/","http://192.168.0.41:3000/"],
    allowedHeaders: ["content-type"]
  }
});


io.sockets.setMaxListeners(20)

io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

import userRoutes from './routers/usersRoutes.js'
import messageRoutes from './routers/messageRoutes.js'
import conversationRoutes from './routers/conversationRoutes.js'
import  getReact  from "./routers/reactRoutes.js";
import GetLastMessage  from "./routers/messageRoutes.js";
import getMembers from "./routers/membersRoutes.js"
app.use('/users',userRoutes)
app.use('/messages/', messageRoutes);
app.use('/conversation/',conversationRoutes)
app.use('/react/',getReact)
app.use('/message',GetLastMessage)
app.use('/members',getMembers)

ioConnEvents()
ioConversationEvents() 
ioMessageEvents()
ioChatEvents()
ioUserEvents()
ioAppEvents()
ioConversationMembersEvents()  

/****
 *
 */
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
httpServer.listen(process.env.PORT,'0.0.0.0', () => {
  console.log(`server up and running on port : ${process.env.PORT}`);
  logger.info("server is running smoothly");
});
  