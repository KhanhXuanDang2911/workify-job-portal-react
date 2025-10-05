import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, DollarSign, FileText, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TalentType {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  location: string;
  salary: string;
  experience: string;
  employer: string;
  age: number;
  resumeType: "Attachment" | "Standard";
  postedDays: number;
  isVerified?: boolean;
}

interface TalentProps {
  talent: TalentType;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export default function Talent({ talent, onBookmark, isBookmarked = false }: TalentProps) {
  return (
    <Card className="p-4 flex-1 gap-0 shadow-none !block  border bg-white items-stretch justify-stretch">
      <div className="flex gap-4 self-stretch h-full">
        {/* Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarImage src={talent.avatar || "/placeholder.svg"} alt={talent.name} />
          <AvatarFallback className="bg-gray-200 text-gray-600">{talent.name.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0 flex justify-between flex-col">
          {/* Title and Bookmark */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0 ">
              <h3 className="text-base font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-2">
                {talent.title}
                {talent.isVerified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onBookmark?.(talent.id)} className="flex-shrink-0 h-8 w-8 p-0">
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600 text-blue-600" : "text-gray-400"}`} />
            </Button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{talent.location}</span>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-1 text-sm text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{talent.salary}</span>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span>{talent.experience}</span>
          </div>

          {/* Employer */}
          <div className="text-sm text-gray-600 mb-3">
            <span className="text-gray-500">Most recent employer: </span>
            <span className="font-medium text-gray-700">{talent.employer}</span>
            <span className="text-gray-500 ml-2">Age: {talent.age}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm border-t pt-3">
            <div className="flex items-center gap-1 text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Resume type: </span>
              <Badge variant="outline" className="text-xs">
                {talent.resumeType}
              </Badge>
            </div>
            <span className="text-green-600 font-medium">{talent.postedDays} days</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
