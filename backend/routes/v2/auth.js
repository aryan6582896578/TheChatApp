import express from "express";
import { signJwt,verifyJwt,createPasswordHash,checkPasswordHash, } from "../../database/managedata/authData.js";
import { getUserData } from "../../database/managedata.js";
import { serverChannelsDataModel, serverDataModel, userDataModel } from "../../database/schema/databaseSchema.js";
import { createCustomId } from "../../database/managedata/customData.js";
import  { getGoogleAuthUrl, oauth2Client } from "../../auth/googleoauth.js";
import url from 'url';
const router = express.Router({ mergeParams: true })
import { google } from 'googleapis';
import crypto from 'crypto';
export default function auth(app,io,upload,redisClient){
  async function checkJwt(req, res, next) {
      try {
        const validToken = verifyJwt(req.cookies.tokenJwt , "v2 auth");
        // console.log("jwt check in auth v2")
        if (validToken) {
          req.validUser = true;
        } else {
          req.validUser = false;
        }
      } catch (error) {
        console.log("no cookie jwtcheck");
      }
      next();
  }
// const oauth2Client = new google.auth.OAuth2(
//   process.env.GoogleClientId,
//   process.env.GoogleClientSecret,
//   process.env.GoogleRedirectURL,
// );
// const scopes = [
//   'https://www.googleapis.com/auth/userinfo.email',
//   'https://www.googleapis.com/auth/userinfo.profile'
// ];
  router.get("/google/google-callback",async(req,res)=>{
    // console.log(req.query)
    let q = url.parse(req.url, true).query;
    console.log(q)
        // let x = await getcc(q.code)

    const { tokens } = await oauth2Client.getToken(q.code);
    console.log(tokens.access_token);
const ticket = await oauth2Client.verifyIdToken({
  idToken: tokens.id_token,
  audience: process.env.GoogleClientId,
});

const payload = ticket.getPayload();
console.log(payload);
        console.log(q)
    
    res.json({"hmm":"ok??"})
  })
  router.get("/google/auth",async(req,res)=>{
    const link = await getGoogleAuthUrl();
    // res.json({"link":link})
    res.redirect(link)
  })
  router.post("/register",checkJwt, async (req, res) => {
    if(req.validUser){
        res.json({ status: "userValid" });
    }else{
        const usernameData = req.body.username;
        const passwordData = req.body.password;
        if(usernameData.length<4){
            res.json({status:"usernameLimitMin"})
        }else if(usernameData.length>15){
            res.json({status:"usernameLimitMax"})
        }else if(passwordData.length>30){
            res.json({status:"passwordLimitMax"})
        }else if(passwordData.length<10){
            res.json({status:"passwordLimitMin"})
        }else{
            const date = new Date();
            const currentDate = date.toUTCString();
            const userID = createCustomId().toString();
            const defaultServer = "7326033090969600000";
            const hashedhPassword = await createPasswordHash(passwordData);
            const timestamp = Date.now();
            try {
            await userDataModel.create({
                _id: `${userID}`,
                username: `${usernameData}`,
                password: `${hashedhPassword}`,
                createdDate: `${currentDate}`,
                userid: `${userID}`,
                userprofileurl: "https://res.cloudinary.com/dz9lsudey/image/upload/v1759405162/default_pfp_aflbjz.png",
                lastUpdated:`${timestamp}`
            });

            await userDataModel.findOneAndUpdate(
                { userid: `${userID}` },
                { $push: { servers: `${defaultServer}` } }
            );

            await serverDataModel.findOneAndUpdate(
                { serverId: `${defaultServer}` },
                { $push: { members: `${userID}` } }
            );

            await serverChannelsDataModel.findOneAndUpdate(
                { serverId: `${defaultServer}` },
                { $push: { members: `${userID}` } }
            );
            const createToken = signJwt(userID,timestamp);
            const userCreated = await userDataModel.findOne({
                userid: `${userID}`,
            });

            console.log(userCreated, "new user created");
            res.cookie("tokenJwt", createToken, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
            });
            res.json({ status: "userCreated" });
            } catch (error) {
            res.json({ status: "userExists" });
            console.log(error, "some err in register");
            }
        }
        }
    });

    router.post("/login",checkJwt, async (req, res) => {
        if(req.validUser){
            res.json({ status: "userValid" });
        }else{
            const usernameData = req.body.username;
            const passwordData = req.body.password;

            if (usernameData.length>=1 && passwordData.length>=1) {
                const getUserdata = await userDataModel.findOne({ _id: usernameData });
                if (getUserdata) {
                    const userID = getUserdata.userid;
                    const checkHash = await checkPasswordHash(passwordData,getUserdata.password);
                    try {
                        if (getUserdata && checkHash === true) {
                            console.log(getUserdata.userid,"ff",getUserdata)
                            const timestamp = getUserdata.lastUpdated;
                            const setRedisData = await redisClient.hSet(getUserdata.userid,{
                                userprofileurl:getUserdata.userprofileurl,
                                lastUpdated:getUserdata.lastUpdated,
                                username:usernameData
                            })
                            const createToken = signJwt(userID,timestamp);
                            res.cookie("tokenJwt", createToken, {maxAge: 15 * 24 * 60 * 60 * 1000});
                            res.json({ status: "userValid" });
                        } else {
                            res.json({ status: "userInValid" });
                        }
                    } catch (error) {
                        res.json({ status: "userInValid" });
                        console.log(error, "some err in login");
                    }
                    } else {
                        res.json({ status: "userInValid" });
                    }
            }else{
                res.json({ status: "userInValid" });
            }
        }
    });


  
  return router
}



