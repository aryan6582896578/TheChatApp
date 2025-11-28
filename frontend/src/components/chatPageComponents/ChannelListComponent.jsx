import { useState, useRef, useEffect, useEffectEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
export default function ChannelListComponent(){
    const navigate = useNavigate();
    const parms = useParams();
    const[serverId,setserverId]=useState("")
    const [channelId, setchannelId] = useState([]);
    const [channelName, setchannelName] = useState(["Loading..."]);
    
    const [displayCreateChannelBox,setdisplayCreateChannelBox]=useState(false)
    const [createChannelName,setcreateChannelName] = useState({channel:""})
    const [adminCheck,setadminCheck]=useState(false)

    async function postCreateChannel(){
      if(createChannelName){
        const createServerChannel = await axios.post(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${parms.serverId}/createChannel`,createChannelName,{
        withCredentials: true
      })
      if(createServerChannel.data.status==="channelCreated"){
        setdisplayCreateChannelBox(false)
        navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${serverId}/${createServerChannel.data.channelId}`)
      }else if(createServerChannel.data.status==="invalidUser" || createServerChannel.data.status==="invalidData"){
        navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat`)
      }
      }
    }
    async function getChannelData() {
        const channelList = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${parms.serverId}/channelList`,{
            withCredentials: true,
          })  
          setchannelId(Object.keys(channelList.data.channelList))
          setchannelName(Object.values(channelList.data.channelList))
          
    }
    async function getServerData() {
    
    const adminStatus = await axios.get(`${import.meta.env.VITE_SERVERURL}${import.meta.env.VITE_VERSION_LIVE}/s/${parms.serverId}/serverInfo`,{
        withCredentials: true,
    })
    
    if(adminStatus.data.adminStatus===true){
      setadminCheck(true)
    }
  }
    useEffect(() => {
      setserverId(parms.serverId)
      getServerData()
      getChannelData()
      return () => {
        setcreateChannelName("")
        setserverId("")
        setchannelId([])
        setchannelName([])
      }
    }, [parms.serverId])
      
      return(
          <div className=" sm:w-[250px] h-[100%]  flex flex-col pt-[10px] relative bg-primaryColor">   
          <div className=" text-[10px] font-bold ml-[5px] flex min-h-[20px] hover:underline hover:cursor-pointer text-otherColor/60">
            TEXT CHANNELS 
          <button className={`end-[0px] top-0 flex absolute font-bold text-[20px] hover:text-red-500 duration-[0.5s] cursor-pointer ${adminCheck?"flex":"hidden"}`} onClick={()=>{
              setdisplayCreateChannelBox(true)
            }}> + </button>
          </div>
                {channelName.map((channelName,x)=>{
                  return (
                    <button key={x} className={`flex text-[20px] m-[5px] ml-[1px] rounded-[5px] mb-[5px] p-[5px] pl-0 pr-0 font-medium text-otherColor/90 ${channelId[x]===parms.channelId?"bg-otherColor/5":""} hover:text-otherColor  hover:bg-otherColor/5 overflow-clip cursor-pointer`} onClick={()=>{
                     navigate(`/${import.meta.env.VITE_VERSION_LIVE}/@me/chat/${serverId}/${channelId[x]}`)
                    }}> <span className="ml-[10px] mr-[10px] text-otherColor/60 ">#</span>{channelName} </button>
                  )
                })}
                {displayCreateChannelBox? <CreateChannelBox setdisplayCreateChannelBox={setdisplayCreateChannelBox} postCreateChannel={postCreateChannel} setcreateChannelName={setcreateChannelName} createChannelName={createChannelName}/>:""}
        </div>
       
      )
  }

  function CreateChannelBox({setdisplayCreateChannelBox,postCreateChannel,setcreateChannelName,createChannelName}){
    
    return(
        <div className="w-[100%] h-[100%] fixed top-[0px] left-0 bg-primaryColor z-[10]">
          <div className="bg-secondaryColor h-[70px] w-[100%]  border-b-otherColor border-opacity-[80%] border-b-[1px]">
            <div className="flex">
              <div>
                <button className="end-[10px] top-[10px] absolute min-w-[5px] min-h-[45px] bg-red-500 rounded-[10px] hover:bg-text3Color duration-[0.5s]" onClick={() => {
                  setdisplayCreateChannelBox(false)
                }}/>
              </div>
            </div>   
          </div>

          <div className="flex h-[100%] w-[100%] flex-col md:w-[400px] md:ml-auto md:mr-auto">
            <div className="text-[35px] overflow-hidden break-words ">
                <div className="text-otherColor font-bold text-center">
                  Create Channel
                </div>
            </div>
            <div className="bg-textColor rounded-[5px] w-[90%] mt-[20px] ml-auto mr-auto content-center flex bg-opacity-[20%] border-solid border-[2px] border-transparent hover:border-textColor duration-[0.5s] ">
              <span className="text-[30px] ml-[5px] mr-[5px] opacity-[80%] ">#</span>
              <input className="w-[100%] h-[100%] outline-none bg-transparent text-[25px] text-otherColor " maxLength={15} placeholder="General" required onChange={(e)=>{
                setcreateChannelName({...createChannelName , channel:e.target.value})
              }}/> 
            </div>
            <div className="h-[100%] mt-[20px] text-otherColor pl-[20px] pr-[20px] text-[18px] w-[100%] ml-auto mr-auto ">
              <button
                className="w-[100%] h-[40px] bg-textColor rounded-[10px] border-solid border-[3px] border-transparent hover:bg-opacity-20 hover:border-textColor duration-[0.5s] font-semibold "
                onClick={() => {
                  postCreateChannel()
                  setcreateChannelName("")
                  
                }}  
              >
                Create Channel
              </button>
            </div>
          </div>

    </div>
    )
  }