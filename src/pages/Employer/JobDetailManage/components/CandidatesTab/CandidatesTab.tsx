import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TableView from "@/pages/Employer/JobDetailManage/components/TableView";
import PipelineView from "@/pages/Employer/JobDetailManage/components/PipelineView";

export default function CandidatesTab() {
  const [viewMode, setViewMode] = useState<"pipeline" | "table">("pipeline");

  return (
    <div className="py-6 bg-sky-50">
      <div className="flex items-center justify-between mx-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Total Candidates:</span>
          <Badge className="bg-teal-600 hover:bg-teal-700">22</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "pipeline" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("pipeline")}
            className={viewMode === "pipeline" ? "bg-[#1967d2] hover:bg-[#1557b0]" : "border-[#1967d2] text-[#1967d2] hover:text-[#1967d2] hover:bg-[#e3eefc]"}
          >
            Pipeline View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-[#1967d2] hover:bg-[#1557b0]" : "border-[#1967d2] text-[#1967d2] hover:bg-[#e3eefc] hover:text-[#1967d2]"}
          >
            Table View
          </Button>
        </div>
      </div>
      <div className="mx-4">{viewMode === "pipeline" ? <PipelineView /> : <TableView />}</div>
    </div>
  );
}
