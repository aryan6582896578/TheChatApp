import { mongoose, Schema } from "mongoose";

const userData = mongoose.Schema({
 _id: {type:String,required: true},
 username:{type:String,required: true},
 password:{type:String,required: true},
 createdDate: { type:String,required: true },
 userid:{type:String,required:true},
 servers:{type:Array},
 userprofileurl:{type:String}
},{ timestamps: true });
const userDataModel = mongoose.model("userdata", userData);

const server = mongoose.Schema({
    _id: {type:String,required: true},
    name:{type:String,required: true},
    admins:[{type:Array}],
    createdDate: { type:String,required: true },
    ownerId:{type:String},
    serverId:{type:String,required:true},
    members: [{type:Array}],
    channels :[{type:Array}],
    permissions:[{type:Array}],
},{ timestamps: true })
const serverDataModel = mongoose.model("serverData", server);

const serverChannels = mongoose.Schema({
        _id: {type:String,required: true},
        name:{type:String,required: true},
        createdDate: { type:String,required: true },
        channelId:{type:String,required:true},
        serverId:{type:String,required: true},
        members: [{type:Array}]
    },{ timestamps: true })
    
const serverChannelsDataModel = mongoose.model("serverChannelsData", serverChannels);

const inviteData = mongoose.Schema({
    _id: {type:String,required: true},
    serverId:{type:String,required: true},
    inviteCode:{type:String,required: true},
    createdDate: { type:String,required: true },
   },{ timestamps: true });
const inviteDataModel = mongoose.model("inviteData", inviteData);

const messageData = mongoose.Schema({
    _id: {type:String,required: true},
    serverId: {type:String,required: true},
    channelId: {type:String,required: true},
    userId: {type:String,required: true},
    displayDate:{type:String,required: true},
    message:{type:String,required: true},
    username:{type:String,required: true},
    userprofileurl:{type:String}
},{ timestamps: true })
const messageDataModel = mongoose.model("messageData", messageData);


export { userDataModel,serverDataModel,inviteDataModel,serverChannelsDataModel,messageDataModel };
