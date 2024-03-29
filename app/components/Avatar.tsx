"use client";

import Image from "next/image";
import { User } from "@prisma/client";
import useActiveList from "../hooks/useActiveList";

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  console.log("members", members);
  console.log("index", members.indexOf(user?.email!));
  
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div className="relative inline-block rounded-full overflow-clip h-9 w-9 md:h-11 md:w-11">
        <Image
          alt="Avatar"
          src={user?.image || "/imgs/placeholder.png"}
          fill
          className="object-cover"
        />
      </div>
      {isActive && (
        <span className="absolute block rounded-full bg-green-700 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-3 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
