import { useState,useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { socket } from "../managesocket";
export function ServerSettingComponent() {
  const parms = useParams();
  const [serverInfo, setserverInfo] = useState({serverName:"Loading...",serverInviteCode:false});
  const [serverSettingDisplay, setserverSettingDisplay] = useState(false);
  const [ adminCheck , setadminCheck] = useState(false)
  const [ socketConnection , setsocketConnection] = useState(true);

  async function createServerInvite() {
      const getInviteCode = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${parms.serverId}/inviteCode`,{
          withCredentials: true,
        })
        if(getInviteCode.data.status==="created"){
          setserverInfo({...serverInfo,serverInviteCode:getInviteCode.data.inviteCode}) 
        }else if(getInviteCode.data.status==="notAdmin" || getInviteCode.data.status==="invalidData" ){
          setserverSettingDisplay(false)
        }     
  }

  async function getServerData() {
    const serverData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${parms.serverId}/serverInfo`,{
        withCredentials: true,
    })
    
    if(serverData.data.serverName){
      setserverInfo({...serverInfo,serverName:serverData.data.serverName})
    }
    if(serverData.data.adminStatus===true){
      setadminCheck(true)
      
    }

  }

  function getJwtCookie(){  
      const cookie = document.cookie.match(/(?:^|;\s*)tokenJwt=([^;]*)/);
      if(cookie){
        return cookie[1]
      }
    }
  const[updateFromServer,setupdateFromServer]=useState("");
  useEffect(() => {
    getServerData();
    setserverSettingDisplay(false);
    const jwtToken = getJwtCookie();
    const serverId = parms.serverId;
    const channelId = parms.channelId;

    // socket.emit("joinServer", { jwtToken,serverId,channelId},()=>{
    //   socket.on(`${serverId}`,async (data)=>{
    //     console.log(messageData)
    //     setupdateFromServer(data)
    //   })
    // });
    // socket.emit("joinServer", { jwtToken,serverId,channelId});
    //     socket.on(`${serverId}`,async (data)=>{
    //     console.log(messageData)
    //     setupdateFromServer(data)
    //   })

    // if(socket.connected){
    //   setsocketConnection(true)
    // }
    // return ()=>{
    //   setadminCheck(false);
    //   setserverSettingDisplay(false);
    //   // socket.off(`${parms.serverId}`)
    //   setsocketConnection(false)
    // }
    
  },[parms.serverId]);

  useEffect(() => {
    socket.off(`${parms.serverId}`);
    getServerData()
  
  }, [updateFromServer])
  
  
  
  // document.title =`${serverInfo.serverName} | ${import.meta.env.VITE_NAME}`

  return (
    <div className="sm:w-[250px] h-[45px] bg-primaryColor relative flex overflow-hidden flex-col text-otherColor">
      <div className={`text-[20px] p-[5px] font-semibold hover:text-otherColor cursor-pointer duration-[0.5s] ${socketConnection?"":"text-red-500"} `}>
        {socketConnection?serverInfo.serverName:"socket error"}
      </div>
      <button className={`min-w-[5px] min-h-[100%] absolute end-0 bg-textColor  ${adminCheck?"hover:bg-red-500":"hover:bg-otherColor/50"}  rounded-[10%] hover:cursor-pointer duration-[0.5s]`} onClick={()=>{
        {adminCheck?setserverSettingDisplay(true):""}
      }}/>
      {serverSettingDisplay ? (<ServerSettingDisplay setserverSettingDisplay={setserverSettingDisplay} createServerInvite={createServerInvite} serverInfo={serverInfo} />) : ("")}
      
    </div>
  );
}

