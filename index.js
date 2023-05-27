require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
require('./connections/db');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let apiRouter = require('./routes/api')(express.Router());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.listen(3000, function () {
    console.log("Server is runing on port 3000");
})

app.use('/api/v1/', apiRouter);
