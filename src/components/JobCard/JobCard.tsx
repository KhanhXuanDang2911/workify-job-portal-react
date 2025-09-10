import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

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
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-2xl transition-all duration-500 group shadow-lg z-10">
      <div className="flex items-start space-x-6">
        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-md group-hover:shadow-lg">
          <img
            src={job.logo || "/placeholder.svg"}
            alt={job.company}
            className="w-16 h-16 object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 pr-2">
              {job.title}
            </h3>
            <Badge
              className={`${job.typeColor} text-white text-xs px-2 py-1 flex-shrink-0`}
            >
              {job.type}
            </Badge>
          </div>

          <p className="text-green-600 text-xs font-medium mb-2">
            / {job.posted}
          </p>
          <p className="text-gray-800 font-medium text-sm mb-3">
            {job.company}
          </p>

          <div className="flex items-center text-xs text-gray-600 mb-2">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>

          <p className="text-blue-600 text-xs hover:underline cursor-pointer mb-3">
            https://thewebmax.com
          </p>

          <div className="flex items-center justify-end space-x-4">
            <div className="text-right">
              <p className="text-base font-bold text-gray-900">
                {job.salary}{" "}
                <span className="text-xs font-normal text-gray-600">
                  / {job.period}
                </span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors bg-transparent text-xs px-3 py-1"
            >
              Browse Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
