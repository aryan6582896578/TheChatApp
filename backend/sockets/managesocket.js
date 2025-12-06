import { getServerChannelData, getServerData } from "../database/managedata.js";
import { verifyJwt } from "../database/managedata/authData.js";
import { createCustomId } from "../database/managedata/customData.js";
import { messageDataModel } from "../database/schema/databaseSchema.js";

export default async function runsocket(io) {
  io.on("connection", (socket) => {

  //  socket.on("testserver",async (y)=>{
  //       console.log(y,"Ff")
  //       io.to("testserver").emit("testserver", "hmmmmmm  testserver");
  //  })
// console.log(socket.handshake.auth)
    if(socket.handshake.auth.jwtToken){

      socket.on("joinServer", async ({  jwtToken,serverId,channelId }) => {
      const validToken = verifyJwt(jwtToken,"socket joinserver");
      if(validToken){
        const channelData = await getServerChannelData(channelId);
        if(channelData){
          if (channelData.members.includes(validToken.userId)){
            socket.validUser = true;
            socket.userId = validToken.userId;
            socket.username = validToken.username;
            socket.serverId = serverId;
            socket.channelId = channelId;

            socket.join(`${serverId}/${channelId}`);
            socket.join(`${serverId}`);
            console.log(socket.username,"is online in",socket.serverId,socket.channelId)
          }
        }

      socket.on(`${socket.serverId}/${socket.channelId}`, (data) => {
        if(socket.validUser && data.message){
          const messageId = String(createCustomId())
          console.log(`---------\nmessage in \nserver: ${socket.serverId} \nchannel: ${socket.channelId} \nuser: ${socket.username} \nmessage: ${data.message}`)
          const messageData = {
            message:data.message,
            date:data.date,
            messageId:messageId,
            userId:socket.userId,
            serverId:socket.serverId,
            channelId:socket.channelId,
            username:socket.username,
            userprofileurl:data.userprofileurl
          }
          try {
            messageDataModel.create({
              _id: messageId,
              serverId: socket.serverId,
              channelId: socket.channelId,
              userId: socket.userId,
              displayDate:data.date,
              message:data.message,
              username:socket.username,
              userprofileurl:data.userprofileurl
            })
            console.log(socket.serverId,socket.channelId,"FF")
            const count = io.engine.clientsCount;
            console.log("Online total ", count);
            const onlineUserCount = io.sockets.adapter.rooms.get(`${socket.serverId}/${socket.channelId}`)?.size || 0;
            io.to(`${socket.serverId}/${socket.channelId}`).emit(`${socket.serverId}/${socket.channelId}`, messageData,onlineUserCount); 
          } catch (error) {
            console.log("error sending || saving message",error)
          }
        }
        
      });
      }
      });
   
      socket.on("joinUserUpdates", async ({jwtToken})=>{
        const validToken = verifyJwt(jwtToken , "v2 socket join user updates");
        if(validToken){
          socket.validUser = true;
          socket.userId = validToken.userId;
          socket.username = validToken.username;
          socket.join(`${socket.userId}`);
          console.log(`USER - ${socket.username} joined user updates`)
        }
        socket.on(`${socket.userId}`,(data)=>{
          if(socket.validUser){
            console.log(data);
            console.log("backend user update socket ")
            io.to(`${socket.userId}`).emit(`${socket.userId}`, "backend user update socket ");
          }
      })
      
      })
    }

});
}
