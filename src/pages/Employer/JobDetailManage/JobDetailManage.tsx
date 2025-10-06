import { useState } from "react";
import { ChevronLeft, MoreHorizontal, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CandidatesTab from "@/pages/Employer/JobDetailManage/components/CandidatesTab";
import SettingsTab from "@/pages/Employer/JobDetailManage/components/SettingsTab";
import TabsAnimation from "@/components/TabsAnimation";

const tabs = [
  { id: "candidates", label: "CANDIDATES" },
  { id: "job-details", label: "JOB DETAILS" },
  { id: "timeline-notes", label: "TIMELINE & NOTES" },
  { id: "hiring-team", label: "HIRING TEAM" },
  { id: "settings", label: "SETTINGS" },
];

export default function JobDetailManage() {
  const [activeTab, setActiveTab] = useState("candidates");

  return (
    <div className="bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      {/* Header */}
      <div className="bg-white border m-3">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-[#1967d2] flex items-center gap-2">
                Senior Product Designer
                <MoreHorizontal className="h-5 w-5 text-gray-400 cursor-pointer" />
              </h1>
              <p className="text-sm text-gray-500">IT Developer • Full time</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc]">
              <Share2 className="h-4 w-4" />
              Share & Promote
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#1967d2] hover:bg-[#1251a3] gap-2">
                  <Check className="h-4 w-4" />
                  Published
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Unpublish</DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Archive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-3 bg-white border">
        <div className="m-5">
          <TabsAnimation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} tabsBoxPadding="3.5" />
        </div>
      </div>
      {/* Content */}
      <div className="mx-3 mt-3 bg-white border">
        {activeTab === "candidates" && (
          <div>
            <CandidatesTab />
          </div>
        )}
        {activeTab === "job-details" && <div>Job Details Content</div>}
        {activeTab === "timeline-notes" && <div>Timeline & Notes Content</div>}
        {activeTab === "hiring-team" && <div>Hiring Team Content</div>}
        {activeTab === "settings" && (
          <div>
            <SettingsTab />
          </div>
        )}
      </div>
    </div>
  );
}
