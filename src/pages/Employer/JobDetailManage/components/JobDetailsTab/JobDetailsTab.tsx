import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import JobInformation from "@/components/JobInformation";
import { employer_routes } from "@/routes/routes.const";
import type { JobProp } from "@/components/JobInformation/JobInformation";

export default function JobDetailsTab(job: JobProp) {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const handleEditJob = () => {
    navigate(`${employer_routes.BASE}/${employer_routes.JOBS}/${jobId}/edit`);
  };

  return (
    <div className="py-6">
      <div className="px-6 mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Chi tiết công việc</h2>
        <Button onClick={handleEditJob} className="bg-[#1967d2] hover:bg-[#1251a3] gap-2">
          <Pencil className="w-4 h-4" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="px-6 mx-auto max-w-4xl">
        <JobInformation job={job} hideActionButtons={true} />
      </div>
    </div>
  );
}
