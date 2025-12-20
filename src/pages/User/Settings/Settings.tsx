import ProfileTab from "./components/ProfileTab";
import AccountSettingTab from "./components/AccountSettingTab";
import UserSideBar from "@/components/UserSideBar";
import { useState } from "react";
import { UserCircle, SettingsIcon } from "lucide-react";
import TabsAnimation from "@/components/TabsAnimation";
import { useTranslation } from "@/hooks/useTranslation";
import PageTitle from "@/components/PageTitle/PageTitle";

export default function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: t("settings.tabs.profile"), icon: UserCircle },
    {
      id: "account-setting",
      label: t("settings.tabs.accountSetting"),
      icon: SettingsIcon,
    },
  ];

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={{
        background:
          "linear-gradient(90deg,#FCD1C0 0%,#BBDFD5 43%,#88D5D6 100%)",
      }}
    >
      <PageTitle title={t("pageTitles.settings")} />
      {/* Sidebar */}
      <div className="lg:ml-5 lg:my-4 w-full lg:w-64 flex-shrink-0">
        <UserSideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto my-4 px-4 lg:px-0">
          {/* Header */}
          <div className="mb-4 bg-white py-4 rounded-lg px-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("settings.title")}
            </h1>
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
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "account-setting" && <AccountSettingTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
