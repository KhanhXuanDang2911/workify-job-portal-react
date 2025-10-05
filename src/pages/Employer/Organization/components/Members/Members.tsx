import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, MoreHorizontal } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
  status: "Active" | "Inactive";
  lastLogin: string;
  isAdmin: boolean;
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const members: Member[] = [
    {
      id: "1",
      name: "Admin",
      email: "dungvan.170204@gmail.com",
      avatar: "https://i.pinimg.com/1200x/5a/22/d8/5a22d8574a6de748e79d81dc22463702.jpg",
      role: "Admin",
      permissions: ["All permissions"],
      status: "Active",
      lastLogin: "05/10/2025 01:22 PM",
      isAdmin: true,
    },
    {
      id: "2",
      name: "Văn Thị Kim Dung",
      email: "vanthikimdung17022004@gmail.com",
      role: "Member",
      permissions: ["Can create jobs", "Can publish assigned jobs", "Can edit assigned jobs"],
      status: "Active",
      lastLogin: "-",
      isAdmin: false,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Members List ({members.length})</h2>
        <Button className="bg-[#1967d2] hover:bg-[#1557b0]">
          <Plus className="h-4 w-4 mr-2" />
          Add new member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="focus:bg-sky-200 focus:text-[#1967d2]">
              All Roles
            </SelectItem>
            <SelectItem value="admin" className="focus:bg-sky-200 focus:text-[#1967d2]">
              Admin
            </SelectItem>
            <SelectItem value="member" className="focus:bg-sky-200 focus:text-[#1967d2]">
              Member
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="focus:bg-sky-200 focus:text-[#1967d2]">
              All Status
            </SelectItem>
            <SelectItem value="active" className="focus:bg-sky-200 focus:text-[#1967d2]">
              Active
            </SelectItem>
            <SelectItem value="inactive" className="focus:bg-sky-200 focus:text-[#1967d2]">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#85ace3] border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-white">Name</th>
              <th className="text-left py-3 px-4 font-medium text-white">Role</th>
              <th className="text-left py-3 px-4 font-medium text-white">Status</th>
              <th className="text-left py-3 px-4 font-medium text-white">Last Login</th>
              <th className="text-left py-3 px-4 font-medium text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {member.avatar ? (
                      <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-purple-600 font-medium">{member.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        {member.isAdmin && <Badge className="bg-[#1967d2] text-white text-xs">Admin</Badge>}
                      </div>
                      <span className="text-sm text-gray-500">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {member.permissions.map((permission, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={permission === "All permissions" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}
                      >
                        {permission}
                      </Badge>
                    ))}
                    {member.permissions.length > 3 && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        +4
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge className={member.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600"} variant="outline">
                    {member.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-gray-600">{member.lastLogin}</td>
                <td className="py-4 px-4">
                  {!member.isAdmin && (
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
