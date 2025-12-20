import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/routes/routes.const";
import { Link } from "react-router-dom";
import { Briefcase, Clock, Bookmark, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  period: string;
  type: string;
  typeColor: string;
  posted: string;
  logo: string;
  companyWebsite?: string;
};

export default function JobCard({ job }: { job: Job }) {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 border-2 border-blue-200 rounded-xl p-6 shadow-md hover:bg-blue-50 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start gap-5">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-gray-300">
          <img
            src={job.logo || "/placeholder.svg"}
            alt={job.company}
            className="w-12 h-12 object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <h3 className="text-gray-600 text-sm mb-1">{job.company}</h3>
              <Link
                to={`/${routes.JOB_DETAIL}/${job.id}`}
                className="text-xl font-semibold text-[#1a1f36] hover:text-blue-600 transition-colors line-clamp-1 block mb-2"
              >
                {job.title}
              </Link>
              {job.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{job.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium"
                >
                  <Briefcase className="w-3 h-3 mr-1" />
                  {job.type}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {job.posted}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg hover:bg-gray-100"
            >
              <Bookmark className="w-4 h-4 text-gray-500" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-lg font-bold text-blue-600">
                {job.salary}
                {job.period && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    /{job.period}
                  </span>
                )}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-10 font-medium rounded-lg shadow-sm"
            >
              <Link to={`/${routes.JOB_DETAIL}/${job.id}`}>
                {t("jobCard.applyNow")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
