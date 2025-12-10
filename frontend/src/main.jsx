import { createRoot, ReactDOM } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import HomePage from "./components/homePageComponents/HomePage.jsx";
import ErrorPage from "./components/otherComponents/ErrorPage.jsx";
import AuthCheckMain from "./components/authComponents/AuthCheckMain.jsx";
import AuthCheckPre from "./components/authComponents/AuthCheckPre.jsx";
import ChatPage from "./components/homePageComponents/chatPage.jsx";
import RegisterPage from "./components/authComponents/RegisterPage.jsx"
import AuthCheckRoute from "./components/authComponents/AuthCheckRoute.jsx"
import MainChatPage from "./components/chatPageComponents/MainChatPage.jsx"
import LoginPage from "./components/authComponents/LoginPage.jsx";
import { emitter, socket } from "./components/managesocket.js";
import axios from "axios";


let container = null;
document.addEventListener("DOMContentLoaded",async function (event) {
  if (!container) {
    container = document.getElementById("root");
    const root = createRoot(container);
    function getJwtCookie(){  
      const cookie = document.cookie.match(/(?:^|;\s*)tokenJwt=([^;]*)/);
      if(cookie){
        return cookie[1]
      }
    }
    function setSocketData(){
      const jwtToken = getJwtCookie()
      socket.auth = {jwtToken}
    }
    async function getUserData() {
      const userData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me`, {
          withCredentials: true,
        })
      return userData.data.userId
    }
    setSocketData();
    if (!socket.connected) {
      socket.connect();
    }
    const userId=await getUserData();
    const jwtToken = getJwtCookie();
    socket.emit("joinUserUpdates", { jwtToken});
    socket.on(`${userId}`,async (userData)=>{
      emitter.emit(`${userData.type}`, userData.type)    
    })

    
    root.render(
      
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<ErrorPage />} />

          <Route path={`${import.meta.env.VITE_VERSION_LIVE}`} element={<AuthCheckPre />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={< RegisterPage/>} />
          </Route>

          <Route path={`${import.meta.env.VITE_VERSION_LIVE}/@me`} element={<AuthCheckMain />}>
            <Route path="chat" element={< ChatPage/>} />
            <Route path="chat/:serverId/" element={<AuthCheckRoute/>} >
             <Route path=":channelId?" element={< MainChatPage />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    );
  }
});
