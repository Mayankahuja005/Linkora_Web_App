import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import http from "http";
import { Server } from "socket.io";

import express from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import connectionRoutes from "./routes/connectionRoutes.js"
// import { create } from "node:domain";
const app=express()
const server=http.createServer(app)

app.use(cors())
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const onlineUsers = new Map();


app.use(express.json())

const connectDB=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB CONNECTED SUCCESSFULLY!!")
    } catch (err) {
        console.log("MONGODB FAILED TO CONNECT",err.message)
    }
}
connectDB();

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id)

  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id)
    console.log(onlineUsers)
  });

  socket.on("call-user", ({ receiverId, callerId }) => {
    const receiverSocketId = onlineUsers.get(receiverId)
    console.log("Caller:", callerId);
    console.log("Receiver:", receiverId);
    console.log("Receiver Socket:", receiverSocketId);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("incoming-call", {
        callerId
        });
    }
  });
  socket.on("accept-call", ({ callerId, receiverId }) => {
    const callerSocketId = onlineUsers.get(callerId)
    if (callerSocketId) {
        io.to(callerSocketId).emit("call-accepted", {
            receiverId,
        })
    }
  })
  socket.on("reject-call", ({ callerId, receiverId }) => {
    const callerSocketId = onlineUsers.get(callerId)
    if (callerSocketId) {
        io.to(callerSocketId).emit("call-rejected", {
            receiverId,
        })
    }
  })

  socket.on("offer", ({ offer, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("offer", {
        offer,
      })
    }
  });

  socket.on("answer", ({ answer, callerId }) => {
    const callerSocketId = onlineUsers.get(callerId)

    if (callerSocketId) {
      io.to(callerSocketId).emit("answer", {
        answer,
      })
    }
  })

  socket.on("ice-candidate", ({ candidate, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId)

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ice-candidate", {
        candidate,
      })
    }
  })
  socket.on("end-call", ({ receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("end-call");
    }
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

});

app.use("/api/auth",authRoutes)
app.use("/api/profile",profileRoutes)
app.use('/api/connections', connectionRoutes)
const PORT=process.env.PORT

server.listen(PORT,()=>{
    console.log(`Server Started at PORT : ${PORT}`)
})