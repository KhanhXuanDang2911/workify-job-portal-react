import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign, Clock, Users } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  expireDate: string;
  savedDate: string;
  salary: string;
  posted: string;
  applications: string;
  description: string;
  requirements: string[];
  benefits: {
    offer: string[];
    rights: string[];
  };
  image: string;
  companyWebsite?: string;
}

interface JobSummarySheetProps {
  job: Job | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (jobId: number) => void;
}

export default function JobSummarySheet({ job, isOpen, onOpenChange, onDelete }: JobSummarySheetProps) {
  if (!job) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full px-4 sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img src={job.image || "/placeholder.svg"} alt="Office" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border-2 border-white shadow-md shrink-0">
                  <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-full h-full object-cover" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-gray-900">{job.title}</SheetTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Building2 className="w-4 h-4 text-[#1967d2]" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 text-[#1967d2]" />
                    <span>{job.location}</span>
                  </div>
                  {job.companyWebsite && (
                    <a 
                      href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#1967d2] hover:underline mt-1 inline-block"
                    >
                      {job.companyWebsite}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Salary</div>
                  <div className="text-sm font-semibold text-gray-900">{job.salary}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Posted</div>
                  <div className="text-sm font-semibold text-green-600">{job.posted}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Hết hạn</div>
                  <div className="text-sm font-semibold text-red-600">{job.expireDate || "Chưa cập nhật"}</div>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Job Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-[#1967d2]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mô tả công việc</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-10">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-gray-900">Trách nhiệm kỹ thuật</h4>
            <ul className="space-y-2 pl-10">
              {job.requirements.map((req, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-600 mt-1">●</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Phúc lợi</h3>
            </div>
            <div className="pl-10">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Quyền lợi</h4>
              <ul className="space-y-2">
                {[...job.benefits.offer, ...job.benefits.rights].filter(Boolean).map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-600 mt-1">●</span>
                    <span>{benefit}</span>
                  </li>
                ))}
                {[...job.benefits.offer, ...job.benefits.rights].filter(Boolean).length === 0 && (
                  <li className="text-sm text-gray-500">Chưa cập nhật phúc lợi</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-3">
          <Button className="flex-1 bg-[#1967d2] hover:bg-[#1557b0] text-white" onClick={() => onOpenChange(false)}>
            View Detail
          </Button>
          <Button variant="destructive" className="flex-1 bg-red-500 hover:bg-red-600" onClick={() => onDelete(job.id)}>
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
