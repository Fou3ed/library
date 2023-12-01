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
  cs
} from "./dependencies.js";
dotenv.config();
import {readFileSync} from 'fs'
import ioConversationEvents from './models/conversations/conversationEvents.js';
import ioMessageEvents from './models/messages/messageEvents.js';
import ioChatEvents from './models/chatEvents.js/userActionEvents.js';
import logger from "./config/newLogger.js";
import ioConnEvents from './models/connection/connectionEvents.js';
import dbServer from "./DB.js";
import ioUserEvents from './models/user/userEvents.js';
import ioAppEvents from "./models/app/appEvents.js";
import ioConversationMembersEvents from "./models/convMembers/convMembersEvents.js"
import getApiKeys from "./utils/getApiKeys.js";
import {updateAllConversationsActivities} from './services/conversationsRequests.js'

const app = express();
const httpServer = cs(app);
import bodyParser from "body-parser";
const wsServer = cs({
  //  key: readFileSync(process.env.KEY_PATH),
  //  cert: readFileSync(process.env.CERT_PATH)
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

export const io = new Server(wsServer, {
  pingTimeout: 60000, 
  cors: {
    origin:process.env.CORS.split(','),
    allowedHeaders: ["content-type"]
  }
});



import userRoutes from './routers/usersRoutes.js'
import messageRoutes from './routers/messageRoutes.js'
import conversationRoutes from './routers/conversationRoutes.js'
import  getReact  from "./routers/reactRoutes.js";
import GetLastMessage  from "./routers/messageRoutes.js";
import getMembers from "./routers/membersRoutes.js"
import getForms from './utils/forms.js'

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
// Call the getForms function
  getForms()
  await  getApiKeys()
/****
 *
 */
process.on("uncaughtException", (err) => {
  console.log(err.name);
  console.log(err);

  console.log("shutting down...");
  process.exit(1);
});

/* It's a monitoring tool for socket.io. */
instrument(io, {
  auth: false,
  mode: "development",
});


process.on('SIGINT', async () => {
  try {
    await updateAllConversationsActivities();
    setTimeout(() => {
      process.exit(0);
    }, 5000); 
  } catch (error) {
    console.error('Error updating all conversations and users:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await updateAllConversationsActivities();
    setTimeout(() => {
      process.exit(0);
    }, 5000); 
  } catch (error) {
    console.error('Error updating all conversations and users:', error);
    process.exit(1);
  }
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

/* data base connection */
dbServer();

/* It's listening to the port number that is stored in the .env file. */
httpServer.listen(process.env.HTTP_PORT,'0.0.0.0', () => {
  console.log(`server up and running on port : ${process.env.HTTP_PORT}`);
  logger.info(`server is running smoothly : ${Date.now()}`);
});

/* It's listening to the port number that is stored in the .env file. */
wsServer.listen(process.env.WS_PORT,'0.0.0.0', () => {
  console.log(`ws  up and running on port : ${process.env.WS_PORT}`);
  logger.info("ws is running smoothly");
});
  