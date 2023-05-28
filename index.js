// REQUIRED PACKAGES
require('dotenv').config();
require('./connections/db');
const express = require("express"),
    bodyParser = require('body-parser');


// EXPRESS FRAMEWORK SETUP
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// IMPORT ROUTERS
let apiRouter = require('./routes/api')(express.Router()),
    authRouter = require('./routes/auth')(express.Router());


// IMPORT MIDDLEWARES
let tokenMiddleWare = new (require('./middlewares/tokenMiddleware'));


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


// PORT
app.listen(3000, function () {
    console.log("Server is runing on port 3000");
})


// NODE JS ROUTING
app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/', tokenMiddleWare.isValid, apiRouter);


