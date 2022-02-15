const express = require('express');
const multer = require("multer");
const userController = require("./controllers/userController");
const chatController = require("./controllers/chatController");
const {cloudinaryConfig, storage} = require("./cloudinary");
const cloudinary =  require("cloudinary").v2;
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { boxModel } = require("./models/boxSchema");
require('dotenv').config();

//set up websocket
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    }
});

// database connection
mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result:any) => server.listen(process.env.PORT || 8000))
  .catch((err:any) => console.log(err));

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: storage });

app.post("/signin", userController.signin_post);

app.post("/signup", upload.single('avatar'), userController.signup_post);

//get all user's box chat
app.get("/box", chatController.get_all_box);

//create box chat
app.post("/box", chatController.create_box);

//join box chat
app.put("/box", chatController.join_box);

//delete box chat
app.delete("/box", chatController.delete_box)

//get data a box
app.get("/box/:id", chatController.get_box);

//send message to box chat
app.post("/box/:id", chatController.send_message);

//out box chat
app.delete("/box/:id", chatController.out_box);

io.use(async(socket:any, next:any) => {
  if (socket.handshake.query && socket.handshake.query.token){
      const id = await decodeToken(socket.handshake.query.token);
      socket.handshake.query.id = id;
      next();
  } else {
      next(new Error('Authentication error'));
  }  
});

io.on('connection', async (socket:any) => {
  const userId = socket.handshake.query.id;
  const yourBox = await boxModel.find({member: {$elemMatch: {id: userId}}});
  yourBox.forEach((box:any) => {
      socket.join(box?._id.toString());
  })

  socket.on('join', async (msg:any) => {
      const {boxId, userId} = msg;
      const joinBox = await boxModel.findOne({_id: boxId, member: {$elemMatch: {id: userId}}});
      if(joinBox) {
          socket.join(boxId.toString());
          socket.broadcast.to(boxId.toString()).emit("join", msg);
      }
  });
  
  socket.on('chat', async (msg:any) => {
      const {boxId} = msg;
      socket.to(boxId.toString()).emit("chat", {...msg, userId});
  })

});

const decodeToken = async (token: string) => {
    let id:string = "";
    await jwt.verify(token, process.env.TOKENDECODEPASS, function(err:any, decoded:any) {
        if(!err) {
            id = decoded.id;
        } else {
            throw Error("Xác thực không thành công");
        }
    });
    return id;
}