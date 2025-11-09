import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";

interface SuggestedJob {
  id: number;
  title: string;
  company: string;
  salary: string;
  type: string;
  typeColor: string;
}

interface SuggestedJobsProps {
  jobs: SuggestedJob[];
  onViewAll?: () => void;
}

const SuggestedJobs: React.FC<SuggestedJobsProps> = ({ jobs, onViewAll }) => {
  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = (id: number) => {
    return `https://i.pravatar.cc/40?img=${id}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm border border-gray-100 p-6 h-fit">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Việc Làm Hấp Dẫn</h3>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar + Badge */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={getAvatarUrl(job.id)}
                        alt={job.company}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                        {getCompanyInitials(job.company)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge
                      className={`${job.typeColor} text-white text-[10px] px-2 py-0.5 rounded mt-1`}
                    >
                      {job.type}
                    </Badge>
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 leading-tight mb-1">
                      {job.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 truncate">
                      {job.company}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      {job.salary}/month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onViewAll}
          >
            View All Suggestions
          </Button>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-white shadow-sm border border-gray-100 p-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Job Search Tips</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use specific keywords related to your desired position</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Set up job alerts to get notified of new opportunities</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p>Update your profile regularly to attract recruiters</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SuggestedJobs;
