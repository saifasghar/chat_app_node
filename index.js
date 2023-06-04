// REQUIRED PACKAGES
require('dotenv').config();
require('./connections/db');
const express = require("express");
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require("socket.io");


// EXPRESS FRAMEWORK SETUP
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// IMPORT ROUTERS
let apiRouter = require('./routes/api')(express.Router());
let authRouter = require('./routes/auth')(express.Router());


// IMPORT MIDDLEWARES
let tokenMiddleWare = new (require('./middlewares/tokenMiddleware'));
let apiInterceptor = new (require('./middlewares/apiInterceptorMiddleware'))();


// PERMISSION HEADERS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,type');
    next();
});
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    // Send a 200 OK response to the preflight request
    res.sendStatus(200);
});


// Create HTTP server
const server = http.createServer(app);

// Create the Socket.IO server instance
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200", // Replace with your Angular frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected.');

    socket.on('chat message', (msg) => {
        console.log('Received message:', msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});


// PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("Server is running on port", PORT);
});


// NODE JS ROUTING
app.use('/api/v1/auth/', apiInterceptor.setTemplate, authRouter);
app.use('/api/v1/', tokenMiddleWare.isValid, apiInterceptor.setTemplate, apiRouter);
