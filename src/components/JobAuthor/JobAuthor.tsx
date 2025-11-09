import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Mail } from "lucide-react";

export interface JobAuthorProps {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  companyName: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  employerSlug: string;
}

export default function JobAuthor({ id, createdAt, updatedAt, email, companyName, avatarUrl, backgroundUrl, employerSlug }: JobAuthorProps) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <div className="relative h-32 w-full bg-gray-100">
        {backgroundUrl ? (
          <img src={backgroundUrl} alt="Company banner" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-blue-200 to-blue-400" />
        )}

        <div className="absolute -bottom-10 left-6">
          <div className="flex gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src={avatarUrl} alt={companyName} />
              <AvatarFallback>{companyName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xl font-semibold self-end text-gray-900">{companyName}</span>
          </div>
        </div>
      </div>

      <CardContent className="pt-4 px-6 pb-6">
        <div className="mt-4 space-y-1">
          <p className="text-sm flex gap-1 items-center">
            <Mail className="text-teal-500" size={14} /> <span className="text-gray-700 font-semibold">Email: </span>
            {email}
          </p>
          <p className="text-sm flex gap-1 items-center">
            <CalendarDays className="text-teal-500" size={14} /> <span className="font-semibold text-gray-700">Created at: </span>
            {new Date(createdAt).toLocaleDateString("vi-VN")}
          </p>
          <p className="text-sm flex gap-1 items-center">
            <CalendarDays className="text-teal-500" size={14} /> <span className="font-semibold text-gray-700">Updated at: </span>
            {new Date(updatedAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
