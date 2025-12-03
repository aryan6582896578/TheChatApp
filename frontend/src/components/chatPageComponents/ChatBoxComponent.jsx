import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { getJwtCookie, socket } from "../managesocket";
import axios from "axios";


export function ChatBoxComponent({userId}) {
  const parms = useParams();
  const date = new Date();
  const [messageData, setmessageData] = useState("");
  const [displayMessageSocket,setdisplayMessageSocket]= useState([]);
  const [displayMessageDb,setdisplayMessageDb]= useState([]);
  const [lastId,setlastId]=useState(null)
  const[userProfileInfo,setuserProfileInfo] = useState({username:"someshitisseriouslywrong",userprofileurl:null})
  const bottomDiv = useRef(null)

  function scrollBottom(){
    bottomDiv.current?.scrollIntoView({ behavior: "auto" });
  }

  useEffect(() => {
    if (!displayMessageSocket.length) return;
    const lastMessage = displayMessageSocket[displayMessageSocket.length - 1];
    if ( lastMessage.userId === userId.current) {
      scrollBottom()
    }

  }, [displayMessageSocket]);

  useEffect(() => {
    if (!displayMessageDb.length) return;
    scrollBottom()
  }, [displayMessageDb]);

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
    socket.emit("joinServer", { jwtToken,serverId,channelId});
    socket.on(`${serverId}/${channelId}`,async (messageData)=>{
      setdisplayMessageSocket(x=>[...x,messageData])    
    })

    return () => {
      socket.off(`${parms.serverId}/${parms.channelId}`);
      setdisplayMessageSocket([])
      setdisplayMessageDb([])
    }
  }, [parms.serverId,parms.channelId,onload])


  return (
    <div className="bg-green-600 w-full relative flex flex-col overflow-hidden h-full">
      <div className="h-full flex flex-col overflow-hidden bg-primaryColor overflow-x-hidden overflow-y-auto">
        <div className=" flex flex-col bg-primaryColor p-[5px] pb-0 ">
          {displayMessageDb.map((x)=>{
            return(
              <div className="bg-primaryColor min-h-[60px] flex hover:bg-secondaryColor cursor-pointer rounded-[5px]" key={x["_id"]} >
                <div className="h-[50px] w-[50px] mt-[5px] mr-[5px] p-[5px]">
                  <img src={x.userprofileurl} className="w-[100%] h-[100%] rounded-[100%] object-fill " draggable={false} alt={x.username}/>
                </div>
                <div className="w-full">
                  <div className="text-otherColor">{x.username} <span className="text-otherColor/40 text-[10px]">{x.displayDate}</span></div>
                  <div className="text-otherColor break-all wrap-break-word mr-[5px]">{x.message}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className=" flex flex-col bg-primaryColor p-[5px]">
          {displayMessageSocket.map((x)=>{
            return(
              <div className="bg-primaryColor min-h-[60px] flex hover:bg-secondaryColor cursor-pointer rounded-[5px]" key={x.messageId} >
                <div className="h-[50px] w-[50px] mt-[5px] mr-[5px] p-[5px]">
                  <img src={x.userprofileurl} className="w-[100%] h-[100%] rounded-[100%] object-fill " draggable={false} alt={x.username}/>
                </div>
                <div className="w-full">
                  <div className="text-otherColor">{x.username} <span className="text-otherColor/40 text-[10px]">{x.displayDate}</span></div>
                  <div className="text-otherColor break-all wrap-break-word mr-[5px]">{x.message}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={bottomDiv}></div>
      </div>
      <div className="min-h-[55px] max-h-[100px] flex w-full overflow-hidden bg-primaryColor  overflow-x-hidden overflow-y-auto">
        <div contentEditable className="bg-secondaryColor w-full p-[5px] m-[10px] ml-[5px] mr-[5px] text-otherColor outline-none h-fit whitespace-pre-wrap wrap-break-word overflow-x-hidden max-w-full" onKeyDown={sendMessage} spellCheck={true} onInput={(e) => {
            setmessageData(e.target.innerText);
          }}
        />
        <div className="bg-[#5662f6] min-w-[5px] h-[40px] flex mt-auto mb-auto cursor-pointer" onClick={()=>{
          scrollBottom()
        }}></div>
      </div>
    </div>
  );



}
