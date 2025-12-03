import { useState,useEffect } from "react";
import {useNavigate } from "react-router";
import axios from "axios";
import LoadingPage from "../otherComponents/loadingPage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userData, setuserData] = useState({ username: "", password: "" });
  const [loadingPage, setloadingPage] = useState(false);
  const [displayPassword, setdisplayPassword] = useState(false);
  const [displayError, setdisplayError] = useState("");


  async function loginCheck() {
    setuserData({ username: "", password: "" });
    if (userData.username && userData.password) {
      setloadingPage(true);
      try {
        const loginData = await axios.post(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/login`,userData,{
        withCredentials: true,
        });
        if (loginData.data.status === "userValid") {
          setuserData({ username: "", password: "" })
          setloadingPage(false);
          navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat`);
        } else if(loginData.data.status === "userInValid"){
          setloadingPage(false);
          setuserData({ username: "", password: "" })
          setdisplayError("invalid username or password");
        }
    } catch (error) {
      console.error("api error", error);
    }
    } else {
      setdisplayError("username or password cannot be empty");
    }
    
  } 

  function changedisplayPassword() {
    if (displayPassword) {
      setdisplayPassword(false);
    } else {
      setdisplayPassword(true);
    }
  }

  document.title =`Login | TheChatApp`
  return (
    <>
      {loadingPage ? (
        <LoadingPage someError={"Loading..."} />
      ) : (
        <div className="bg-primaryColor min-h-screen w-full overflow-hidden text-textColor">

          <div className="bg-secondaryColor h-[70px] w-[100%] relative flex border-b-otherColor/80 border-b-[1px]">
              <div className="flex hover:cursor-pointer"onClick={()=>{navigate("/")}}>
                  <div className={`min-h-[70%] mb-auto mt-auto min-w-[5px] bg-textColor ml-[5px] rounded-[10%]`}></div>
                  <div className="text-[25px] font-medium mt-auto mb-auto ml-[10px] hover:text-textColor text-white">TheChatApp</div>
              </div>
          </div>
          
          <div className="flex flex-col bg-secondaryColor mt-[60px] ml-[5%] mr-[5%] h-fit rounded-[5px] sm:w-[450px] sm:ml-auto sm:mr-auto">
            <div className="text-[50px] ml-auto mr-auto font-semibold text-otherColor">Login</div>
            <div className="flex flex-col mb-[5px] p-[10px]">

              <div className="text-[13px] mb-[5px] font-semibold text-otherColor/80">
                USERNAME
                <span className="text-red-500 font-semibold ml-[2px]">*</span>
                <span className="text-red-500 font-semibold text-[12px] ml-[5px]">
                  {displayError ? displayError : ""}
                </span>
              </div>
              <input type="text" maxLength={15} onChange={(e) => setuserData({ ...userData, username: e.target.value })} value={userData.username} className="p-[5px] outline-none bg-primaryColor text-otherColor rounded-[5px] mb-[5px]"/>

              <div className="text-[13px] mb-[5px] font-semibold text-otherColor/80">
                PASSWORD
                <span className="text-red-500 font-semibold ml-[2px]">*</span>
              </div>
              <div className="relative">
                <input type={displayPassword ? "text" : "password"} maxLength={30} onChange={(e) =>setuserData({ ...userData, password: e.target.value })} value={userData.password} className="p-[5px] outline-none bg-primaryColor text-otherColor w-full rounded-[5px]"/>
                <button onMouseEnter={changedisplayPassword}  onMouseLeave={changedisplayPassword} className="absolute right-[5px] top-[5px] p-0 hover:cursor-pointer" >
                  <div className="bg-red-500 hover:bg-otherColor min-w-[5px] min-h-[25px] duration-[0.5s] rounded-[5px]"></div>
                </button>
              </div> {/*  add password regex */}

            </div>

            <div className="flex flex-col">
                <button onClick={() => {loginCheck();}} className="bg-textColor text-otherColor text-[20px]  ml-[10px] mr-[10px] mt-[5px] p-[5px] rounded-[5px] font-semibold hover:bg-textColor/60 duration-[0.5s] cursor-pointer">
                  Login
                </button>
                <div>
                  <button className="text-otherColor/70 hover:underline hover:text-otherColor duration-[0.5s] ml-[10px] mb-[5px] mt-[5px] hover:opacity-[100%] cursor-pointer" onClick={()=>{navigate(`/${import.meta.env.VITE_VERSION_LIVE}/register`)}}>Register?</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
