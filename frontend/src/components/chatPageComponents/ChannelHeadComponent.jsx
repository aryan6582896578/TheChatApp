import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import memberListIcon from "/memberList.png?url"
export default function ChannelHeadComponent(){
    const parms = useParams();
    const [channelName,setchannelName]=useState("Loading...");


    async function getChannelData() {
        if(parms.channelId){
        const channelNameData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${ parms.serverId}/${parms.channelId}/channelData`,{
            withCredentials: true,
        });
        setchannelName(channelNameData.data.channelName)
        }
    }
    
    useEffect(() => {
        getChannelData()
        
        return () => {
          setchannelName("")
        }
    }, [parms.serverId,parms.channelId])
    document.title =`#${channelName} | ${import.meta.env.VITE_NAME}`
    return(
        <div className="bg-primaryColor text-otherColor w-[100%] min-h-[45px] h-[45px] border-solid border-b-[1px] border-secondaryColor font-medium text-[30px] pl-[20px] flex relative">
            <span className="hover:text-otherColor duration-[0.5s]" > # {channelName} </span>
            <button className="absolute end-0 text-[20px] h-[100%] pl-[15px] pr-[15px] rounded-[5px] cursor-pointer hover:bg-otherColor/10 " onClick={()=>{setmemberListDisplay(memberListDisplay?false:true) ,setmemberListSMDisplay("block")}}>
            <img src={memberListIcon} alt="memberListIcon" />
            </button>
        </div>
    )
}