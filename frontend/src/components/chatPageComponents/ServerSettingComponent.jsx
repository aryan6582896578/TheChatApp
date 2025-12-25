import { useState,useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { emitter, socket } from "../managesocket";
export function ServerSettingComponent() {
  const parms = useParams();
  const [serverInfo, setserverInfo] = useState({serverName:"Loading...",serverInviteCode:false,serverProfileUrl:null});
  const [serverSettingDisplay, setserverSettingDisplay] = useState(false);
  const [ adminCheck , setadminCheck] = useState(false)

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
      setserverInfo({...serverInfo,serverName:serverData.data.serverName,serverProfileUrl:serverData.data.serverprofileurl})
    }
    if(serverData.data.adminStatus===true){
      setadminCheck(true)
    }
  }
  useEffect(() => {
    getServerData();
    setserverSettingDisplay(false);
  },[parms.serverId]);

  useEffect(() => {
    emitter.on("updateName",(updateData)=>{
      // console.log(updateData)
      if(updateData.refresh==="serverName"){
        getServerData();
      }
    })
  }, [])
  
  return (
    <div className="sm:w-[250px] h-[45px] bg-primaryColor relative flex overflow-hidden flex-col text-otherColor">
      <div className={`text-[20px] p-[5px] font-semibold hover:text-otherColor cursor-pointer duration-[0.5s] `}>
        {serverInfo.serverName}
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
          <button className="end-[10px] top-[10px] absolute min-w-[5px] min-h-[45px] cursor-pointer rounded-[10px] bg-red-500 hover:bg-red-500/80" onClick={() => {
            setserverSettingDisplay(false);
          }}/>    
        </div>   
      </div>
      
      <div className="bg-black flex w-[100%] h-[100%]">
        <div className="bg-primaryColor w-[15%] h-[100%] flex flex-col pt-[20px]">
          <button className={` ml-[5px] mr-[5px] cursor-pointer p-[5px] pr-[15px] rounded-[3px] font-bold pl-[15px] text-[15px] mb-[5px] ${serverProfileDisplay.display?"bg-secondaryColor":""}`} onClick={()=>{
            setserverProfileDisplay({...serverProfileDisplay,display:true})
            setinviteCodeDisplay({...inviteCodeDisplay,display:false})
          }}>Server Profile
          </button>
          <button className={` ml-[5px] mr-[5px] cursor-pointer p-[5px] pr-[15px] rounded-[3px] font-bold pl-[15px] text-[15px] mb-[5px] hover:bg-secondaryColor/80 ${inviteCodeDisplay.display?"bg-secondaryColor":""}`} onClick={()=>{
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
  const parms = useParams();
  const[newServerName,setnewServerName]=useState({newName:serverInfo.serverName})
  const[isServerNameUpdated,setisServerNameUpdated]=useState(false)
  const[serverNameLoading,setserverNameLoading]=useState(false)
  async function updateServer(){
    if(newServerName){
      setserverNameLoading(true)
      const updateServerName = await axios.put(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/updateServerName/${parms.serverId}`,newServerName,{
        withCredentials: true,
      })
      if(updateServerName.data.status==="serverNameUpdated"){
        setserverNameLoading(false)
        setserverSettingDisplay(false)
      }
    }
  }
  return(
    <div className="w-[100%] h-[100%] flex">
      <div className=" w-full flex p-[20px]">
        <div className="bg-cyan-950 flex mr-[10px] mt-[5px] flex-col">
          <div className="flex ">
            <img src={serverInfo.serverProfileUrl} alt={serverInfo.serverName} className="w-[60px] h-[60px] rounded-[100%] bg-gray-900" draggable={false}/>
          </div>
          <div className="w-full bg-yellow-500 mt-[5px] rounded-[3px] flex">
            <button className="font-semibold text-center flex align-middle items-center">Edit</button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="min-h-[20px] max-h-[20px] font-semibold text-[12px] text-otherColor/80">SERVER NAME</div>
          <div className=" flex">
            <input type="text" className="bg-primaryColor h-[30px] pl-[5px] outline-none rounded-[3px] font-semibold" defaultValue={serverInfo.serverName} onChange={(e)=>{
              if(serverInfo.serverName!=e.target.value){
                setnewServerName({...newServerName,newName:e.target.value})
                setisServerNameUpdated(true)
              }else{
                setisServerNameUpdated(false)
              }
            }}/>
            <button disabled={serverNameLoading} className={`h-[30px] w-[100px] font-semibold rounded-[3px] pl-[20px] pr-[20px] ml-[10px]  bg-primaryColor cursor-pointer ${isServerNameUpdated?"bg-red-500 hover:bg-red-500/80":"bg-primaryColor hover:bg-primaryColor/70"}`}  onClick={()=>{
              if(serverInfo.serverName!=newServerName.newName){
                console.log(serverInfo.serverName,newServerName.newName)
                updateServer()
              }
            }}>{serverNameLoading?"Updating":isServerNameUpdated?"Save":"Edit"}</button>
          </div>
        </div>

      </div>
    </div>
  )
}

function InviteCodeSSC({serverInfo}){
  const[copyCode,setcopyCode]=useState(false)
  return (
    <div className="w-[100%] h-[100%] flex">
      <div className=" w-full flex p-[20px]">
        <div className="flex flex-col">
          <div className="min-h-[20px] max-h-[20px] font-semibold text-[12px] text-otherColor/80">INVITE CODE</div>
          <div className=" flex p-[10px] pl-0 pt-0">
            <div className="bg-primaryColor text-otherColor w-[120px] rounded-[3px] p-0 text-[20px] text-center font-semibold h-[30px] hover:cursor-pointer" onClick={() => {
                navigator.clipboard.writeText(serverInfo.serverInviteCode);
                setcopyCode(true);
              }}>{serverInfo.serverInviteCode}
            </div>
            <button className={`ml-[5px] w-[80px] font-medium  ${copyCode? "bg-otherColor/50": "bg-textColor hover:bg-textColor/70"} h-[30px] rounded-[3px] cursor-pointer`}onClick={() => {
                navigator.clipboard.writeText(serverInfo.serverInviteCode);
                copyCode?setcopyCode(false):setcopyCode(true)
              }}>{copyCode ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



