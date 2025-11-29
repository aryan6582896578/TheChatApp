import { useNavigate } from "react-router";

export default function HomePage() {
  return (
    <div className="bg-secondaryColor h-full">
        <HomePageNavbar/>
    </div>
  );
}

document.title = `Home | TheChatApp`;

function HomePageNavbar() {
  const navigate = useNavigate();

  return(
      <div className="bg-primaryColor h-[80px] flex relative border-b-[1px] border-otherColor ">
        <div className="flex h-full pt-[20px] pb-[20px] pl-[15px] cursor-pointer ">
            <div className="bg-textColor w-[5px] h-full hover:bg-otherColor duration-500"></div>
            <div className="mt-auto mb-auto ml-[10px] text-otherColor text-[25px] font-semibold hover:text-otherColor/90">TheChatApp</div>
        </div>

        <div className="end-[20px] flex absolute h-full pt-[20px] pb-[20px]">
            <button className="bg-textColor/90 text-otherColor font-semibold w-fit text-[20px] rounded-[5px] pl-[15px] pr-[15px] hover:bg-textColor/70 cursor-pointer" onClick={()=>{
                {document.cookie?navigate(`${import.meta.env.VITE_VERSION_LIVE}/@me/chat`):navigate(`${import.meta.env.VITE_VERSION_LIVE}/login`)}
            }}>{ document.cookie? "Continue":"Login"}</button>
        </div>
      </div>

    );
}
