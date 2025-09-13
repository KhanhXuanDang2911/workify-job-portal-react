import { Briefcase, Building2, Calendar, FileText, HelpCircle, Home, MessageSquare, Search, Settings, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  { to: "/auth/home", icon: Home, label: "My Workify" },
  { to: "/auth/messages", icon: MessageSquare, label: "Messages" },
  { to: "/auth/company-profile", icon: Building2, label: "Company Profile" },
  { to: "/auth/candidates", icon: Users, label: "Received Applications" },
  { to: "/auth/search-talents", icon: Search, label: "Search Talents" },
  { to: "/auth/jobs", icon: FileText, label: "Danh sách việc làm" },
  { to: "/auth/recruitment", icon: Briefcase, label: "Tin tuyển dụng" },
  { to: "/auth/schedule", icon: Calendar, label: "My Schedule" },
];

const company = {
  name: "YourCompany",
  logo: "",
};

function EmployerSidebar() {
  return (
    <aside className="w-64 bg-[#e9ebfd] min-h-screen p-4">
      <div className="flex items-center gap-3 px-2 mb-6">
        <Avatar className="w-10 h-10">
          <AvatarImage src={company.logo || "/placeholder.svg"} />
          <AvatarFallback className="bg-[#4640de] text-white">{company.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-lg text-[#4640de]">YourCompany</span>
      </div>
      <nav className="space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
               ${isActive ? "bg-white text-[#4640de]" : "text-[#7c8493] hover:bg-white/50"}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <hr className="mt-3" />

      <div className="mt-5">
        <p className="text-xs text-[#7c8493] font-semibold mb-4 px-3">SETTINGS</p>
        <div className="space-y-2">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
               ${isActive ? "bg-white text-[#4640de]" : "text-[#7c8493] hover:bg-white/50"}`
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>

          <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
               ${isActive ? "bg-white text-[#4640de]" : "text-[#7c8493] hover:bg-white/50"}`
            }
          >
            <HelpCircle size={20} />
            <span>Help Center</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default EmployerSidebar;
