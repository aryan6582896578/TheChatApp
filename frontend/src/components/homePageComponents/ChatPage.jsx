import { useState, useRef, useEffect } from "react";
import { ServerListComponent } from "../userComponents/ServerListComponent.jsx";
import { UserProfileComponent } from "../userComponents/UserProfileComponent.jsx";
import axios from "axios";

export default function ChatPage() {
  document.title = `@me | TheChatApp`;
  return (
    <div className="bg-orange-500 flex h-full">
      <ServerListComponent />
        <DmListComponent />
        <FriendListComponent />
    </div>
  );
}

function DmListComponent() {
  return (
    <div className="flex overflow-hidden flex-col bg-primaryColor min-w-[250px] ">
      <input
        className="bg-secondaryColor m-[10px] min-h-[40px] rounded-[5px] font-medium pl-[10px] border-solid border-[2px] border-primaryColor text-otherColor/80 "
        disabled
        placeholder="Search"
      />
      <span className="overflow-y-hidden hover:overflow-y-auto pr-[10px] h-[100%]">
      </span>
      <UserProfileComponent />
    </div>
  );
}

function FriendListComponent() {
  return (
    <div className="flex w-[100%] flex-col bg-primaryColor h-[100%] border-l-secondaryColor sm:border-l-[1px]">
      <div className="text-[25px] ml-[10px] text-otherColor/50">Friends</div>
    </div>
  );
}

