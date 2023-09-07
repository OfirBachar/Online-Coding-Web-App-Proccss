const {Server} = require("socket.io");
import codeBlockRouter from "../server/Routes/codeBlockRoute"

const io = new Server({cors: "http://localhost:5173"});
// Store the count of people in the code block
let peopleCount = 0;

io.on('connection', (socket) => {
  // Increment the count when a user joins
  userCount += 1;
  io.emit('updateUserCount', userCount);

  socket.on('disconnect', () => {
    // Decrement the count when a user leaves
    peopleCount -= 1;
    io.emit('updateUserCount', userCount);
  });
});

app.use('/codeBlocks', codeBlockRouter); // Use your code block router


// const codeBlockClients = {};

// io.on('connection', (socket) => {
//   socket.on('joinCodeBlock', (codeBlockId) => {
//     // Join a specific code block room
//     socket.join(codeBlockId);

//     // Store client information
//     if (!codeBlockClients[codeBlockId]) {
//       codeBlockClients[codeBlockId] = [];
//     }
//     codeBlockClients[codeBlockId].push(socket.id);

//     // Emit the updated count to the room
//     io.to(codeBlockId).emit('userCount', codeBlockClients[codeBlockId].length);
//   });

  
//   socket.on('disconnect', () => {
//     // Handle client disconnection and update the count
//     const codeBlockId = Object.keys(codeBlockClients).find((key) =>
//       codeBlockClients[key].includes(socket.id)
//     );

//     if (codeBlockId) {
//       codeBlockClients[codeBlockId] = codeBlockClients[codeBlockId].filter(
//         (clientId) => clientId !== socket.id
//       );

//       io.to(codeBlockId).emit('userCount', codeBlockClients[codeBlockId].length);
//     }
//   });
// });

// // let onlineUsers = []

// // io.on("conection", (socket) => {
// //     console.log("new connection", socket,id);

// //     socket.on("addNewUser", (userId) => {
// //         !openCodeBlocks.some((user) => user.userId === userId) &&
// //         openCodeBlocks.push({
// //             codeBlockId,
// //             socketId: socket.id,
// //         });      
// //     });
// //     console.log("openCodeBlocks", openCodeBlocks)    
// // });

io.listen(7000);