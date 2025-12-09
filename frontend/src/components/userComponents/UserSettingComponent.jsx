import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";

export function UserSettingComponent({setsettingDisplay}){
  const navigate = useNavigate();
  const [userData, setuserData] = useState({username: null,userprofileurl: null});
  const [uploadedImage, setuploadedImage] = useState(null);
  const [uploadProfileComponentDisplay ,setuploadProfileComponentDisplay]=useState(false);

  const [newUsername,setnewUsername] = useState({newUsername:null});
  const [usernameUpdated,setusernameUpdated]=useState(false);
  const [usernameUpdateError,setusernameUpdateError]=useState("")
  const [usernameLoading,setusernameLoading]=useState(false)
  const[isUsernameUpdated,setisUsernameUpdated]=useState("")
  async function updateUsername() {
    if(newUsername){
      setusernameLoading(true)
      const putUsername = await axios.put(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me/updateUsername`,newUsername,{
            withCredentials: true});
      if(putUsername.data.status ==="usernameExists"){
        setusernameUpdateError(" *username in taken")
        setusernameLoading(false)
      }else if(putUsername.data.status==="usernameLimitMin"){
        setusernameUpdateError(" *username cannot be less than 4 character")
        setusernameLoading(false)
      }else if(putUsername.data.status==="usernameLimitMax"){
        setusernameUpdateError(" *username cannot be greater than 15 character")
        setusernameLoading(false)
      }else if(putUsername.data.status==="usernameUpdated"){
        setusernameUpdateError("")
        getUserData()
        setusernameUpdated(false)
        setusernameLoading(false)
        setisUsernameUpdated("Username Updated")
        setTimeout(()=>{
          setisUsernameUpdated("")
        },4000)
      }
    }
    
  }

  async function getUserData() {
    try {
      const getUserData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me`,{
          withCredentials: true,});
      if (getUserData) {
        setuserData({...userData,username: getUserData.data.username,userprofileurl: getUserData.data.userprofileurl}); //userprofileurl:getUserData.data.userprofileurl
      }
    } catch (error) {
      console.log(error, "error get user info");
    }
  }
  function logoutUser() {
    document.cookie = "tokenJwt=;max-age=0; path=/;";
    navigate("/");
  }
  async function saveProfile(){
    try {
      const formData = new FormData();
      formData.append('img', uploadedImage);
      const updateProfile = await axios.post(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me/updateProfilePicture`,formData,{
        withCredentials: true
      });
      if(updateProfile.data.status==="updated"){
        setuploadProfileComponentDisplay(false);
          getUserData();
      }else{
        setuploadProfileComponentDisplay(false);
        getUserData();
        console.log("error in profile updating")
      }
        
    } catch (error) {
        console.log("error updating user pfp ",error)
    }
  }
  useEffect(() => {
    if(userData.username===null){
          getUserData();
    }
    return ()=>{
      setuserData({...setuserData,username:null,userprofileurl:null})
      setnewUsername({...setnewUsername,newUsername:null})
    }
  }, []);
  document.title = `Settings | TheChatApp`;
  return (
    <div className="w-[100%] h-[100%] fixed top-[0px] left-0 bg-primaryColor z-[10]">
      <div className="bg-primaryColor h-[70px] w-[100%]  border-b-otherColor/80 border-b-[1px] relative ">
        <div className="flex">
          <div className="text-[30px] text-otherColor font-semibold ml-[10px] mt-[10px]">
            Settings
          </div>
          <div className="absolute end-[10px] top-[15px] hidden md:flex">
            <button
              className="min-w-[5px] min-h-[40px] bg-red-500 rounded-[10px] hover:bg-red-500/80 transition-[1s] cursor-pointer"
              onClick={() => {
                setsettingDisplay(false);
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-[100%] h-[100%] flex text-otherColor relative">
            
        <SettingSideBarComponent logoutUser={logoutUser}/>

        <div className="bg-secondaryColor rounded-[5px] w-[100%] mb-[50px] p-[50px] pt-[0px] flex flex-col relative">
          <div className="text-[50px] ml-auto mr-auto flex">
            Hi,<span className="text-textColor ml-[10px]">{userData.username}</span>
          </div>
          <div>
            <div className="flex">
              <div className="bg-secondaryColor">
                <div className="relative">
                  <img src={userData.userprofileurl} alt="userpfp" className="w-[80px] h-[80px] rounded-[100%] bg-gray-900"/>
                  <button className=" bg-textColor w-[80%] ml-auto mr-auto flex  mt-[5px] rounded-[3px] font-semibold  hover:bg-red-500 cursor-pointer duration-[0.5s]" onClick={()=>{
                    setuploadProfileComponentDisplay(true)
                  }}>
                    <div className="flex ml-auto mr-auto">Edit</div>
                  </button>
                </div>
              </div>
              <div className="flex ml-[20px] pl-[10px] pr-[10px]">
                <div className="mb-[15px] mt-[15px] flex" >
                  <div className="flex flex-col ">
                    <div className="text-otherColor/90 flex font-semibold h-[20px] mb-[2px] text-[12px]">USERNAME <span className="text-red-500 ml-[5px] font-bold">{usernameUpdateError}</span> <span className="text-text1Color">{isUsernameUpdated}</span></div>
                    <input type="text" className="bg-primaryColor p-[5px] rounded-[3px] outline-none flex h-[30px]" defaultValue={userData.username} onChange={(e)=>{
                      if(e.target.value!=userData.username){
                        setusernameUpdated(true)
                        setnewUsername({...setnewUsername,newUsername:e.target.value})
                      }else{
                        setusernameUpdated(false)
                      }
                    }}/>
                  </div>
                  <div className="mt-[22px] ml-[10px]">
                    <button className={`h-[30px]  w-[70px] rounded-[3px] font-semibold cursor-pointer ${usernameUpdated?"bg-red-500 hover:bg-red-500/80":"bg-primaryColor hover:bg-primaryColor/70"}`} onClick={()=>{
                      if(setnewUsername!=userData.username){
                        updateUsername()
                      }
                    }}>{usernameLoading?"Updating":usernameUpdated?"Save":"Edit"}</button>
                  </div>
                </div>
                {/* <div className="mb-[15px] mt-[15px]">
                  <input type="text" className="bg-cyan-950" />
                  <button>Edit</button>
                </div> */}
                
              </div>
            </div>
          </div>
        {uploadProfileComponentDisplay?<UploadProfileComponent setuploadProfileComponentDisplay={setuploadProfileComponentDisplay} userData={userData} setuploadedImage={setuploadedImage} saveProfile={saveProfile} />:""}
        </div>
      </div>
    </div>
  );
}

function UploadProfileComponent({setuploadProfileComponentDisplay,userData,setuploadedImage,saveProfile}) {
  const [disableButton, setdisableButton] = useState(false);
  const[uploadedImagePreview,setuploadedImagePreview] = useState({name:"",url:null});
  const [selectedImage,setselectedImage]=useState(false);
  useEffect(() => {
    setuploadedImagePreview({...uploadedImagePreview,url:userData.userprofileurl})
  }, [])
  return (
    <div className={`bg-primaryColor absolute w-[60%] h-[fit] rounded-[5px]  left-[15%] top-[10%] p-[10px] flex flex-col`}>
      {disableButton? <CustomLoading/>:""}
      <div className="absolute end-[10px] top-[10px] hidden md:flex">
        <button className="min-w-[5px] min-h-[35px] rounded-[10px] bg-red-500 hover:bg-red-500/80 cursor-pointer transition-[1s]" onClick={() => {
            setuploadProfileComponentDisplay(false);
          }}
        />
      </div>
      <div className="font-semibold text-[25px] text-center">EDIT PROFILE</div>
      <div className="ml-auto mr-auto flex mt-[20px]">
        <img src={uploadedImagePreview.url}
          className=" max-w-[100px] min-w-[150px] max-h-[150px] min-h-[150px] rounded-[100%] object-cover border-[2px] border-textColor cursor-pointer text-center "
        />
      </div>
      <div className="mt-[20px] font-semibold ml-auto mr-auto">
          <label htmlFor="filebox" className="bg-textColor mt-[30px] text-center text-[15px] font-semibold rounded-[3px] p-[5px] cursor-pointer hover:bg-textColor/80 overflow-hidden">
            {selectedImage?`Selected ${uploadedImagePreview.name}`:"Select Image"}
          </label>
          <input type="file"id="filebox"className="hidden max-w-[120px]  "accept="image/png, image/jpeg" onChange={(e) => {
              setuploadedImage(e.target.files[0]);
              setuploadedImagePreview({...setuploadedImagePreview,name:e.target.files[0].name,url:URL.createObjectURL(e.target.files[0])});
              setselectedImage(true);
              }}/>
        </div>

      <div className="ml-auto mr-auto flex mt-[20px] mb-[20px] text-[25px] font-semibold ">
        <button className="bg-red-500 w-[120px] rounded-[3px] cursor-pointer hover:bg-red-500/80" onClick={()=>{
          setuploadProfileComponentDisplay(false)
        }}>Cancel</button>
        <button className={` w-[120px] rounded-[3px] ml-[10px] ${selectedImage?"bg-textColor hover:bg-textColor/80 cursor-pointer":"bg-secondaryColor cursor-not-allowed "}`} disabled={selectedImage?false:true} onClick={()=>{
          setdisableButton(true)
          saveProfile()
        }}>{disableButton?"Saving":"Save"}</button>
      </div>
    </div>

  );
}

function CustomLoading(){
  return(
    <div className="text-[50px] font-bold flex bg-primaryColor/90 w-[100%] h-[100%] absolute m-[-10px] z-1 rounded-[5px]">
        <div className="flex m-auto animate-pulse text-otherColor">
          UPDATING...
        </div>
    </div>
  )
}

function SettingSideBarComponent({logoutUser}) {
  return (
    <div className="min-w-fit p-[20px] text-[20px] bg-primaryColor flex flex-col">
      <button className="bg-secondaryColor min-w-[200px] rounded-[3px] text-left p-[5px] hover:text-white font-semibold duration-100 cursor-pointer">
        Profile
      </button>
      <button
        className="bg-red-500 mt-[20px] rounded-[3px] font-semibold hover:bg-red-500/80 cursor-pointer" onClick={() => {
          logoutUser();
        }}> LOGOUT
      </button>
    </div>
  );
}
