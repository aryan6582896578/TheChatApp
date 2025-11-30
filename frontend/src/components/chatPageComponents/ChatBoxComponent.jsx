import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getJwtCookie, socket } from "../managesocket";
import axios from "axios";


export function ChatBoxComponent() {
  const parms = useParams();
  const date = new Date();
  const [messageData, setmessageData] = useState("");
  const [displayMessageSocket,setdisplayMessageSocket]= useState([]);
  const [displayMessageDb,setdisplayMessageDb]= useState([]);
  const [lastId,setlastId]=useState(null)
  const[userProfileInfo,setuserProfileInfo] = useState({username:"someshitisseriouslywrong",userprofileurl:null})
  async function getMessage() {
      const messageData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/getmessage/${parms.serverId}/${parms.channelId}?lastId=${lastId}`,{
        withCredentials: true,
      })
      if(messageData){
        setdisplayMessageDb(messageData.data.messages)
        setlastId(messageData.data.lastMessageId)
      }
  }

  async function sendMessage(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.target.innerText=""
      const userMessage ={
        message:messageData,
        date:date.toUTCString(),
        userprofileurl:userProfileInfo.userprofileurl
      }
      socket.emit(`${parms.serverId}/${parms.channelId}`, userMessage)
      socket.emit("testserver","yep frontend");
      setmessageData("")
    }
  };

  async function getUserData() {
    const userData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/@me`,{
        withCredentials: true,
      });
    setuserProfileInfo({...userProfileInfo,userprofileurl:userData.data.userprofileurl})
    const userId = userData.data.userId;
    return userId;
  }

  useEffect(() => {
    getUserData()
    getMessage()
    
    const jwtToken = getJwtCookie();
    const serverId = parms.serverId;
    const channelId = parms.channelId;
    socket.emit("joinServer", { jwtToken,serverId,channelId},()=>{
      socket.on(`${serverId}/${channelId}`,async (messageData)=>{
        console.log(messageData)
        setdisplayMessageSocket(a=>[...a,messageData])    
      })
    });
    socket.emit("joinServer", { jwtToken,serverId,channelId});
    socket.on(`${serverId}/${channelId}`,async (messageData)=>{
      console.log(messageData)
      setdisplayMessageSocket(a=>[...a,messageData])    
    })
    socket.emit("test");
    socket.on("testserver",async (x)=>{
    console.log(x)  
    })
    return () => {
      socket.off(`${parms.serverId}/${parms.channelId}`);
      setdisplayMessageSocket([])
      setdisplayMessageDb([])
    }
  }, [parms.serverId,parms.channelId])


  return (
    <div className="bg-primaryColor w-full h-full flex flex-col relative">
      <div className=" flex flex-col absolute w-[100%] overflow-y-scroll bottom-[55px] top-[0]">
        {displayMessageDb?.map((data, x) => {
          return (
            <div
              key={x}
              className="m-[5px] hover:bg-otherColor/5 p-[5px] rounded-[5px] cursor-pointer"
            >
              <div className="font-medium text-textColor text-[20px]">
                {displayMessageDb[x].username}
                <span className="text-otherColor font-normal text-[10px] opacity-[50%] ml-[10px]">
                  {displayMessageDb[x].displayDate}
                </span>
              </div>
              <div className="text-otherColor text-opacity-[80%] break-before-column">
                {displayMessageDb[x].message}
              </div>
            </div>
          );
        })}
        {displayMessageSocket?.map((data, x) => {
          return (
            <div
              key={x}
              className="m-[5px] hover:bg-otherColor/5 p-[5px] rounded-[5px] cursor-pointer "
            >
              <div className="font-medium text-[20px] flex">
                <img
                  src={data.userprofileurl}
                  className="w-[40px] h-[40px] rounded-[100%] mr-[10px] "
                  alt="pfp"
                />
                {data.username}
                <span className="text-otherColor font-normal text-[10px] opacity-[50%] ml-[10px]">
                  {data.date}
                </span>
              </div>
              <div className="text-otherColor text-opacity-[80%]">
                {data.message}
              </div>

              <div className="flex w-[100%] h-[70px]">
                <div className="">
                  <img
                    src={data.userprofileurl}
                    className="w-[40px] h-[40px] rounded-[100%] m-[5px] flex "
                    alt="pfp"
                  />
                </div>
                <div className="w-[100%]">
                  <div className="font-medium text-[20px] flex ml-[5px]">
                    {data.username}
                    <span className="text-otherColor/50 font-normal text-[10px]  ml-[10px] mt-[10px]">
                      {data.date}
                    </span>
                  </div>
                  <div className="text-otherColor mt-[5px]">{data.message}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="min-h-[55px] max-h-[55px] overflow-hidden bg-primaryColor flex w-[100%] absolute bottom-0">
        <div
          contentEditable className="w-[100%] h-[70%] ml-[10px] mt-auto mb-auto rounded-[5px] bg-otherColor/9 outline-none p-[5px] text-otherColor" onKeyDown={sendMessage}spellCheck={true} onInput={(e) => {
            setmessageData(e.target.innerText);
          }}
        />
      </div>
    </div>
  );




}
