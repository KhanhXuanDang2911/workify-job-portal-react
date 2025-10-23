import { JobStatus } from "@/constants";
import { AlertCircle, CheckCircle, Clock, Edit, XCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case JobStatus.DRAFT:
      return <Edit className="w-4 h-4" />;
    case JobStatus.PENDING:
      return <Clock className="w-4 h-4" />;
    case JobStatus.APPROVED:
      return <CheckCircle className="w-4 h-4" />;
    case JobStatus.EXPIRED:
      return <XCircle className="w-4 h-4" />;
    case JobStatus.CLOSED:
      return <AlertCircle className="w-4 h-4" />;
    case JobStatus.REJECTED:
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case JobStatus.DRAFT:
      return "bg-gray-100 text-gray-800";
    case JobStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case JobStatus.APPROVED:
      return "bg-green-100 text-green-800";
    case JobStatus.EXPIRED:
      return "bg-red-100 text-red-800";
    case JobStatus.CLOSED:
      return "bg-gray-100 text-gray-600";
    case JobStatus.REJECTED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
