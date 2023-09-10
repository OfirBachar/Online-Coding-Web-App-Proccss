const {Server} = require("socket.io");
const cors = require("cors");

const io = new Server ({cors:"https://online-coding-web-app-client.vercel.app"});

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("send-code-block-title", async (initInfo) => {
        if (initInfo.codeBlockTitle) { 
          if (!userCount[initInfo.codeBlockTitle]) {
            userCount[initInfo.codeBlockTitle] = new Set();
          }
          userCount[initInfo.codeBlockTitle].add(initInfo.userId);
        }
        console.log("userCount[initInfo.codeBlockTitle]",userCount[initInfo.codeBlockTitle]);
        console.log("initInfo.userId",initInfo.userId);

        
        socket.join(initInfo.codeBlockTitle);

        if(userCount[initInfo.codeBlockTitle]){
          console.log(initInfo.codeBlockTitle,userCount[initInfo.codeBlockTitle].size);

          socket.emit("receive-codeBlock", {
            ...initInfo.codeBlock._doc,
            user: socket.id,
            isMentor: userCount[initInfo.codeBlockTitle].size === 1,
          });
        }else{
          socket.emit("receive-codeBlock", {
            ...initInfo.codeBlock._doc,
            user: socket.id,
            isMentor: true,
          });
        }

      });
  
      socket.on("correct-answer", (codeBlockTitle) => {
        socket.broadcast.to(codeBlockTitle).emit("solve-exercise");
      });
  
      socket.on("send-changes", (changes) => {
        socket.broadcast
          .to(changes?.title)
          .emit("receive-changes", changes?.code);
      });
  
      socket.on("remove-user", (data) => {
        console.log(`user ${data.userId} deleted`);
        
        if (!userCount[data.codeBlockTitle]) {
          userCount[data.codeBlockTitle] = new Set();
        }
        userCount[data.codeBlockTitle].delete(data.userId);
      });
  
      socket.on("disconnect", () => {
        console.log("User disconnect");
      });
})

io.listen(5000);