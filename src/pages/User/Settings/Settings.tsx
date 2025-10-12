import PersonalTab from "./components/PersonalTab";
import ProfileTab from "./components/ProfileTab";
import SocialLinksTab from "./components/SocialLinksTab";
import AccountSettingTab from "./components/AccountSettingTab";
import UserSideBar from "@/components/UserSideBar";
import { useState } from "react";
import { User, UserCircle, Globe, SettingsIcon } from "lucide-react";
import TabsAnimation from "@/components/TabsAnimation";

const tabs = [
  { id: "personal", label: "Personal", icon: User },
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "social-links", label: "Social Links", icon: Globe },
  { id: "account-setting", label: "Account Setting", icon: SettingsIcon },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="flex " style={{ background: "linear-gradient(90deg,#FCD1C0 0%,#BBDFD5 43%,#88D5D6 100%)" }}>
      {/* Sidebar */}
      <div className=" ml-5 my-4 w-64 flex-shrink-0">
        <UserSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto my-4">
          {/* Header */}
          <div className="mb-4 bg-white py-4 rounded-lg px-5">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>

          {/* Tabs */}
          <TabsAnimation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            indicatorClassName="bg-[#1967d2]"
            tabsBoxClassName="border border-[#1967d2] rounded-2xl p-1 bg-white"
            tabClassName="px-4 py-2 rounded-2xl font-medium transition-colors text-center"
            tabsBoxPadding="2"
          />

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === "personal" && <PersonalTab />}
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "social-links" && <SocialLinksTab />}
            {activeTab === "account-setting" && <AccountSettingTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
