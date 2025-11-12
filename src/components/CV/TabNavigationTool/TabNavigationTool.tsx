import { cn } from "@/lib/utils";

interface CVSidebarProps {
  tabs: { id: string; label: string; icon: React.ComponentType<any> }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TabNavigationTool({ activeTab, onTabChange, tabs }: CVSidebarProps) {
  return (
    <div className="w-48 bg-white border-r border-gray-200 rounded-sm flex flex-col self-start">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-full group flex items-center gap-3 px-4 py-3 text-left transition-colors ${
            activeTab === tab.id
              ? "bg-green-200 border-l-4 border-green-600 text-gray-900"
              : "text-gray-700 hover:bg-green-200"
          }`}
        >
          <tab.icon
            className={cn(
              "w-5 h-5 group-hover:text-green-600",
              activeTab === tab.id && "text-green-600"
            )}
          />
          <span
            className={cn(
              "text-base font-semibold group-hover:text-green-600",
              activeTab === tab.id && "text-green-600"
            )}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default TabNavigationTool;
