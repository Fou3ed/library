'use-strict'
import {dotenv,express,cookieParser,helmet,createServer,process,Server,instrument} from './dependencies.js'
dotenv.config();
import dbServer from "./DB.js";
import ioConversationEvents from './models/conversations/conversationEvents.js';
import ioMessageEvents from './models/messages/messageEvents.js';
import ioUserEvents from './models/chatEvents.js/userActionEvents.js';
import logger from './config/newLogger.js';
import ioConnEvents from './models/connection/connectionEvents.js';
// import actions from './models/messages/messageMethods.js';
/**
 * => Calls the express function "express()" and puts new Express application inside the app variable (to start a new Express application).
 *  It's something like you are creating an object of a class. Where "express()" is just like class and app is it's newly created object.
 */

const app = express();

/**
 *******************************************************     SERVER INITIALIZATION    ************************************************************************************
 */

/**
 *  The http.createServer() method turns your computer into an HTTP server.
 *  The http.createServer() method creates an HTTP Server object.
 *   The HTTP Server object can listen to ports on your computer and execute a function, a requestListener, each time a request is made. 
 */
const httpServer = createServer(app);
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
app.use(express.urlencoded({
  extended: true
}));
/**
 * The ‘uncaughtException’ is an event of class Process within the process module which is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
 */
process.on("uncaughtException", (err) => {
  console.log(err.name);
  console.log(err.message);
  console.log("shutting down...");
  process.exit(1);
});
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

/**
 *  SOCKET Initialization with EXPRESS and Settling CORS options 
 */
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "https://admin.socket.io"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }
}

);
ioConnEvents()
ioConversationEvents()
ioMessageEvents()
ioUserEvents()

/* It's a monitoring tool for socket.io. */
instrument(io, {
  auth: false,
  mode: "development",
});




/* It's listening to the port number that is stored in the .env file. */
httpServer.listen(process.env.PORT,()=>{
  logger.error(`server up and running on port : ${process.env.PORT}`)
  logger.info('tawa')
});
console.log(process.env.PORT) 
