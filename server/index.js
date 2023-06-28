import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import socketio from "socket.io"


//mogodb connection
import '../config/mongo.js'

//socket configuration

import WebSockets from "../utils/WebSockets.js";

// routes

import indexRouter from "../routes/index.js";
import userRouter from "../routes/user.js";
import chatRoomRouter from "../routes/chatRoom.js";
import deleteRouter from "../routes/delete.js";


//middleware

import { decode } from '../middlewares/jwt.js'

const app = express()


const port = process.env.PORT || "3000"

app.set("port", port)
app.use(express.json())
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint doesnt exist'
    })
  });

/** Create HTTP server. */
const server = http.createServer(app);

/** Create socket connection */
global.io = socketio.listen(server);
global.io.on('connection', WebSockets.connection)

/** Listen on provided port, on all network interfaces. */

server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});