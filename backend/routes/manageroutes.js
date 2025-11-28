import {userDataModel,serverDataModel,inviteDataModel,serverChannelsDataModel, messageDataModel} from "../database/schema/databaseSchema.js";
import {getServerData,validInviteCode,userDataSeverList,validServerChannelList,getChannelName,getServerChannelMemberList,getUsername, getServerChannelData, getUserData, getServerPermission,} from "../database/managedata.js";
import {signJwt,verifyJwt,createPasswordHash,checkPasswordHash,} from "../database/managedata/authData.js";
import { createCustomId } from "../database/managedata/customData.js";
import uploadImage from "../database/managedata/imageData.js";

export default function runroutes(app, socket,upload) {
  async function checkJwt(req, res, next) {
    try {
      const validToken = verifyJwt(req.cookies.tokenJwt);

      if (validToken) {
        const usernameValidToken = validToken.username;
        const userIdValidToken = validToken.userId;
        req.validUser = true,
        req.username = usernameValidToken,
        req.userId = userIdValidToken;
      } else {
        req.validUser = false;
      }
    } catch (error) {
      console.log("no cookie jwtcheck");
    }
    next();
  }

app.post("/v1/me/updateProfilePicture", checkJwt, async (req, res) => {
    async function runMiddleware(req, res, fn) {
      return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      });
    }
    if (req.validUser) {
      const myUploadMiddleware = upload.single("img");       
        try {
          await runMiddleware(req, res, myUploadMiddleware);
          const b64 = Buffer.from(req.file.buffer).toString("base64");
          let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
          const cldRes = await uploadImage(dataURI);
          console.log(cldRes)
          await userDataModel.findOneAndUpdate({
            userid:`${req.userId}`
          },{
            userprofileurl:`${cldRes.url}`
          })
          socket.to(`${req.userId}`).emit(`${req.userId}`, "profile updated");
          console.log("pfp updated")
          res.json({status:"updated"});
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }

    }})
  // app.get("/v1/verify", checkJwt, async (req, res) => {
  //   if (req.validUser) {
  //     let userData = await getUserData(req.username);
  //     res.json({ status: "userValid",username: req.username,userId: req.userId , userprofileurl:userData.userprofileurl});
  //   } else {
  //     res.clearCookie("tokenJwt");
  //     res.json({ status: "userInvalid" });
  //   }
  // });

  // app.post("/v1/loginUser", async (req, res) => {
  //   const usernameLogin = req.body.username;
  //   const passwordLogin = req.body.password;

  //   const validToken = verifyJwt(req.cookies.tokenJwt);
  //   if (validToken) {
  //     res.json({ status: "userValid" });
  //   } else {
  //     if(usernameLogin.length<=15 && passwordLogin.length<=30){
  //       if (usernameLogin && passwordLogin) {
  //         const getUserdata = await userDataModel.findOne({ _id: usernameLogin });
  //         if (getUserdata) {
  //           const userID = getUserdata.userid;
  //           const checkHash = await checkPasswordHash(passwordLogin,getUserdata.password);
  //           try {
  //             if (getUserdata && checkHash === true) {
  //               const createToken = signJwt(usernameLogin, userID);
  //               res.cookie("tokenJwt", createToken, {maxAge: 15 * 24 * 60 * 60 * 1000});
  //               res.json({ status: "userValid" });
  //             } else {
  //               res.json({ status: "userInValid" });
  //             }
  //           } catch (error) {
  //             res.json({ status: "userInValid" });
  //             console.log(error, "some err");
  //           }
  //         } else {
  //           res.json({ status: "userInValid" });
  //         }
  //       } else {
  //         res.json({ status: "missingUsernamePassword" });
  //       }
  //   }else{
  //   res.json({ status: "username length should less than 15 and password less than 30" });
  // }
  // }
  // });

  // app.get("/v1/userDataSeverList", checkJwt, async (req, res) => {
  //   if (req.validUser) {
  //     const userDataSevers = await userDataSeverList(req.username);
  //     res.json({ serverList: userDataSevers , username:req.username});
  //   }
  // });

  // app.get("/v1/getServerData/:id", checkJwt, async (req, res) => {
  //   if (req.validUser) {
  //     const serverData = await getServerData(req.params.id);
  //     res.json({ serverData: serverData });
  //   }
  // });

  // app.get("/v1/serverAdmin/:serverId", checkJwt, async (req, res) => {
  //   const serverId = req.params.serverId;
  //   const userId = req.userId;
  //   if (req.validUser) {
  //     const serverData = await getServerData(serverId);
  //     const adminList = serverData.admins;
  //     if (adminList.includes(userId)) {
  //       res.json({ adminStatus: true });
  //     } else {
  //       res.json({ adminStatus: false });
  //     }
  //   }
  // });

  // app.post("/v1/me/createServer", checkJwt, async (req, res) => {
  //   if (req.validUser) {
  //     try {
  //       const date = new Date();
  //       const currentDate = date.toUTCString();
  //       const serverId = createCustomId();
  //       const userId = await req.userId;
  //       const serverName = req.body.serverName;
  //       await serverDataModel.create({
  //         _id: `${serverId}`,
  //         name: `${serverName}`,
  //         createdDate: `${currentDate}`,
  //         ownerId: `${userId}`,
  //         serverId: `${serverId}`,
  //       });

  //       const channelId = createCustomId();
  //       await serverChannelsDataModel.create({
  //         _id: `${channelId}`,
  //         name: "General",
  //         createdDate: `${currentDate}`,
  //         channelId: `${channelId}`,
  //         serverId: `${serverId}`,
  //       });

  //       await userDataModel.findOneAndUpdate(
  //         { userid: `${userId}` },
  //         { $push: { servers: `${serverId}` } }
  //       );

  //       await serverDataModel.findOneAndUpdate(
  //         { serverId: `${serverId}` },
  //         { $push: { channels: `${channelId}` } }
  //       );

  //       await serverDataModel.findOneAndUpdate(
  //         { serverId: `${serverId}` },
  //         { $push: { members: `${userId}` } }
  //       );
  //       await serverDataModel.findOneAndUpdate(
  //         { serverId: `${serverId}` },
  //         { $push: { admins: `${userId}` } }
  //       );

  //       await serverChannelsDataModel.findOneAndUpdate(
  //         { channelId: `${channelId}` },
  //         { $push: { members: `${userId}` } }
  //       );

  //       await res.json({ status: "CreatedServer", serverId: `${serverId}` });
  //     } catch (error) {
  //       console.log(error, "error in creating server ");
  //     }
  //   }
  // });

  // app.get(
  //   "/v1/permissionCheckServer/:serverId/:userId",
  //   checkJwt,
  //   async (req, res) => {
  //     const userId = req.params.userId;
  //     const serverId = req.params.serverId;
  //     if (req.validUser && req.userId === userId && serverId) {
  //       const serverData = await getServerData(req.params.serverId);
  //       if (serverData) {
  //         const serverMemberList = serverData.members;
  //         if (serverMemberList.includes(userId)) {
  //           const channelList = await validServerChannelList(serverId, userId);
  //           if (channelList.length >= 1) {
  //             res.json({ status: "validChannel", channelId: channelList[0] });
  //           } else {
  //             res.json({ status: "noChannel" });
  //           }
  //         } else {
  //           res.json({ status: "userInValid" });
  //         }
  //       } else {
  //         res.json({ status: "userInValid" });
  //       }
  //     }
  //   }
  // );

  // app.get("/v1/channelList/:serverId/:userId", checkJwt, async (req, res) => {
  //   const userId = req.params.userId;
  //   const serverId = req.params.serverId;
  //   if (req.validUser && req.userId === userId && serverId) {
  //     const serverData = await getServerData(req.params.serverId);
  //     if (serverData) {
  //       const serverMemberList = serverData.members;
  //       if (serverMemberList.includes(userId)) {
  //         const channelList = await validServerChannelList(serverId, userId);
  //         const names = await Promise.all(
  //           channelList.map(async (channelId) => {
  //             const channelName = await getChannelName(channelId);
  //             return [channelId, channelName];
  //           })
  //         );
  //         const channelNameList = Object.fromEntries(names);
  //         return res.json({ channelList: channelNameList });
  //       } else {
  //         res.json({ status: "userInValid" });
  //       }
  //     } else {
  //       res.json({ status: "userInValid" });
  //     }
  //   }
  // });

  // app.get("/v1/channelData/:serverId/:channelId/:userId",checkJwt,async (req, res) => {
  //     const userId = req.params.userId;
  //     const serverId = req.params.serverId;
  //     const channelId = req.params.channelId;
  //     if (req.validUser && req.userId === userId && serverId) {
  //       const serverData = await getServerData(req.params.serverId);
  //       if (serverData) {
  //         const serverMemberList = serverData.members;
  //         if (serverMemberList.includes(userId)) {
  //           const channelName = await getChannelName(channelId);
  //           return res.json({ channelName: channelName });
  //         } else {
  //           res.json({ status: "userInValid" });
  //         }
  //       } else {
  //         res.json({ status: "userInValid" });
  //       }
  //     }
  //   }
  // );

  // app.get("/v1/channelMemberList/:serverId/:channelId/:userId",checkJwt,async (req, res) => {
  //     const userId = req.params.userId;
  //     const serverId = req.params.serverId;
  //     const channelId = req.params.channelId;
  //     if (req.validUser && req.userId === userId && serverId) {
  //       const serverData = await getServerData(serverId);
  //       if (serverData) {
  //         const serverMemberList = serverData.members;
  //         if (serverMemberList.includes(userId)) {
  //           const channelList = await validServerChannelList(serverId, userId);
  //           if (channelList.includes(channelId)) {
  //             const usernameList = await getServerChannelMemberList(channelId);

  //             const usernames = await Promise.all(
  //               usernameList.map(async (userId) => {
  //                 const username = await getUsername(userId);
  //                 return [userId, username];
  //               })
  //             );
  //             const usernameListData = Object.fromEntries(usernames);
  //             return res.json({ usernameList: usernameListData });
  //           } else {
  //             res.json({ status: "noUsers" });
  //           }
  //         } else {
  //           res.json({ status: "userInValid" });
  //         }
  //       } else {
  //         res.json({ status: "userInValid" });
  //       }
  //     }
  //   }
  // );

  // app.post("/v1/me/createChannel/:serverId", checkJwt, async (req, res) => {
  //   const userId = req.userId;
  //   const serverId = req.params.serverId;
  //   const channelName = req.body.channel;
  //   if (req.validUser && userId && channelName && serverId) {
  //     const serverData = await getServerData(serverId);
  //     if (serverData) {
  //       const serverAdminList = serverData.admins;
  //       if (serverAdminList.includes(userId)) {
  //         const channelId = createCustomId();
  //         const date = new Date();
  //         const currentDate = date.toUTCString();
  //         await serverChannelsDataModel.create({
  //           _id: `${channelId}`,
  //           name: `${channelName}`,
  //           createdDate: `${currentDate}`,
  //           channelId: `${channelId}`,
  //           serverId: `${serverId}`,
  //         });
  //         const serverMemberList = serverData.members;
  //         serverMemberList.map(async (x) => {
  //           await serverChannelsDataModel.findOneAndUpdate(
  //             { channelId: `${channelId}` },
  //             { $push: { members: `${x}` } }
  //           );
  //         });

  //         await serverDataModel.findOneAndUpdate(
  //           { serverId: `${serverId}` },
  //           { $push: { channels: `${channelId}` } }
  //         );
  //         res.json({ status: "channelCreated", channelId: `${channelId}` });
  //       } else {
  //         res.json({ status: "invalidUser" });
  //       }
  //     } else {
  //       res.json({ status: "invalidData" });
  //     }
  //   } else {
  //     console.log("noo");
  //     res.json({ status: "invalidData" });
  //   }
  // });

  // app.get("/v1/inviteCode/:serverId", checkJwt, async (req, res) => {
  //   const serverId = req.params.serverId;
  //   const userId = req.userId;
  //   if (req.validUser && serverId) {
  //     const serverData = await getServerData(serverId);
  //     if (serverData) {
  //       const serverAdminList = serverData.admins;
  //       if (serverAdminList.includes(userId)) {
  //         try {
  //           const serverInviteCode = await inviteDataModel.findOne({
  //             serverId: `${serverId}`,
  //           });
  //           if (serverInviteCode) {
  //             res.json({
  //               status: "created",
  //               inviteCode: `${serverInviteCode.inviteCode}`,
  //             });
  //           } else {
  //             const inviteCode = await validInviteCode(serverId);
  //             res.json({ status: "created", inviteCode: `${inviteCode}` });
  //           }
  //         } catch (error) {
  //           console.log(error, "create invite code");
  //         }
  //       } else {
  //         res.json({ status: "notAdmin" });
  //       }
  //     } else {
  //       res.json({ status: "invalidData" });
  //     }
  //   }
  // });

  // app.post("/v1/me/joinServer", checkJwt, async (req, res) => {
  //   if (req.validUser) {
  //     const serverInviteCodeJoin = req.body.serverInviteCode;
  //     try {
  //       const serverInviteCode = await inviteDataModel.findOne({
  //         inviteCode: `${serverInviteCodeJoin}`,
  //       });
  //       if (serverInviteCode) {
  //         const getUserid = req.userId;

  //         const userInServerCheck = await userDataModel.findOne({
  //           userid: `${getUserid}`,
  //         });

  //         if (userInServerCheck.servers.includes(serverInviteCode.serverId)) {
  //           await res.json({
  //             status: "alreadyJoined",
  //             serverId: `${serverInviteCode.serverId}`,
  //           });
  //         } else {
  //           const channelList = await serverDataModel.findOne({
  //             serverId: serverInviteCode.serverId,
  //           });
  //           await userDataModel.findOneAndUpdate(
  //             { userid: `${getUserid}` },
  //             { $push: { servers: `${serverInviteCode.serverId}` } }
  //           );
  //           await serverDataModel.findOneAndUpdate(
  //             { serverId: `${serverInviteCode.serverId}` },
  //             { $push: { members: `${getUserid}` } }
  //           );
  //           const channelListId = channelList.channels;
  //           channelListId.map(async (x) => {
  //             await serverChannelsDataModel.findOneAndUpdate(
  //               { channelId: `${x}` },
  //               { $push: { members: `${getUserid}` } }
  //             );
  //           });
  //           await res.json({status: "ServerJoined",serverId: `${serverInviteCode.serverId}`,});
  //         }
  //       } else {
  //         res.json({ status: "invalidCode" });
  //       }
  //     } catch (error) {
  //       console.log(error, "error in joining server ");
  //     }
  //   }
  // });

  app.get("/v1/messageData/:serverId/:channelId/:messageLength",checkJwt,async (req, res) => {
      const userId = req.userId;
      const serverId = req.params.serverId;
      const channelId = req.params.channelId;
      const messageLength = req.params.messageLength
      if (req.validUser && req.userId && serverId) {
        const serverData = await getServerData(serverId);
        if (serverData) {
          const serverMemberList = serverData.members;
          if (serverMemberList.includes(userId)) {
            const channelData = await getServerChannelData(channelId)
            if(channelData){
              const channelMemberList = channelData.members
              if(channelMemberList.includes(userId)){
              // const messageData = await messageDataModel.find({
              //   channelId:channelId
              // }).limit(20)
              const messageData = await messageDataModel.aggregate([
                {
                  $match:{
                    channelId:channelId
                  }, 
                },{
                  $sort:{
                    createdAt:-1
                  }
                },{
                  $limit:Number(messageLength)
                },{
                  $sort:{
                    createdAt:1
                  }
                },
              ])
              const messageCount = await messageDataModel.aggregate([
                {
                  $count:channelId || 0
                }
              ])
              res.json({message:messageData,messageCountMax:messageCount[0]?.[channelId]})
            }else {
            res.json({ status: "userInValid" });
          }
            }
            
            
          } else {
            res.json({ status: "userInValid" });
          }
        } else {
          res.json({ status: "userInValid" });
        }
      }
    }
  );

  app.post("/v1/updateServerName/:serverId", checkJwt, async (req, res) => {
    const userId = req.userId;
    const serverId = req.params.serverId;

    if (req.validUser && userId && serverId) {
      const serverData = await getServerData(serverId);
      if (serverData) {
        const serverAdminList = serverData.admins;
        if (serverAdminList.includes(userId)) {
          const newname = req.body.name;
          await serverDataModel.findOneAndUpdate({
            serverId:serverId,
            
          },{
            name:newname
          })
          await socket.emit(`${serverId}`,"updateServerInfo")
          console.log("server name updated",serverId,"new name ",newname)  
          res.json({status:"updated",name:newname})   

        } else {
          res.json({ status: "invalidUser" });
        }
      } else {
        res.json({ status: "invalidData" });
      }
    } else {
      console.log("ff");
      res.json({ status: "invalidData" });
    }
  });
}
