import CategoryJobDetails from "@/pages/Admin/CategoryJobs/CategoryJobDetails";
import CategoryJobTable from "@/pages/Admin/CategoryJobs/CategoryJobTable";
import IndustriesTable from "@/pages/Admin/CategoryJobs/IndustriesTable";
import { categoryJobService, type CategoryJobResponse } from "@/services/categoryJobs.service";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

export default function CategoryJobs() {
  const [selectedCategoryJob, setSelectedCategoryJob] = useState<CategoryJobResponse | null>(null);

  const { data: categoryJobsData, isLoading: isLoadingCategoryJobs } = useQuery({
    queryKey: ["categoryJobs"],
    queryFn: async () =>  categoryJobService.getAllCategoryJobs(), 
  });

useEffect(() => {
  if (categoryJobsData && categoryJobsData.data.length > 0 && !selectedCategoryJob) {
    setSelectedCategoryJob(categoryJobsData.data[0]);
  }
}, [categoryJobsData, selectedCategoryJob]);
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/*  Category Job List */}
      <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
        <CategoryJobTable onSelectJob={setSelectedCategoryJob} selectedCategoryJob={selectedCategoryJob} />
      </div>

      {/* Details and Industries */}
      {selectedCategoryJob ? (
        <div className="w-1/2 overflow-y-auto">
          <CategoryJobDetails job={selectedCategoryJob} />
          <div className="border-t border-gray-200">
            <IndustriesTable categoryJobId={selectedCategoryJob.id} />
          </div>
        </div>
      ) : (
        <div className="w-1/2 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 text-lg">Select a category job to view details</p>
        </div>
      )}
    </div>
  );
}
