import { X, LayoutDashboard, Building2, Briefcase, Users, CheckSquare, Calendar, LogOut } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Building2, label: "Institutions", href: "/institutions" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white text-gray-900 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold">SSL CRM</span>
          <button onClick={onClose} className="md:hidden p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
