import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
export function ServerListComponent() {
  const navigate = useNavigate();
  const parms = useParams()
  const [serverList, setserverList] = useState(null);
  const[username,setusername]=useState("");
  const [serverBoxDisplay ,setserverBoxDisplay] = useState(false);
  const [disableServerCreateButton,setdisableServerCreateButton] =useState("")

  const [serverCreateBoxDisplay,setserverCreateBoxDisplay] = useState(false);
  const [createServerData, setcreateServerData] = useState({ serverName: null });
  const [createServerError,setcreateServerError]=useState("");

  const [serverJoinBoxDisplay,setserverJoinBoxDisplay]=useState(false);
  const[joinServerData , setjoinServerData] =  useState({ serverInviteCode: null });
  const[serverJoinError,setserverJoinError]=useState("");


  async function getUserData() {
    try {
      const userData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me/serverList`, {
        withCredentials: true,
      })
      if(userData){
        setserverList(userData.data.serverList);
        setusername(userData.data.username);    
      }
    } catch (error) {
      console.log(error,"error get server list");
    }

  }

  async function postCreateServer(){
    if(createServerData.serverName){
      try {
        const createServer = await axios.post(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me/createServer`,createServerData,{
          withCredentials: true
        })
        if(createServer.data.status==="CreatedServer"){
          setserverCreateBoxDisplay(false);
          setcreateServerData({...createServerData,serverName: null})
          
          await navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${createServer.data.serverId}`);
        }        
      } catch (error) {
        console.log(error,"error post create server");
      }
    }else{
      setcreateServerError("*Server name cannot be empty");
    }
  }

  async function postJoinServer(){
    if(joinServerData.serverInviteCode){
      try {
        const joinServer = await axios.post(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me/joinServer`,joinServerData,{
          withCredentials: true
        })
        if(joinServer.data.status==="alreadyJoined"){
          setserverJoinBoxDisplay(false);
          setjoinServerData({joinServerData,serverInviteCode:null})
          await navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${joinServer.data.serverId}`);
        }else if(joinServer.data.status==="ServerJoined"){
          setjoinServerData({joinServerData,serverInviteCode:null})
          await navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${joinServer.data.serverId}`);
        }else{
          setjoinServerData({joinServerData,serverInviteCode:null})
          setserverJoinError("*invalid code");
        }
      } catch (error) {
        console.log("error post server join",error);
      }
      
    }
  }
  useEffect(() => {
    getUserData();

    return ()=>{
      setcreateServerData({...createServerData,serverName: null})
      setserverBoxDisplay(false);
      setserverCreateBoxDisplay(false);
      setserverJoinBoxDisplay(false);
    }
  },[parms.serverId,parms.channelId]);

  return (
    <div className=" h-[100vh] min-w-[60px] max-w-[70px] bg-primaryColor  text-textColor relative border-solid border-r-[1px] border-secondaryColor z-[10] flex flex-col">

      <div className="flex">
        <button onClick={() => {
            navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat`);
          }}
          className="min-w-[5px] min-h-[40px] bg-textColor mt-[15px] mb-[15px] cursor-pointer hover:bg-otherColor duration-500 ml-auto mr-auto "
        />
      </div>

      <div className="flex flex-col  pt-[10px] overflow-y-scroll overflow-x-hidden scrollbar-hide">
        {Object.entries(serverList || {}).map(([serverId, serverName]) => (
          <div key={serverId} className="m-auto relative group text-otherColor/50">
            <button onClick={() =>{
                navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${serverId}`)
            }}
              className="text-[20px] bg-secondaryColor/50 border-transparent border-solid border-[2px] hover:border-otherColor/50 text-otherColor/50 w-[50px] h-[50px] m-auto mb-[10px] rounded-[50px]  hover:text-otherColor duration-[0.5s] cursor-pointer">
              {serverName[0]}
            </button>
            <div className="absolute text-textColor left-[55px] top-2 w-fit whitespace-nowrap p-[5px] rounded-[5px] bg-gray-950 text-[15px] font-semibold 
            opacity-0 group-hover:opacity-100 transition">
              {serverName}
            </div>
          </div>
        ))}

        <button onClick={() => {
            setserverBoxDisplay(true);
          }}
          className="text-[20px] bg-secondaryColor/50 border-transparent border-solid border-[2px] text-otherColor/50 w-[50px] min-h-[50px] m-auto mb-[10px] rounded-[50px] hover:border-otherColor/50  hover:text-otherColor/90 duration-[0.5s] cursor-pointer ">
          +
        </button>

      </div>

      {serverBoxDisplay?<ServerBoxDisplay  setserverBoxDisplay={setserverBoxDisplay} setserverCreateBoxDisplay={setserverCreateBoxDisplay} setserverJoinBoxDisplay={setserverJoinBoxDisplay} username={username}/>:"" }
      {serverCreateBoxDisplay ? <ServerCreateBoxDisplay setserverBoxDisplay={setserverBoxDisplay} setserverCreateBoxDisplay={setserverCreateBoxDisplay} setcreateServerData={setcreateServerData} createServerData={createServerData} postCreateServer={postCreateServer} createServerError={createServerError} disableServerCreateButton={disableServerCreateButton} setdisableServerCreateButton={setdisableServerCreateButton} username={username}/> :"" }
      {serverJoinBoxDisplay ?<ServerJoinBoxDisplay setserverJoinBoxDisplay={setserverJoinBoxDisplay} setserverBoxDisplay={setserverBoxDisplay} setjoinServerData={setjoinServerData}  joinServerData={joinServerData} serverJoinError={serverJoinError} postJoinServer={postJoinServer}/>:""}
    </div>  
  );
}

