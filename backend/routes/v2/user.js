import express from "express";
import { signJwt,verifyJwt,createPasswordHash,checkPasswordHash, } from "../../database/managedata/authData.js";
import { getUserData, userDataSeverList } from "../../database/managedata.js";
import { inviteDataModel, serverChannelsDataModel, serverDataModel, userDataModel } from "../../database/schema/databaseSchema.js";
import { createCustomId } from "../../database/managedata/customData.js";
const router = express.Router({ mergeParams: true })

export default function user(app,socket,upload){
  async function checkJwt(req, res, next) {
      try {
        const validToken = verifyJwt(req.cookies.tokenJwt , "v2 user ");
        // console.log("jwt check in user v2")
        if (validToken) {
          const usernameValidToken = validToken.username;
          const userIdValidToken = validToken.userId;
          req.validUser = true,
          req.username = usernameValidToken,
          req.userId = userIdValidToken;
          // socket.to("testserver").emit("testserver", "hmmmmmm  testserver auth");
        } else {
          req.validUser = false;
        }
      } catch (error) {
        console.log("no cookie jwtcheck");
      }
      next();
  }

  router.get("/", checkJwt, async (req, res) => {
  if (req.validUser) {
        let userData = await getUserData(req.username);
        res.json({ status: "userValid",username: req.username,userId: req.userId , userprofileurl:userData.userprofileurl});
      } else {
        res.clearCookie("tokenJwt");
        res.json({ status: "userInvalid" });
      }
  });
  router.post("/createServer", checkJwt, async (req, res) => {
    const serverName = req.body.serverName;
    if (req.validUser && serverName) {
      try {
        const date = new Date();
        const currentDate = date.toUTCString();
        const serverId = createCustomId();
        const userId = await req.userId;

        await serverDataModel.create({
          _id: `${serverId}`,
          name: `${serverName}`,
          createdDate: `${currentDate}`,
          ownerId: `${userId}`,
          serverId: `${serverId}`,
        });

        const channelId = createCustomId();
        
        await serverChannelsDataModel.create({
          _id: `${channelId}`,
          name: "General",
          createdDate: `${currentDate}`,
          channelId: `${channelId}`,
          serverId: `${serverId}`,
        });
        
        await serverDataModel.findOneAndUpdate(
          { serverId: `${serverId}` },
          { $push: { channels: `${channelId}` } }
        );

        await userDataModel.findOneAndUpdate(
          { userid: `${userId}` },
          { $push: { servers: `${serverId}` } }
        );

        await serverDataModel.findOneAndUpdate(
          { serverId: `${serverId}` },
          { $push: { members: `${userId}` } }
        );
        await serverDataModel.findOneAndUpdate(
          { serverId: `${serverId}` },
          { $push: { admins: `${userId}` } }
        );

        await serverChannelsDataModel.findOneAndUpdate(
          { channelId: `${channelId}` },
          { $push: { members: `${userId}` } }
        );

        res.json({ status: "CreatedServer", serverId: `${serverId}` });
      } catch (error) {
        console.log(error, "error in creating server ");
      }
    }
  });

  router.get("/serverList", checkJwt, async (req, res) => {
    if (req.validUser) {
      const userDataSevers = await userDataSeverList(req.username);
      res.json({ serverList: userDataSevers , username:req.username});
    }
  });
  
router.post("/joinServer", checkJwt, async (req, res) => {
    if (req.validUser) {
      const serverInviteCodeJoin = req.body.serverInviteCode;
      try {
        const serverInviteCode = await inviteDataModel.findOne({
          inviteCode: `${serverInviteCodeJoin}`,
        });
        if (serverInviteCode) {
          const getUserid = req.userId;

          const userInServerCheck = await userDataModel.findOne({
            userid: `${getUserid}`,
          });

          if (userInServerCheck.servers.includes(serverInviteCode.serverId)) {
            res.json({
              status: "alreadyJoined",
              serverId: `${serverInviteCode.serverId}`,
            });
          } else {
            const channelList = await serverDataModel.findOne({
              serverId: serverInviteCode.serverId,
            });
            await userDataModel.findOneAndUpdate(
              { userid: `${getUserid}` },
              { $push: { servers: `${serverInviteCode.serverId}` } }
            );
            await serverDataModel.findOneAndUpdate(
              { serverId: `${serverInviteCode.serverId}` },
              { $push: { members: `${getUserid}` } }
            );
            const channelListId = channelList.channels;
            channelListId.map(async (x) => {
              await serverChannelsDataModel.findOneAndUpdate(
                { channelId: `${x}` },
                { $push: { members: `${getUserid}` } }
              );
            });
            res.json({status: "ServerJoined",serverId: `${serverInviteCode.serverId}`,});
          }
        } else {
          res.json({ status: "invalidCode" });
        }
      } catch (error) {
        console.log(error, "error in joining server ");
      }
    }
  });
  return router
}



