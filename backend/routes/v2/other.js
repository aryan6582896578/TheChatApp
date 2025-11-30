import { getServerData } from "../../database/managedata.js"

async function channelPermissionCheck(userId,serverId,channelId){
    const serverData = await getServerData(serverId)
    if(serverData){
        if(serverData.members.includes(userId)){
            return "validUser"
        }else{
            return "invalidUser"
        }
    }else{
        return "invalidServer"
    }
}
export{channelPermissionCheck}