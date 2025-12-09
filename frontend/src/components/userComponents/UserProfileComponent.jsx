import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { UserSettingComponent } from "./UserSettingComponent";
import { emitter } from "../managesocket";
export function UserProfileComponent() {
  const navigate = useNavigate();
  
  const[userProfileInfo,setuserProfileInfo] = useState({username:null,userprofileurl:null,userId:null})
  const[settingDisplay,setsettingDisplay]=useState(false)

  async function getUserData() {
    const userData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me`, {
        withCredentials: true,
      })
    setuserProfileInfo({...userProfileInfo, username:userData.data.username,userprofileurl: userData.data.userprofileurl,userId:userData.data.userId})
  }
  useEffect(() => {

    emitter.on('UserProfileComponent',(e)=>{
      console.log(e)
      if(e==="UserProfileComponent"){
        getUserData();
      }
    })
    if(userProfileInfo.username===null){
      getUserData();
    }
    
  }, [])
 
    return (
      <div className=" min-w-[250px] max-w-[250px] max-h-[55px] min-h-[55px] bg-primaryColor hidden sm:flex border-solid border-t-[1px] border-secondaryColor relative ">
        <div className=" ml-[5px] flex mt-auto mb-auto w-[40px] h-[40px]">
          <img src={userProfileInfo.userprofileurl} className="w-[100%] h-[100%] rounded-[100%] " draggable={false}/>
        </div>
        <div className="text-[25px] p-[5px] text-white font-semibold hover:text-otherColor/80 hover:cursor-pointer"> {userProfileInfo.username}</div>
        <button className="min-w-[5px] min-h-[100%] bg-textColor hover:bg-red-500 rounded-[0px] absolute end-0 cursor-pointer duration-[0.5s]" onClick={()=>{
          setsettingDisplay(true)
        }}/>
        {settingDisplay? <UserSettingComponent setsettingDisplay={setsettingDisplay} /> :""}

      </div>
    );
  }