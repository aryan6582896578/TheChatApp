import { useParams, useNavigate } from "react-router";
import { useEffect, useState,useRef } from "react";
import axios from "axios";
import {ServerListComponent} from "../userComponents/ServerListComponent.jsx"
import ChannelListComponent from "./ChannelListComponent.jsx";
import { ServerSettingComponent } from "./ServerSettingComponent.jsx";
import ChannelHeadComponent from "./ChannelHeadComponent.jsx";
import { ChatBoxComponent } from "./ChatBoxComponent.jsx";
import { MemberListComponent } from "./MemberListComponent.jsx";
import { UserProfileComponent } from "../userComponents/UserProfileComponent.jsx";

export default function MainChatPage() {
  const [channelCheck, setchannelCheck] = useState(false);
  const [displayMemberListComponent,setdisplayMemberListComponent ]=useState(true);
  const navigate = useNavigate();
  const parms = useParams();
  const userId = useRef(null)
  async function getChannelData() {
    try {

      const channelListData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${parms.serverId}/channelList`,{
          withCredentials: true,
        });
      if(!userId.current){
        userId.current=channelListData.data.userId;
      }
      if(channelListData.data.status === "userInValid"){
        
        navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat`)
      }else{
        const data = Object.keys(channelListData.data.channelList);
        // console.log(data,"ffff")   
        if (parms.channelId) {
          if (data.includes(parms.channelId)) {
            setchannelCheck(true);
          } else {
            navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${parms.serverId}`);}
        } else {
          setchannelCheck(false);
          if (data[0]) {
            navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${parms.serverId}/${data[0]}`);
          }else{
            navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${parms.serverId}`);
          }
        }
      }
    } catch (error) {
      console.error(error, "error channel switch");
    }
  }
  useEffect(() => {
    getChannelData();
  }, [parms.serverId, parms.channelId]);

  if(channelCheck){ 
  return (
    <div className="bg-primaryColor flex h-full overflow-hidden max-w-svw">
      <ServerListComponent/>

      <div className="flex flex-col min-w-fit">
        <ServerSettingComponent/>
        <ChannelListComponent/>
        <UserProfileComponent/>
      </div>

      <div className="flex flex-col w-full">
        <ChannelHeadComponent setdisplayMemberListComponent={setdisplayMemberListComponent} displayMemberListComponent={displayMemberListComponent}/>
        <div className="flex w-full overflow-hidden h-full">
          <ChatBoxComponent userId={userId}/>
          <MemberListComponent displayMemberListComponent={displayMemberListComponent}/>
        </div>
        
      </div>
    </div>
  )
  }
}




























// import { UserProfileComponent } from "../userComponents/UserProfileComponent.jsx";
// import { ServerListComponent } from "../userComponents/ServerListComponent.jsx";
// import { MemberListComponent } from "./MemberListComponent.jsx";
// import { ServerSettingComponent } from "./ServerSettingComponent.jsx";
// import { ChatBoxComponent } from "./ChatBoxComponent.jsx";
// import { useParams, useNavigate } from "react-router";
// import ChannelListComponent from "./ChannelListComponent.jsx";
// import { useEffect, useState } from "react";
// import { NoChannelComponent } from "../otherComponents/NoChannelComponent.jsx";
// import axios from "axios";
// import ChannelHeadComponent from "./ChannelHeadComponent.jsx";
// import { SettingComponent } from "../userComponents/SettingComponent.jsx";
// export default function MainChatPage() {
//   const [channelCheck, setchannelCheck] = useState(false);
//   const [memberListDisplay, setmemberListDisplay] = useState(true);
//   const [serverListDisplay, setserverListDisplay] = useState("flex");
//   const [channelListDisplay, setchannelListDisplay] = useState("flex");
//   const [chatBoxDisplay, setchatBoxDisplay] = useState("hidden");
//   const [memberListSMDisplay, setmemberListSMDisplay] = useState("hidden");
//   const [userSettingDisplay, setuserSettingDisplay] = useState("hidden");
//   const [bottomBarDisplay, setbottomBarDisplay] = useState(true);
//   const navigate = useNavigate();
//   const parms = useParams();

//   async function getChannelData() {
//     try {

//       const channelListData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${parms.serverId}/channelList`,{
//           withCredentials: true,
//         });
//       const data = Object.keys(channelListData.data.channelList);
//       console.log(data)
      
//       if (parms.channelId) {
//         if (data.includes(parms.channelId)) {
//           setchannelCheck(true);
//         } else {
//           navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${parms.serverId}`);}
//       } else {
//         setchannelCheck(false);
//         if (data[0]) {
//           navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${parms.serverId}/${data[0]}`);
//         }else{
//           navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${parms.serverId}`);
//         }
//       }

//     } catch (error) {
//       console.error(error, "error channel switch");
//     }
//   }
//   useEffect(() => {
//     getChannelData();
//   }, [parms.serverId, parms.channelId]);

//   return (
//     <div className="bg-black flex w-[100%] h-[100%]">
//       <div>
//         <ServerListComponent/>
//       </div>

//       <div className="flex flex-col">
//         <ServerSettingComponent/>
//         <ChannelListComponent/>
//         <UserProfileComponent/>
//       </div>
      
//       <div className="bg-cyan-500 w-[100%] h-[100%] flex flex-col">
//         <ChannelHeadComponent/>
//         <div className="flex h-[100%] w-[100%] bg-purple-800">
//           <div className="flex w-[100%]">
//             <ChatBoxComponent/>
//             <MemberListComponent/>
//           </div>

//         </div>
//       </div>
//     </div>
    // <div className="bg-primaryColor max-h-screen flex text-otherColor max-w-full overflow-hidden">
    //   <div className="">
    //     <div className={`${serverListDisplay} sm:flex`}>
    //       <ServerListComponent />
    //     </div>
    //   </div>
    //   <div className={`${channelListDisplay} sm:flex flex-col overflow-hidden flex-1 sm:flex-none`}>
    //     <ServerSettingComponent />
    //     {channelCheck ? (
    //       <ChannelListComponent
    //         setchatBoxDisplay={setchatBoxDisplay}
    //         setserverListDisplay={setserverListDisplay}
    //         setchannelListDisplay={setchannelListDisplay}
    //         setbottomBarDisplay={setbottomBarDisplay}
    //       />
    //     ) : (
    //       ""
    //     )}
    //     <UserProfileComponent />
    //   </div>
    //   <div className={`${chatBoxDisplay} sm:flex  flex-1 min-w-0 flex flex-col overflow-hidden min-h-screen`}>
    //        {channelCheck?"":<NoChannelComponent/>} 
    //       <div className="">
    //         {channelCheck?<ChannelHeadComponent setmemberListDisplay={setmemberListDisplay} memberListDisplay={memberListDisplay}  setmemberListSMDisplay={setmemberListSMDisplay} setchannelListDisplay={setchannelListDisplay} setchatBoxDisplay={setchatBoxDisplay} setserverListDisplay={setserverListDisplay} setuserSettingDisplay={setuserSettingDisplay} setbottomBarDisplay={setbottomBarDisplay}/>:""} 
    //       </div>
    //       <div className=" flex flex-1 overflow-hidden ">
    //              {channelCheck?<ChatBoxComponent  />:""} 
    //              {channelCheck? (memberListDisplay?<MemberListComponent memberListSMDisplay={memberListSMDisplay}/>:""):""}
    //       </div>
    //     </div>

    //       <div className={`${userSettingDisplay} sm:hidden w-[100%] min-h-[100%] sm:w-[300px]`}>
    //      <SettingComponent/>
    //     </div> 
    //    {bottomBarDisplay? <BottomBarComponent setchannelListDisplay={setchannelListDisplay} setchatBoxDisplay={setchatBoxDisplay} setserverListDisplay={setserverListDisplay} setuserSettingDisplay={setuserSettingDisplay} setbottomBarDisplay={setbottomBarDisplay}/>:""}
    // </div>
//   );
// }

// function BottomBarComponent({
//   setserverListDisplay,
//   setchannelListDisplay,
//   setchatBoxDisplay,
//   setuserSettingDisplay,
//   setbottomBarDisplay,
// }) {
//   return (
//     <div className="bg-primaryColor font-medium min-h-[50px] min-w-[100%] fixed bottom-0 sm:hidden flex justify-evenly z-[100]">
//       <div className="w-[80%] flex opacity-[80%]">
//         <button
//           className="w-[fit] mr-auto ml-auto mt-auto mb-auto"
//           onClick={() => {
//             setserverListDisplay("flex"),
//               setchannelListDisplay("flex"),
//               setchatBoxDisplay("hidden"),
//               setuserSettingDisplay("hidden");
//           }}
//         >
//           <img src="/server.png" />
//         </button>
//       </div>
//       <div className="w-[100%] flex opacity-[80%]">
//         <button
//           className="w-[fit] mr-auto ml-auto mt-auto mb-auto"
//           onClick={() => {
//             setserverListDisplay("hidden"),
//               setchannelListDisplay("hidden"),
//               setchatBoxDisplay("flex"),
//               setuserSettingDisplay("hidden"),
//               setbottomBarDisplay(false);
//           }}
//         >
//           <img src="/text.png" />
//         </button>
//       </div>
//       <div className="w-[100%] flex opacity-[80%]">
//         <button
//           className="w-[fit] mr-auto ml-auto mt-auto mb-auto"
//           onClick={() => {
//             setserverListDisplay("hidden"),
//               setchannelListDisplay("hidden"),
//               setchatBoxDisplay("hidden"),
//               setuserSettingDisplay("flex");
//           }}
//         >
//           <img src="/settings.png" />
//         </button>
//       </div>
//     </div>
//   );
// }
