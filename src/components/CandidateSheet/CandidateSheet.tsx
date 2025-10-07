import type React from "react";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Mail, Phone, MapPin, Calendar, GraduationCap, MoreVertical, Send } from "lucide-react";
import TabsAnimation from "@/components/TabsAnimation";
import ResumeTab from "@/components/CandidateSheet/tabs/ResumeTab";
import InterviewTab from "@/components/CandidateSheet/tabs/InterviewTab";
import JobApplicationTab from "@/components/CandidateSheet/tabs/JobApplicationTab";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  appliedDate: string;
  status: string;
}

interface CandidateSheetProps {
  candidate: any;
  children?: React.ReactNode;
  className?: string;
}

const tabs = [
  { id: "job-application", label: "Job Application" },
  { id: "resume", label: "Resume" },
  { id: "interview", label: "Interview" },
];

export function CandidateSheet({ candidate, children, className }: CandidateSheetProps) {
  const [activeTab, setActiveTab] = useState("job-application");

  const renderTabContent = () => {
    switch (activeTab) {
      case "job-application":
        return <JobApplicationTab candidate={candidate} />;
      case "resume":
        return <ResumeTab candidate={candidate} />;
      case "interview":
        return <InterviewTab candidate={candidate} />;
      default:
        return <JobApplicationTab candidate={candidate} />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-[900px] p-0 overflow-y-auto">
        {/* Header Section */}
        <div className="sticky top-0 bg-white border-b z-10 p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="w-16 h-16">
              <AvatarImage src={candidate?.avatar || candidate?.avatarUrl || "/placeholder.svg"} alt={candidate?.name || "Candidate"} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">{candidate?.name?.charAt(0) || "C"}</AvatarFallback>
            </Avatar>

            {/* Candidate Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{candidate?.name || "Kristi Sipes"}</h2>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">3.5</span>
                  <span className="text-gray-500">Overall</span>
                </div>
                <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <span className="text-gray-500">Origin</span>
                  <p className="font-medium text-gray-900">Career Site</p>
                </div>
                <div>
                  <span className="text-gray-500">Applied at</span>
                  <p className="font-medium text-gray-900">19 October, 2025</p>
                </div>
                <div>
                  <span className="text-gray-500">Job Applied</span>
                  <p className="font-medium text-gray-900">Senior Frontend Developer</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
              <Button className="bg-[#1967d2] hover:bg-[#1251a3] text-white">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <TabsAnimation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} indicatorClassName="!bg-orange-400" tabsBoxPadding="3.5" />
        </div>

        {/* Content Area */}
        <div className="flex gap-6 p-6">
          {/* Main Content - Left Side */}
          <div className="flex-1">{renderTabContent()}</div>

          {/* Sidebar - Right Side */}
          <div className="w-80 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Email Address</p>
                    <p className="text-blue-600">kristisipes@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Phone Number</p>
                    <p className="text-blue-600">+62-921-019-112</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Gender</p>
                    <p className="text-gray-900">Female</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Birthdate</p>
                    <p className="text-gray-900">May 20, 2000</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Living Address</p>
                    <p className="text-gray-900">New York, NY, 10001, United States</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Education Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">University</p>
                    <p className="text-gray-900">Da Nang University of Science and Technology</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Qualification Held</p>
                    <p className="text-gray-900">Bachelor of Engineering</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Year Graduation</p>
                    <p className="text-gray-900">2014</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">Referral</p>
                    <p className="text-gray-400">Not Provided</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
              <div className="relative">
                <textarea
                  placeholder="Write note..."
                  className="w-full min-h-[100px] p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
