const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONN_STRING, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
    .then(res => { console.log('Mongodb has been connected'); })
    .catch(err => { console.log(err) })