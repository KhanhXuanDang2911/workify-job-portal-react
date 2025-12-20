import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Users, MapPin } from "lucide-react";
import { routes } from "@/routes/routes.const";
import { useTranslation } from "@/hooks/useTranslation";

interface CompanyHiringJob {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  typeColor: string;
  logo?: string;
  numberOfApplications: number;
}

interface CompanyHiringJobsProps {
  jobs: CompanyHiringJob[];
  companyName: string;
  onViewAll?: () => void;
}

const CompanyHiringJobs: React.FC<CompanyHiringJobsProps> = ({
  jobs,
  companyName,
  onViewAll,
}) => {
  const { t } = useTranslation();
  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100 p-6 h-fit">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#1967d2]" />
          <h3 className="font-semibold text-gray-900">
            {t("companyHiringJobs.title", { companyName })}
          </h3>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              {t("companyHiringJobs.noJobs")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/${routes.JOB_DETAIL}/${job.id}`}
                className="block p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar + Badge */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={job.logo} alt={job.company} />
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
                    <h4 className="font-medium text-sm text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-600 truncate">
                        {job.location || t("companyHiringJobs.notUpdated")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-semibold text-blue-600">
                        {job.salary}
                      </p>
                      {job.numberOfApplications > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          <Users className="w-3 h-3" />
                          <span className="font-medium">
                            {job.numberOfApplications}
                          </span>
                          <span className="text-[10px]">
                            {t("companyHiringJobs.applicants")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompanyHiringJobs;
