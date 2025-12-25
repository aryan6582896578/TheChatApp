import { createCustomId } from "../managedata/customData.js";
import { serverChannelsDataModel, serverDataModel } from "../schema/databaseSchema.js"
export default async function createDefaultData(){
  
    try {

        const findDefault = await serverDataModel.findOne({serverId:"7326033090969600000"})

        if(findDefault){
            console.log("default server exists \nserverId - 7326033090969600000 \nchannelId - 7326033090969690000");       
        }else{
            console.log("default server does not exists \ntrying to create default server")
            try {
                const date = new Date();
                const currentDate = date.toUTCString()
                await serverDataModel.create({
                    _id: "7326033090969600000",
                    name: "Global Server",
                    admins:[{type:Array}],
                    createdDate: `${currentDate}`,
                    serverId:"7326033090969600000",
                    isDeleted:false,
                })

                await serverChannelsDataModel.create({
                    _id: "7326033090969690000",
                    name:"General",
                    createdDate: currentDate,
                    channelId:"7326033090969690000",
                    serverId:"7326033090969600000",
                    isDeleted:false,
                   })

                await serverDataModel.findOneAndUpdate(
                    {serverId:"7326033090969600000"},
                    { $push: { channels: "7326033090969690000" } })
                   console.log("created default server")

            } catch (error) {
                console.log(error,"error in default server creation")
            }
        }
    } catch (error) {
        console.log(error,"error in default data creation")
    }
}
//const serverId = createCustomId().toString()
//let defaultid = (1746662400000n<<22n) | (0n <<17n) | (0n<<12n) | 0n; 
//7326033090969600000