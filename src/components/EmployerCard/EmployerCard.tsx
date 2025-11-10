import { MapPin, Briefcase, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "@/routes/routes.const";
import { CompanySizeLabelVN, type CompanySize } from "@/constants/company.constant";

type Employer = {
  id: number;
  name: string;
  logo: string;
  coverImage: string;
  openJobs: number;
  numberOfHiringJobs?: number;
  location: string;
  description: string;
  featured: boolean;
  companySize?: CompanySize | null;
  createdAt?: string | null;
};

export default function EmployerCard({ employer }: { employer: Employer }) {
  return (
    <Link
      to={`/${routes.EMPLOYER_DETAIL}/${employer.id}`}
      className="block group"
    >
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 border-gray-100 hover:border-[#1967d2]/40 overflow-visible relative ${
          employer.featured ? "ring-2 ring-[#1967d2]/20 shadow-[#1967d2]/10" : ""
        }`}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/30 group-hover:to-indigo-50/20 transition-all duration-300 rounded-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="relative">
            <div className="h-32 rounded-t-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={employer.coverImage || "/placeholder.svg"}
                alt={`${employer.name} office`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
            </div>
            <div className="absolute -bottom-12 left-6 w-24 h-24 bg-white rounded-2xl p-2.5 shadow-2xl border-4 border-white z-20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200">
                <img
                  src={employer.logo || "/placeholder.svg"}
                  alt={employer.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
          </div>

          <div className="p-6 pt-16 pb-6">
            <h3 className="font-bold text-gray-900 text-lg mb-3 tracking-tight line-clamp-2 group-hover:text-[#1967d2] transition-colors duration-300">
              {employer.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {employer.description}
            </p>

            {/* Additional Info */}
            <div className="space-y-2 mb-4">
              {/* Company Size */}
              {employer.companySize && CompanySizeLabelVN[employer.companySize] && (
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
                  <span className="line-clamp-1">{CompanySizeLabelVN[employer.companySize]}</span>
                </div>
              )}

              {/* Location */}
              {employer.location && (
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
                  <span className="line-clamp-1">{employer.location}</span>
                </div>
              )}

              {/* Founded Year (if createdAt exists) */}
              {employer.createdAt && (
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-gray-400" />
                  <span>Thành lập {new Date(employer.createdAt).getFullYear()}</span>
                </div>
              )}
            </div>

            {/* Bottom Section - Jobs */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 group-hover:border-[#1967d2]/20 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#1967d2] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Đang tuyển</span>
                  <span className="text-sm font-bold text-[#1967d2]">
                    {employer.numberOfHiringJobs ?? employer.openJobs ?? 0} vị trí
                  </span>
                </div>
              </div>
              {employer.openJobs > 0 && (
                <div className="text-[#1967d2] font-semibold text-xs bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 rounded-full whitespace-nowrap border border-blue-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                  {employer.openJobs} {employer.openJobs === 1 ? "job" : "jobs"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
