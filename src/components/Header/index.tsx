import { Menu, Search, Bell } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4  bg-slate-50 px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-md md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
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
