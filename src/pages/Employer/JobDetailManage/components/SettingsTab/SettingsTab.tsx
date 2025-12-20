import { useState } from "react";
import ApplicationFormSettings from "@/pages/Employer/JobDetailManage/components/ApplicationFormSettings";
import HiringPipelineSettings from "@/pages/Employer/JobDetailManage/components/HiringPipelineSettings";
import ScoreCardSettings from "@/pages/Employer/JobDetailManage/components/ScoreCardSettings";
import TabsAnimation from "@/components/TabsAnimation";

const tabs = [
  { id: "application-form", label: "Application Form", icon: null },
  { id: "hiring-pipeline", label: "Hiring Pipeline", icon: null },
  { id: "score-card", label: "Score Card", icon: null },
];
export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState("application-form");

  return (
    <div className="py-6 mx-6">
      <TabsAnimation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        tabsBoxPadding="3.5"
        tabClassName="text-sm"
        indicatorClassName="!bg-purple-400"
      />
      {/* Content */}
      <div className=" mt-3 bg-white ">
        {activeTab === "application-form" && <ApplicationFormSettings />}
        {activeTab === "hiring-pipeline" && <HiringPipelineSettings />}
        {activeTab === "score-card" && <ScoreCardSettings />}
      </div>
    </div>
  );
}
