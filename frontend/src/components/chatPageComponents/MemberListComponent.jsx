import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
export function MemberListComponent({displayMemberListComponent}){
  const parms = useParams();
  const [membersId, setmembersId] = useState([]);
  const [membersUsername, setmembersUsername] = useState([]);

  async function getMemberList() {
    if(parms.channelId){
      const channelMemberList = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${ parms.serverId}/${parms.channelId}/channelMemberList`,{
        withCredentials: true,
      });
      setmembersId(Object.keys(channelMemberList.data.usernameList))
      setmembersUsername(Object.values(channelMemberList.data.usernameList))
    }   
  }
  useEffect(() => {
    getMemberList()
  }, [parms.serverId,parms.channelId])
  
    return(
      <div className={`h-[100%] min-w-fit bg-primaryColor flex flex-col ${displayMemberListComponent?"block":"hidden"}`}>
        <div className="text-[20px] text-otherColor font-medium text-center pb-[10px] mt-[10px] w-[200px]">
          MEMBERS
        </div>
        <div className="m-[10px] mt-[0px] rounded-[5px] h-[100%] mb-[10px] flex flex-col " >
          {membersId?.map((userId,x) => (
                
            <div key={membersId[x]} id={userId} > 
              <div className="text-[20px] font-medium m-[10px] mb-[0px] text-otherColor text-opacity-[60%] hover:text-otherColor min-h-[35px] max-h-[35px] text-center overflow-hidden duration-[0.5s] cursor-pointer">
                {membersUsername[x]}
              </div>  
            </div>
          ))}
        </div>
      </div>
    )
}