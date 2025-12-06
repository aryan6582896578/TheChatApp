import { useState, useEffect } from "react";
import { Outlet, useNavigate,useParams  } from "react-router";
import axios from "axios";
import { socket } from "../managesocket";
export default function AuthCheckMain() {
  const navigate = useNavigate();
  const parms = useParams()
  const serverId = parms.serverId

  const[update,setupdate]=useState(false)

 async function permissionCheck(){
    const serverData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${serverId}/permissionCheckServer`, {
      withCredentials: true,
    })
    console.log(socket.connected)
    if(!socket.connected){
      socket.connect();
    }
    if(serverData.data.status === "userInValid"){
      navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat`)
    }
    if(serverData.data.status ==="validChannel"){
      setupdate(true)
      // navigate(`/${import.meta.env.VITE_VERSION}/@me/chat/${serverId}/${serverData.data.channelId}`)
      
    }
  }
  useEffect(() => {
  permissionCheck()

  }, [parms.serverId,parms.channelId])
  if(!update){
    return (
      <Outlet/>
    )
  }else{
    return (
      <Outlet/>
    )
  }
}
