import React from "react";
import { IUser } from "@/interfaces";
import { Menu } from "lucide-react";
import MenuItems from "./menu-items";
import { UserButton } from "@clerk/nextjs";

function Header({ user }: { user: IUser | null }) {
  const [openMenuItems, setOpenMenuItems] = React.useState<boolean>(false);
  return (
    <div className="flex items-center justify-between bg-black px-5 py-6">
      <h1 className="text-3xl font bold text-center">
        <b className="text-white">Tracky</b>
        <b className="text-orange-600">.Fy</b>
      </h1>
      <div className="flex gap-5 items-center">
        <h1 className="text-sm text-white px-4">{user?.name}</h1>
        <UserButton />
        <Menu
          className="text-white cursor-pointer"
          size={30}
          onClick={() => setOpenMenuItems(true)}
        />
      </div>
      {openMenuItems && user && (
        <MenuItems
          user={user}
          openMenuItems={openMenuItems}
          setOpenMenuItems={setOpenMenuItems}
        />
      )}
    </div>
  );
}

export default Header;
