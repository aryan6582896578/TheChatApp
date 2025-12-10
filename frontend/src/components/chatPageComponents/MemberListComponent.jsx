import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { emitter } from "../managesocket";
export function MemberListComponent({displayMemberListComponent}){
  const parms = useParams();
  const[memberListData,setmemberListData]=useState([]);

  async function getMemberList() {
    if(parms.channelId){
      const channelMemberList = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${ parms.serverId}/${parms.channelId}/channelMemberList`,{
        withCredentials: true,
      });
      setmemberListData(Object.entries(channelMemberList.data.usernameList))
    }   
  }
  useEffect(() => {
    getMemberList()
  }, [parms.serverId,parms.channelId])

  useEffect(() => {
    emitter.on("updateMemberList",(updateData)=>{
      // console.log(updateData)
      if(updateData.refresh==="serverMemberList"){
        getMemberList();
      }
    })
  }, [])
  
  
    return(
      <div className={`h-[100%] min-w-fit bg-primaryColor flex flex-col ${displayMemberListComponent?"block":"hidden"}`}>
        <div className="text-[20px] text-otherColor font-medium text-center pb-[10px] mt-[10px] w-[200px]">
          MEMBERS
        </div>
        <div className="m-[10px] mt-[0px] rounded-[5px] h-[100%] mb-[10px] flex flex-col " >
          {memberListData?.map(([userId, userData]) => (
            // console.log(id,user)
            <div className="flex align-middle items-center hover:bg-secondaryColor cursor-pointer rounded-[5px] p-[5px] text-otherColor/90 hover:text-otherColor" key={userId}>
              <div className="h-[50px] w-[50px]  mr-[5px] p-[5px]">
                <img src={userData.userprofileurl} className="w-[100%] h-[100%] rounded-[100%] object-fill " draggable={false} alt={userData.username}/>
              </div>
              <div className="text-[20px] font-semibold  ">{userData.username}</div>
            </div>
          ))}
        </div>
      </div>
    )
}