const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/authRoute');
const chatRoute = require('./routes/chatRoute');
require('dotenv').config();

//set up websocket
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
});
require('./lib/sockets')(io);

// database connection
mongoose
    .connect(process.env.DBURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result: any) => server.listen(process.env.PORT || 8000))
    .catch((err: any) => console.log(err));

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//handle routes
app.use("/", authRoute);
app.use("/box", chatRoute);
