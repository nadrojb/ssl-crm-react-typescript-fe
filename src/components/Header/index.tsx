import { Menu, Bell } from "lucide-react";
import type { ReactNode } from "react";

interface HeaderProps {
  onMenuClick: () => void;
  title: ReactNode;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4  bg-slate-50 px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-md md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      <button className="relative p-2 hover:bg-gray-100 rounded-md">
        <Bell className="h-5 w-5 text-gray-600" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </button>

      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-sm font-medium text-white">A</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium">Admin</p>
        </div>
      </div>
    </header>
  );
}
