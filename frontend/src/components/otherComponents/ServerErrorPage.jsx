import {useNavigate } from "react-router";
export default function ServerErrorPage(){
    const navigate = useNavigate()
    document.title =`Error | TheChatApp`
    return(
        <div className="bg-secondaryColor w-screen min-h-screen flex flex-col text-otherColor overflow-hidden">

            <div className="bg-primaryColor h-[80px] flex relative border-b-[1px] border-otherColor ">
                <div className="flex h-full pt-[20px] pb-[20px] pl-[15px] cursor-pointer ">
                    <div className="bg-textColor w-[5px] h-full hover:bg-otherColor duration-500"></div>
                    <div className="mt-auto mb-auto ml-[10px] text-otherColor text-[25px] font-semibold hover:text-otherColor/90">TheChatApp</div>
                </div>
            </div>

            <div className="mt-[180px] sm:mt-[150px]">
                <div className="text-center text-[20px] font-medium opacity-[90%] sm:text-[30px] select-none">We Are Checking</div>
                <div className="font-bold text-[40px] text-center text-red-500 align-middle sm:text-[50px]"> 
                    <span className="animate-pulse">Error 500 </span>
                    <div className="text-[20px] sm:text-[30px] ">Internal Server Error <span className="text-otherColor font-medium underline opacity-[90%] hover:cursor-pointer hover:text-textColor sm:text-[25px]" onClick={()=>{
                            location.reload()
                        }}>Reload?</span>
                    </div>
                </div>

            </div>
        </div>
    )
}