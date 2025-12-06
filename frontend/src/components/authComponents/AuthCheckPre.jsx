import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import ServerErrorPage from "../otherComponents/ServerErrorPage";

export default function AuthCheckPre() {
  const navigate = useNavigate();
  const [userStatus, setuserStatus] = useState(false);
  const [serverStatus, setserverStatus] = useState(false);

  async function verifyUser() {
    try {
      const userData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me`,{
          withCredentials: true,
        });
      if(userData){
        setserverStatus(true);
      }
      if (userData.data.status === "userValid") {
        setuserStatus(true);
        navigate(`/${import.meta.env.VITE_SERVERURL}/@me/chat`);
      }else{
        socket.disconnect();
      }
    } catch (error) {
      console.log("Server Error");
    }
  }

  useEffect(() => {
    verifyUser()
    
  }, [])
  

  if (serverStatus) {
    if (!userStatus) {
      return <Outlet />;
    }
  } else {
    return <ServerErrorPage />;
  }
}
