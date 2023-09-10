const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const codeBlockRoute = require("./Routes/codeBlockRoute");
const socketDef = require("./socket/socketDef");
const {Server} = require("socket.io");


const app = express();
const server = require("http").createServer(app);

require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/codeBlocks/", codeBlockRoute);

app.get("/", (req, res) => {
    res.send("Welcome our online coding web app");
});

const port = process.env.PORT || 7000;

app.use(cors({
    origin: 'https://online-coding-web-app-client.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

server.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
} );


mongoose.connect("mongodb+srv://ofir4bachar:Tlida2855@cluster0.b1arvxb.mongodb.net/OnlineCodingWebApp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connection established"))
.catch((error) => console.log("MongoDB connection failed: " , error.message));

const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

socketDef(io);



  
