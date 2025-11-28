import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
// import { getJwtCookie, socket } from "../managesocket";
import axios from "axios";


export function ChatBoxComponent() {
  const navigate = useNavigate();
  const parms = useParams();
  let date = new Date();

  const [messageData, setmessageData] = useState("");
  const[uId,suId]=useState("")
  
  const [displayMessageSocket,setdisplayMessageSocket]= useState([]);
  const [displayMessageDb,setdisplayMessageDb]= useState([]);

  const getMessageCount=useRef(20);
  const getMaxMessageCount = useRef(21);

  const [topReached,settopReached]=useState(false)
  const chatDiv = useRef(null)
  const chatDivBottom = useRef(null)
  const chatDivTop = useRef(null)

  const[scrollDown,setscrollDown]=useState(true);

  const[userProfileInfo,setuserProfileInfo] = useState({username:"someshitisseriouslywrong",userprofileurl:null})
  function scrollBottom(){
    if (chatDiv.current) {
      chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }
  }
  useEffect(() => {
    if(displayMessageDb.length<=20){
      scrollBottom()
    }
  }, [displayMessageDb]);

  useEffect(() => {
    if (displayMessageSocket?.length && displayMessageSocket[displayMessageSocket.length - 1].userId === uId) {
      chatDivBottom.current?.scrollIntoView();
    }
  }, [displayMessageSocket]);

  function scrollTopPage(){

    if(topReached && getMessageCount.current<getMaxMessageCount.current){
       if(topReached && getMessageCount.current<getMaxMessageCount.current){
       if(chatDivTop.current.scrollHeight===0){
        chatDiv.current?.scroll({
          top: 10,
        })
        getMessageCount.current += 20;
         getMessage()  
         settopReached(false)
       }
  }
}}
   useEffect(() => {
    scrollTopPage()
  }, [topReached])
  async function getMessage() {
      const messageData = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION}/messageData/${parms.serverId}/${parms.channelId}/${getMessageCount.current}`,{
        withCredentials: true,
      });
      if(messageData){
        setdisplayMessageDb(messageData.data.message)
        getMaxMessageCount.current = messageData.data.messageCountMax
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
    suId(userData.data.userId)
    return userId;
  }

  useEffect(() => {
    getUserData()
    getMessage()
    
    // const jwtToken = getJwtCookie();
    // const serverId = parms.serverId;
    // const channelId = parms.channelId;
    // socket.emit("joinServer", { jwtToken,serverId,channelId},()=>{
    //   socket.on(`${serverId}/${channelId}`,async (messageData)=>{
    //     console.log(messageData)
    //     setdisplayMessageSocket(a=>[...a,messageData])    
    //   })
    // });
    // socket.emit("joinServer", { jwtToken,serverId,channelId});
    // socket.on(`${serverId}/${channelId}`,async (messageData)=>{
    //   console.log(messageData)
    //   setdisplayMessageSocket(a=>[...a,messageData])    
    // })
    // socket.emit("test");
    // socket.on("testserver",async (x)=>{
    // console.log(x)  
    // })
    return () => {
      // socket.off(`${parms.serverId}/${parms.channelId}`);
      setdisplayMessageSocket([])
      setdisplayMessageDb([])
    }
  }, [parms.serverId,parms.channelId])


  return (
    <div className="bg-primaryColor w-full h-full flex flex-col relative">
          {/* <div className="bg-primaryColor flex-1 break-all overflow-y-scroll flex flex-col h-[100%]" ref={chatDiv} onScroll={(e)=>{if(e.target.scrollTop===0){settopReached(true) }}}>
          <div ref={chatDivTop}></div>
          
          {displayMessageDb?.map((data,x)=>{
                return( 
                  <div key={x} className="m-[5px] hover:bg-otherColor/5 p-[5px] rounded-[5px] cursor-pointer" >
                                
                    <div className="font-medium text-textColor text-[20px]" >{displayMessageDb[x].username}<span className="text-otherColor font-normal text-[10px] opacity-[50%] ml-[10px]">{displayMessageDb[x].displayDate}</span></div>
                    <div className="text-otherColor text-opacity-[80%] break-before-column">{displayMessageDb[x].message}</div>
                  </div>
                )
              })}
         
          
           {displayMessageSocket?.map((data,x)=>{
                return(
                  <div key={x} className="m-[5px] hover:bg-otherColor/5 p-[5px] rounded-[5px] cursor-pointer ">
 
                    <div className="font-medium text-[20px] flex" >
                       <img src={data.userprofileurl} className="w-[40px] h-[40px] rounded-[100%] mr-[10px] " alt="pfp"/>
                      {data.username}<span className="text-otherColor font-normal text-[10px] opacity-[50%] ml-[10px]">{data.date}</span></div>
                    <div className="text-otherColor text-opacity-[80%]">{data.message}</div>

                    <div className="flex w-[100%] h-[70px]">
                      <div className="">
                        <img src={data.userprofileurl} className="w-[40px] h-[40px] rounded-[100%] m-[5px] flex " alt="pfp"/>
                      </div>
                      <div className="w-[100%]">
                        <div className="font-medium text-[20px] flex ml-[5px]" >
                          {data.username}<span className="text-otherColor/50 font-normal text-[10px]  ml-[10px] mt-[10px]">{data.date}</span>
                        </div>
                        <div className="text-otherColor mt-[5px]">{data.message}</div>
                      </div>
                    </div>
                    
                  </div>
                )
              })} 
          
          <div ref={chatDivBottom}></div>

        </div> */}


      <div className=" flex flex-col absolute w-[100%] overflow-y-scroll bottom-[55px] top-[0]">
          {displayMessageDb?.map((data,x)=>{
                return( 
                  <div key={x} className="m-[5px] hover:bg-otherColor/5 p-[5px] rounded-[5px] cursor-pointer" >
                                
                    <div className="font-medium text-textColor text-[20px]" >{displayMessageDb[x].username}<span className="text-otherColor font-normal text-[10px] opacity-[50%] ml-[10px]">{displayMessageDb[x].displayDate}</span></div>
                    <div className="text-otherColor text-opacity-[80%] break-before-column">{displayMessageDb[x].message}</div>
                  </div>
                )
              })}
           {displayMessageSocket?.map((data,x)=>{
                return(
                  <div key={x} className="m-[5px] hover:bg-otherColor/5 p-[5px] rounded-[5px] cursor-pointer ">
 
                    <div className="font-medium text-[20px] flex" >
                       <img src={data.userprofileurl} className="w-[40px] h-[40px] rounded-[100%] mr-[10px] " alt="pfp"/>
                      {data.username}<span className="text-otherColor font-normal text-[10px] opacity-[50%] ml-[10px]">{data.date}</span></div>
                    <div className="text-otherColor text-opacity-[80%]">{data.message}</div>

                    <div className="flex w-[100%] h-[70px]">
                      <div className="">
                        <img src={data.userprofileurl} className="w-[40px] h-[40px] rounded-[100%] m-[5px] flex " alt="pfp"/>
                      </div>
                      <div className="w-[100%]">
                        <div className="font-medium text-[20px] flex ml-[5px]" >
                          {data.username}<span className="text-otherColor/50 font-normal text-[10px]  ml-[10px] mt-[10px]">{data.date}</span>
                        </div>
                        <div className="text-otherColor mt-[5px]">{data.message}</div>
                      </div>
                    </div>
                    
                  </div>
                )
              })} 
      </div>


        <div className="min-h-[55px] max-h-[55px] overflow-hidden bg-primaryColor flex w-[100%] absolute bottom-0">
        <div contentEditable className="w-[100%] h-[70%] ml-[10px] mt-auto mb-auto rounded-[5px] bg-otherColor/9 outline-none p-[5px] text-otherColor"  onKeyDown={sendMessage} spellCheck={true}  onInput={(e) => {
                    setmessageData(e.target.innerText);         
              }}/>
        {scrollDown?<button className=" bg-purple-500 h-[70%] mt-auto mb-auto w-[5px] rounded-[10px] hover:bg-purple-600 mr-[5px] ml-[5px]" onClick={scrollBottom}/>:""}  
      </div>
    </div>

  );




}
