import TabsAnimation from "@/components/TabsAnimation";
import AccountSettingsTab from "@/pages/Employer/Settings/components/AccountSettingsTab";
import LoginSecurityTab from "@/pages/Employer/Settings/components/LoginSecurityTab";
import NotificationSettingsTab from "@/pages/Employer/Settings/components/NotificationSettingsTab";
import { useState } from "react";

const tabs = [
  { id: "account-settings", label: "Account Settings" },
  { id: "login-security", label: "Login & Security" },
  { id: "notification-settings", label: "Notification Settings" },
];

const accountInformation = {
  avatarUrl: "https://i.pinimg.com/1200x/5a/22/d8/5a22d8574a6de748e79d81dc22463702.jpg",
  fullName: "Dung Van",
  email: "dungvan.170204@gmail.com",
  username: "ssquytm",
  phoneNumber: "945-913-2196",
  bio: "In a cruel twist of fate, I’m a cat person who is allergic to cats. I make up for this by owning lots of shirts with cats on them.",
  password: "OldPassword123!",
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account-settings");
  const [employerInfo, setEmployerInfo] = useState(accountInformation);

  return (
    <div className="bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 bg-white px-6 py-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-[#1967d2] mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-stretch">
          <div className="self-start">
            <TabsAnimation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} tabsBoxPadding="4" tabClassName="text-sm px-6" indicatorClassName="!bg-lime-400" />
          </div>

          <div className="mt-6 ">
            {activeTab === "account-settings" && <AccountSettingsTab accountInformation={employerInfo} setAccountInformation={setEmployerInfo} />}
            {activeTab === "login-security" && <LoginSecurityTab currentPassword={employerInfo.password} />}
            {activeTab === "notification-settings" && <NotificationSettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
