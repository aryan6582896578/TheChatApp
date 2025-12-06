import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
export function MemberListComponent({displayMemberListComponent}){
  const parms = useParams();
  const [membersId, setmembersId] = useState([]);
  const [membersData, setmembersData] = useState([]);
  const[memberListData,setmemberListData]=useState([]);

  async function getMemberList() {
    if(parms.channelId){
      const channelMemberList = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${ parms.serverId}/${parms.channelId}/channelMemberList`,{
        withCredentials: true,
      });
      setmemberListData(Object.entries(channelMemberList.data.usernameList))
      // console.log(channelMemberList.data.usernameList)
      // console.log(Object.keys(channelMemberList.data.usernameList))
      // setmembersId(Object.keys(channelMemberList.data.usernameList))
      // setmembersData(Object.values(channelMemberList.data.usernameList))
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