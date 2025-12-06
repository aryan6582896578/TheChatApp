import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import ServerError from "../otherComponents/ServerErrorPage";
import { getJwtCookie, socket } from "../managesocket";
export default function AuthCheckMain() {
  const navigate = useNavigate();
  const [userStatus, setuserStatus] = useState(false);

  async function verifyUser(){
    const userData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me`, {
      withCredentials: true,
    })
    if(userData.data.status === "userValid"){
      setuserStatus(true);
      const jwtToken = getJwtCookie();
      socket.emit("joinUserUpdates",{jwtToken});
      // socket.on(userInfo,(x)=>{
      //   console.log("yess",x);
      // })
    }else{
      socket.disconnect();
      navigate(`/${import.meta.env.VITE_VERSION_LIVE}/login`);
    }
  }
  useEffect(() => {
    verifyUser()
  }, []);

  if(userStatus){
    return <Outlet />;
  }else{
    return <ServerError/>
    }
}