function ServerBoxDisplay({setserverBoxDisplay ,setserverCreateBoxDisplay ,setserverJoinBoxDisplay,username}){

    return(
        <div className="fixed w-[100%] h-[100%] bg-primaryColor top-[0px] ">

          <div className="bg-secondaryColor h-[70px] w-[100%]  border-b-otherColor/80 border-b-[1px]">
            <div className="flex">
              <div className="mt-[10px] ml-[10px]">
              </div>
              <div>
                <button className="end-[10px] top-[10px] absolute min-w-[5px] min-h-[45px] bg-red-500 rounded-[10px] hover:bg-red-600 duration-[0.5s] cursor-pointer" onClick={() => {
                  setserverBoxDisplay(false);
                }}/>
              </div>
            </div>   
          </div>

          <div className="flex h-[100%] w-[100%] flex-col md:w-[400px] md:ml-auto md:mr-auto">

           <div className="text-[35px] overflow-hidden break-words h-[200px]">
            <div className="text-otherColor font-bold text-center">
              Hello <span className="font-semibold text-textColor animate-pulse">{username}</span>
            </div>
           </div>

            <div className=" flex flex-col h-[100%]">
              <div className="ml-auto mr-auto mt-[50px]">
                <button className=" bg-textColor/90 text-otherColor w-[200px] h-[45px] rounded-[10px] duration-[0.5s] text-[20px] font-semibold hover:bg-textColor/70 cursor-pointer hover:text-otherColor/80" onClick={()=>{ 
                  setserverBoxDisplay(false) ,
                  setserverCreateBoxDisplay(true)
                  }}>Create Server</button>
              </div>
              <div className=" ml-auto mr-auto mt-[40px]">
                  <button className=" bg-textColor/90 text-otherColor w-[200px] h-[45px] rounded-[10px] duration-[0.5s] text-[20px] font-semibold hover:bg-textColor/70 cursor-pointer hover:text-otherColor/80" onClick={()=>{
                  setserverBoxDisplay(false) ,
                  setserverJoinBoxDisplay(true)
                }} >Join Server</button>
              </div>
            </div>
          </div>
        </div>
    )
}

