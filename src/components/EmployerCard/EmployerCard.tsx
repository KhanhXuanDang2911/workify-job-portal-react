import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "@/routes/routes.const";

type Employer = {
  id: number;
  name: string;
  logo: string;
  coverImage: string;
  openJobs: number;
  location: string;
  description: string;
  featured: boolean;
};

export default function EmployerCard({ employer }: { employer: Employer }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer z-10 ${
        employer.featured ? "ring-2 ring-[#1967d2]/20" : ""
      }`}
    >
      <div className="relative">
        <div className="h-34 rounded-t-2xl overflow-hidden">
          <img
            src={employer.coverImage || "/placeholder.svg"}
            alt={`${employer.name} office`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white rounded-full p-2 shadow-xl border-4 border-white z-10">
          <img
            src={employer.logo || "/placeholder.svg"}
            alt={employer.name}
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>

      <div className="p-6 pt-10 pb-6">
        <Link
          to={`/${routes.EMPLOYER_DETAIL}/${employer.id}`}
          className="font-semibold text-gray-900 text-base lg:text-lg mb-2 tracking-tight line-clamp-2 group-hover:text-[#1967d2] transition-colors duration-300 block no-underline"
        >
          {employer.name}
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">
          {employer.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {employer.location}
          </div>
          {/* <div className="text-[#1967d2] font-bold text-sm bg-[#e0eeff] px-3 py-1 rounded-full">
            {employer.openJobs} jobs
          </div> */}
        </div>
      </div>
    </div>
  );
}
