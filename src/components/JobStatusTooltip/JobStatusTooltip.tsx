import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  JobStatusColors,
  JobStatusLabelEN,
  JobStatus,
  type JobStatus as JobStatusType,
} from "@/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobStatusTooltipProps {
  status: JobStatusType;
  onChangeStatus: (newStatus: JobStatusType) => void;
}

export function JobStatusTooltip({
  status,
  onChangeStatus,
}: JobStatusTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <Badge
            variant="outline"
            className={cn(JobStatusColors[status], "cursor-pointer")}
          >
            {JobStatusLabelEN[status]}
          </Badge>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            className="bg-white text-white text-sm rounded-lg shadow-md p-2 min-w-[180px]"
          >
            <div className="flex flex-col space-y-2">
              {Object.entries(JobStatus).map(([key, value]) => (
                <div
                  className={cn(
                    "flex items-center p-1 justify-between hover:bg-teal-100 rounded-sm relative cursor-pointer",
                    value === status && "bg-teal-500 hover:bg-teal-500"
                  )}
                  key={value}
                  onClick={() => {
                    onChangeStatus(value);
                    setOpen(false);
                  }}
                >
                  <Badge
                    variant="outline"
                    key={value}
                    className={cn(JobStatusColors[value], "w-4/5")}
                  >
                    {JobStatusLabelEN[value]}
                  </Badge>
                  {value === status && <Check className="w-4 h-4 text-black" />}
                </div>
              ))}
            </div>
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