function ServerSettingDisplay({setserverSettingDisplay,createServerInvite,serverInfo}) {
  const [serverProfileDisplay,setserverProfileDisplay]=useState({display:true})
  const [inviteCodeDisplay,setinviteCodeDisplay]=useState({display:false})

  return (
    <div className="fixed w-[100%] h-screen bg-primaryColor top-[0px] bg-opacity-[99%] z-[1000] end-0">
      
      <div className="bg-primaryColor h-[70px] w-[100%] flex border-b-[1px] border-b-otherColor border-opacity-[70%]">
        <div className="flex w-[100%] ">
          <div className="font-bold w-[100%] text-[30px] mt-auto mb-auto justify-center flex ">
            <span className="opacity-[80%] hover:opacity-[100%] hover:cursor-pointer ">{serverInfo.serverName}'s Server</span>
            
          </div>
          <button className="end-[10px] top-[10px] absolute min-w-[5px] min-h-[45px] bg-red-600 rounded-[10px] hover:bg-textColor duration-[0.4s]" onClick={() => {
            setserverSettingDisplay(false);
          }}/>    
        </div>   
      </div>
      
      <div className="bg-black flex w-[100%] h-[100%]">
        <div className="bg-primaryColor w-[10%] h-[100%] flex flex-col pt-[20px]">
          <button className={` ml-auto mr-auto p-[5px] pr-[15px] rounded-[3px] font-bold pl-[15px] text-[15px] mb-[5px] ${serverProfileDisplay.display?"bg-secondaryColor":""}`} onClick={()=>{
            setserverProfileDisplay({...serverProfileDisplay,display:true})
            setinviteCodeDisplay({...inviteCodeDisplay,display:false})
          }}>Server Profile
          </button>
          <button className={` ml-auto mr-auto p-[5px] pr-[15px] rounded-[3px] font-bold pl-[15px] text-[15px] mb-[5px] ${inviteCodeDisplay.display?"bg-secondaryColor":""}`} onClick={()=>{
            setserverProfileDisplay({...serverProfileDisplay,display:false})
            setinviteCodeDisplay({...inviteCodeDisplay,display:true})
            {serverInfo.serverInviteCode?"":createServerInvite()}   
          }}>
            Invite Codes
          </button>
        </div>
        <div className=" w-[90%] bg-secondaryColor flex flex-col">
          <div className="h-[100%]">
            
          {serverProfileDisplay.display?<ServerProfileSSC serverInfo={serverInfo} setserverSettingDisplay={setserverSettingDisplay}/>:""} 
          {inviteCodeDisplay.display?<InviteCodeSSC serverInfo={serverInfo}/>:""}
          </div>
        </div>

      </div>
      

    </div>
  );
}

function ServerProfileSSC({serverInfo,setserverSettingDisplay}){
  const [serverNameChange,setserverNameChange]=useState(false)
  const[serverName,setServerName]=useState(serverInfo.serverName);
  const sendUpdatedName = {"name":serverName}
  const parms = useParams();
  const[loading,setloading]=useState(false)
    async function updateServer(){
    const updateServerName = await axios.post(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION}/updateServerName/${parms.serverId}`,sendUpdatedName,{
          withCredentials: true,
        })
    if(updateServerName.status==="updated"){
      setServerName(updateServerName.name)
      setserverNameChange(false)
    }else{
      setserverSettingDisplay(false)
    }
    }
  return(
    <div className="w-[100%] h-[100%]">
      <div className="m-[20px]">
      <input className="rounded-[3px] bg-primaryColor w-[200px] h-[30px] p-[5px] text-otherColor font-medium outline-none hover:cursor-pointer" disabled={loading?true:false}  defaultValue={serverName} onChange={(e)=>{
        setServerName(e.target.value)
        setserverNameChange(true)
      }}/>
      <button className={`ml-[5px] w-[100px] font-medium ${serverNameChange?"bg-red-500":"bg-textColor"} h-[30px] rounded-[3px] `} onClick={()=>{
        setloading(true)
        updateServer()
      }}>{serverNameChange?"SAVE":"EDIT"}</button>
      </div>

    </div>
  )
}

function InviteCodeSSC({serverInfo}){
   const parms = useParams();
  const[copyCode,setcopyCode]=useState(false)
  const[saveButton,setsaveButton]=useState(false)
  async function updateServerPermission(){
    const updatePermission = await axios.post(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION}/updateServerPermission/${parms.serverId}/inviteCodeEveryone`,"hm cannot send without body",{
          withCredentials: true,
        })


  }

  return(
    <div>
      <div className=" flex p-[10px]">
        <div className="bg-primaryColor text-otherColor w-[150px] rounded-[3px] text-center text-[20px] font-semibold h-[35px] hover:cursor-pointer"onClick={()=>{
          navigator.clipboard.writeText(serverInfo.serverInviteCode)
          setcopyCode(true)
        }}>
          {serverInfo.serverInviteCode}
        </div>
        <button className={`ml-[5px] w-[80px] font-medium  ${copyCode?"bg-otherColor/50":"bg-textColor"} h-[35px] rounded-[3px]`} onClick={()=>{
          navigator.clipboard.writeText(serverInfo.serverInviteCode)
          setcopyCode(true)
        }}>{copyCode?"Copied":"Copy"}</button>
        
      </div>
      <div className="flex p-[10px]">
        <div className="bg-primaryColor p-[5px] rounded-[3px]">
          @everyone to create invite code
          <input disabled type="checkbox" className="w-[50px]" onChange={()=>{
            setsaveButton(true)
          }}/>
        </div>
        <button disabled className={`ml-[5px] w-[80px] font-medium  ${saveButton?"bg-red-500":"bg-textColor"} h-[35px] rounded-[3px]`} onClick={()=>{
          updateServerPermission()
        }}>Save</button>
      </div>
    </div>
  )
}



