"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
    icon: IconType,
    label: string;
    href: string;
    isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    href,
    isActive
}) => {
  return (
    <Link
        href={href}
        className={twMerge(
            "flex flex-row h-auto items-center w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1",
            isActive && "text-white"
        )}
    >
        <Icon size={26}/>
        <p className="truncate h-full">{label}</p>
    </Link>
  )
}

export default SidebarItem