function ServerCreateBoxDisplay({setserverBoxDisplay,setserverCreateBoxDisplay ,setcreateServerData ,createServerData ,postCreateServer,createServerError,disableServerCreateButton,setdisableServerCreateButton,username}){

  return(
      <div className="fixed w-[100%] h-[100%] bg-primaryColor top-[0px] ">
        <div className="bg-secondaryColor h-[70px] w-[100%]  border-b-otherColor/80 border-b-[1px]">
          <div className="flex">
            <div>
              <button className="end-[10px] top-[10px] absolute min-w-[5px] min-h-[45px] bg-red-500 rounded-[10px] hover:bg-red-600 cursor-pointer duration-[0.5s]" onClick={() => {
                setserverCreateBoxDisplay(false);
              }}/>
            </div>
          </div>   
        </div>

        <div className=" w-[100%] h-[100%] md:w-[400px] md:ml-auto md:mr-auto">
          <div className="text-[35px] text-otherColor font-semibold text-center">
              Create Server
          </div>
          <div>
            <div className="flex flex-col mt-[10px]">
              <div className="w-[90%] ml-auto mr-auto text-text3Color">
                {createServerError}
              </div>
              <input onChange={(e) => { setcreateServerData({...createServerData,serverName:e.target.value});}}
                type="text" maxLength={15} className="bg-textColor/50 w-[90%]  rounded-[10px] h-[50px] outline-none  text-otherColor/90 p-[10px] text-[20px] font-semibold ml-auto mr-auto" placeholder={`${username}'s server`}
              />
            </div>
          </div>

          <div className="h-[100%] mt-[20px] text-otherColor text-[18px] w-[90%] ml-auto mr-auto relative">
            <button className={`w-[150px] h-[40px] p-[auto]  bg-red-500 rounded-[10px] border-solid border-[3px] border-transparent hover:bg-red-600 cursor-pointer duration-[0.5s] font-medium ${disableServerCreateButton}`} onClick={()=>{
              setdisableServerCreateButton("disabled")
                setserverCreateBoxDisplay(false)
                setserverBoxDisplay(true)
            }}>Go back</button>
            <button className="w-[150px] h-[40px] p-[auto]  bg-textColor rounded-[10px] border-solid border-[3px] border-transparent hover:bg-textColor/80 cursor-pointer  duration-[0.5s] font-medium absolute end-0" onClick={()=>{
                postCreateServer()
              }}>Create Server</button>
          </div>

        </div>

      </div>
  )
}

function ServerJoinBoxDisplay({setserverJoinBoxDisplay,setserverBoxDisplay ,setjoinServerData,joinServerData ,serverJoinError,postJoinServer}){
  return(
    <div className="fixed w-[100%] h-[100%] bg-primaryColor top-[0px]">
      <div className="bg-secondaryColor h-[70px] w-[100%]  border-b-otherColor/80 border-b-[1px]">
        <div className="flex">
          <div>
            <button className="end-[10px] top-[10px] absolute min-w-[5px] min-h-[45px] bg-red-500 rounded-[10px] hover:bg-red-600 cursor-pointer duration-[0.5s]" onClick={() => {
            setserverJoinBoxDisplay(false);
            }}/>
          </div>
        </div>   
      </div>
    
      <div className=" w-[100%] h-[100%] md:w-[400px] md:ml-auto md:mr-auto">
        <div className="text-[35px] text-otherColor font-semibold text-center">
              Join Server
        </div>
        <div>
          <div className=" flex flex-col mt-[10px]  text-otherColor h-[100%] w-[100%] ">
            <div className="w-[90%] ml-auto mr-auto text-text3Color">
              {serverJoinError}
            </div>
            <input onChange={(e) => {setjoinServerData({...joinServerData,serverInviteCode:e.target.value});}}
              type="text" className="bg-textColor/50 w-[90%] rounded-[10px] h-[50px] outline-none  text-otherColor p-[10px] text-[20px] font-semibold ml-auto mr-auto" placeholder="Invite Code" maxLength={8}
            />
            
            <div className="flex w-[90%] ml-auto mr-auto mt-[20px] relative">
              <button className="w-[150px] h-[40px] p-[auto]  bg-red-500 rounded-[10px] border-solid border-[3px] border-transparent hover:bg-red-600 cursor-pointer duration-[0.5s] font-medium" onClick={()=>(
                setserverJoinBoxDisplay(false),
                setserverBoxDisplay(true)
              )}>Go back</button>
              <button className="w-[150px] h-[40px] p-[auto]  bg-textColor rounded-[10px] border-solid border-[3px] border-transparent hover:bg-textColor/80 cursor-pointer duration-[0.5s] font-medium absolute end-0" onClick={()=>{
                postJoinServer()
              }}>Join Server</button>
            </div>
          </div>
          </div>
        </div>
      </div>
    
    
  )
}
