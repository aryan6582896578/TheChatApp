import dotenv from "dotenv";
dotenv.config();
import {userDataModel,serverDataModel,inviteDataModel,serverChannelsDataModel } from "./schema/databaseSchema.js";
import { createCustomId } from "./managedata/customData.js";

async function userDataSeverList(username) {
    const userDataSeverList = await userDataModel.findOne({username:username})
    if(userDataSeverList){
        const serverData = await Promise.all(
        userDataSeverList.servers.map(serverId =>
            getServerData(serverId)
        ));

        const serverList = {};
        for(const x in serverData){
            serverList[serverData[x].serverId]=serverData[x].name
        }
        return serverList
    } 
}


async function getServerData(serverId){
    const serverData = await serverDataModel.findOne({serverId:serverId})
    if(serverData){
        return serverData
    }

}

async function validServerChannelList(serverId,userId){
    const channelList = await getServerChannelList(serverId)
    const validChannelList=[]
    for (const [x, channelId] of channelList.entries()) {
        const channelData = await getServerChannelData(channelId);
        const channelDataMemberList = await channelData.members
        if (channelDataMemberList.includes(userId)) {
            validChannelList.push(channelData.channelId)
        }
    }
    return validChannelList
}

async function getChannelName(channelId) {
    const channelName = await serverChannelsDataModel.findOne({channelId:channelId})
    if(channelName){
        return channelName.name
    }
    
     
}
async function getServerChannelData(channelId){
    const channelData = await serverChannelsDataModel.findOne({channelId:channelId})
    if(channelData){
        return channelData
    }

}

async function getServerChannelList(serverId){
    let serverData = await serverDataModel.findOne({serverId:serverId})
    if(serverData){
        return serverData.channels
    }

}

async function getServerChannelMemberList(channelId){
    let serverChannelData = await serverChannelsDataModel.findOne({channelId:channelId})
    if(serverChannelData){
        return serverChannelData.members
    }

}

async function getUsername(memberIds) {
    const getUsername = await userDataModel.findOne({userid:`${memberIds}`})
    if(getUsername){
        return(getUsername.username)
    }
    
}

async function getUserId(username) {
    const getUserId = await userDataModel.findOne({username:username})
    if(getUserId){
        return(getUserId.userid)
    }
}

function randomChar(){
    let someRandom =Math.floor(Math.random() * (90 - 65+1) + 65)
    let someRandomChar = String.fromCharCode(someRandom)
    return someRandomChar
}

async function createInviteCode(){
    let createdInviteCode=""
    for(let i=0;i<8;i++){
        createdInviteCode += randomChar()
    }
    return createdInviteCode
}


async function validInviteCode(serverId) {
  let someflag = 0;

  while (someflag == 0) {
    const inviteCode = await createInviteCode();
    let usedInviteCode = await inviteDataModel.findOne({
      inviteCode: `${inviteCode}`,
    });
    if(usedInviteCode){
        console.log("invite code existis")
    }else{
    const date = new Date();
    const currentDate = date.toUTCString()
    await inviteDataModel.create({
      _id: `${inviteCode}`,
      serverId:`${serverId}`,
      inviteCode:`${inviteCode}`,
      createdDate: `${currentDate}`,
    });
    return inviteCode
    }
  }
}

async function getUserData(username) {
    const userData = await userDataModel.findOne({username:username})
    if(userData){
        const userinfo = {
            // username:userData.username,
            userprofileurl:userData.userprofileurl || " "
        }
        return userinfo

    }
    
}
async function getUserDataId(userId) {
    const userData = await userDataModel.findOne({userid:userId})
    if(userData){
        const userinfo = {
            username:userData.username,
            lastUpdated:userData.lastUpdated,
            userprofileurl:userData.userprofileurl || " ",
        }
        return userinfo

    }
    
}
async function getServerPermission(serverId) {
    const serverPermission= await serverDataModel.findOne({serverId:serverId})
    return serverPermission
}
// async function updateServerPermission(serverId,) {
    
// }

export {getUserDataId,getServerPermission,getUserData,getUserId,createInviteCode,validInviteCode,getServerChannelList,userDataSeverList,getServerData,getServerChannelMemberList,validServerChannelList,getChannelName,getUsername,getServerChannelData}