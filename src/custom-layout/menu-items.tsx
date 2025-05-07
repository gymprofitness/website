import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "@/components/ui/sheet";
import { IUser } from "@/interfaces";
import { SignOutButton } from "@clerk/nextjs";
import {
  BadgeDollarSign,
  FolderKanban,
  Home,
  Icon,
  List,
  LogOut,
  User2,
  UserPlus,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface IMenuItemsProps {
  user: IUser;
  openMenuItems: boolean;
  setOpenMenuItems: React.Dispatch<React.SetStateAction<boolean>>;
}

function MenuItems({ user, openMenuItems, setOpenMenuItems }: IMenuItemsProps) {
  const iconSize = 15;

  const pathname = usePathname();
  const router = useRouter();
  const userMenuItems = [
    {
      name: "Home",
      icon: <Home size={iconSize} />,
      route: "/account",
    },
    {
      name: "Profile",
      icon: <User2 size={iconSize} />,
      route: "/account/user/profile",
    },
    {
      name: "Subscriptions",
      icon: <BadgeDollarSign size={iconSize} />,
      route: "/account/user/subscriptions",
    },
    {
      name: "Referrals",
      icon: <UserPlus size={iconSize} />,
      route: "/account/user/referrals",
    },
  ];
  const adminMenuItmes = [
    {
      name: "Home",
      icon: <Home size={iconSize} />,
      route: "/account",
    },
    {
      name: "Plans",
      icon: <FolderKanban size={iconSize} />,
      route: "/account/admin/plans",
    },
    {
      name: "Users",
      icon: <User2 size={iconSize} />,
      route: "/account/admin/users",
    },
    {
      name: "Subscriptions",
      icon: <BadgeDollarSign size={iconSize} />,
      route: "/account/admin/subscriptions",
    },
    {
      name: "Customers",
      icon: <List size={iconSize} />,
      route: "/account/user/customer",
    },
    {
      name: "Referrals",
      icon: <UserPlus size={iconSize} />,
      route: "/account/admin/referrals",
    },
  ];

  let menuItemsToRender = user.is_admin ? adminMenuItmes : userMenuItems;

  return (
    <Sheet open={openMenuItems} onOpenChange={setOpenMenuItems}>
      <SheetContent>
        <SheetHeader>
          <div className="flex flex-col gap-10 mt-20">
            {menuItemsToRender.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 cursor-pointer rounded ${
                  pathname === item.route
                    ? "bg-gray-100 border-2 border-gray-500"
                    : ""
                }`}
                onClick={() => {
                  router.push(item.route);
                  setOpenMenuItems(false);
                }}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
            <SignOutButton>
              <Button className="relative overflow-hidden group flex items-center bg-black text-white border border-gray-800 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,50,50,0.5)]">
                <span className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  Logout
                  <LogOut
                    size={iconSize}
                    className="ml-2 transition-all duration-300 group-hover:text-red-400"
                  />
                </span>
              </Button>
            </SignOutButton>
          </div>
          <SheetTitle></SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default MenuItems;
