import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, MoreHorizontal, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import CandidateSheet from "@/components/CandidateSheet";

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  email: string;
  rating: number;
  stage: string;
  stageProgress: number[];
  appliedDate: string;
  owner: {
    name: string;
    avatar: string;
  } | null;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Nguyen Xuan Son",
    avatar: "",
    email: "darlene@example.com",
    rating: 0,
    stage: "Screening",
    stageProgress: [1, 1, 0, 0, 0, 0],
    appliedDate: "01 March, 2021",
    owner: { name: "Bao Tuan", avatar: "" },
  },
  {
    id: "2",
    name: "Minh Quan",
    avatar: "",
    email: "cody@example.com",
    rating: 4.5,
    stage: "Interview",
    stageProgress: [1, 1, 1, 1, 0, 0],
    appliedDate: "15 March, 2021",
    owner: { name: "Albert Flores", avatar: "" },
  },
  {
    id: "3",
    name: "Hoang Vo",
    avatar: "",
    email: "jenny@example.com",
    rating: 5.0,
    stage: "Test",
    stageProgress: [1, 1, 1, 1, 1, 0],
    appliedDate: "20 March, 2021",
    owner: { name: "Annette Black", avatar: "" },
  },
  {
    id: "4",
    name: "Dang Xuan Khanh",
    avatar: "https://i.pinimg.com/474x/8f/85/4e/8f854e4b78ecc4c356b0ae6f940e796d.jpg",
    email: "ahmad@example.com",
    rating: 0,
    stage: "New Applied",
    stageProgress: [1, 0, 0, 0, 0, 0],
    appliedDate: "28 February, 2021",
    owner: null,
  },
  {
    id: "5",
    name: "Tran Van Tung",
    avatar: "https://i.pinimg.com/474x/6f/12/07/6f120710820e1b04e88a0255baa18f7f.jpg",
    email: "brooklyn@example.com",
    rating: 0,
    stage: "New Applied",
    stageProgress: [1, 0, 0, 0, 0, 0],
    appliedDate: "30 February, 2021",
    owner: null,
  },
  {
    id: "6",
    name: "Dung Van",
    avatar: "https://i.pinimg.com/474x/37/ac/bc/37acbc2aa095fe2ef333828fc24dfb17.jpg",
    email: "bessie@example.com",
    rating: 3.0,
    stage: "Design Challenge",
    stageProgress: [1, 1, 1, 0, 0, 0],
    appliedDate: "28 August, 2021",
    owner: { name: "Dianne Russell", avatar: "https://i.pinimg.com/474x/6f/12/07/6f120710820e1b04e88a0255baa18f7f.jpg" },
  },
  {
    id: "7",
    name: "Ly Thanh",
    avatar: "",
    email: "marvin@example.com",
    rating: 2.0,
    stage: "Screening",
    stageProgress: [1, 1, 0, 0, 0, 0],
    appliedDate: "30 August, 2021",
    owner: { name: "Jerome Bell", avatar: "" },
  },
];

const stageColors: Record<string, string> = {
  "New Applied": "bg-green-500",
  Screening: "bg-teal-600",
  "Design Challenge": "bg-orange-500",
  Interview: "bg-purple-500",
  Test: "bg-cyan-500",
  Hired: "bg-yellow-500",
};

export default function TableView() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  const totalPages = Math.max(1, Math.ceil(mockCandidates.length / pageSize));

  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return mockCandidates.slice(start, start + pageSize);
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [pageSize, totalPages, currentPage]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search members" className="pl-9 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2]" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Role
              </SelectItem>
              <SelectItem value="admin" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Admin
              </SelectItem>
              <SelectItem value="member" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Member
              </SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="focus:bg-sky-200 focus:text-[#1967d2]">
                Status
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
      </div>

      <Table className="">
        <TableHeader className="">
          <TableRow className="bg-[#1967d2] hover:bg-[#1967d2] ">
            <TableHead className="w-[300px] ">
              <div className="flex items-center gap-2 py-4 text-white">
                Candidate Name
                <ChevronDown className="h-4 w-4 " />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Rating
                <ChevronDown className="h-4 w-4 " />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Stages
                <ChevronDown className="h-4 w-4 " />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Applied date
                <ChevronDown className="h-4 w-4 " />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2 text-white">
                Owner
                <ChevronDown className="h-4 w-4 " />
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCandidates.map((candidate) => (
            <CandidateSheet candidate={candidate} key={candidate.id}>
              <TableRow key={candidate.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {candidate.avatar ? (
                      <img src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-purple-600 font-medium">{candidate.name.charAt(0)}</span>
                      </div>
                    )}

                    <span className="text-sm text-gray-900">{candidate.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-4 w-4", i < Math.floor(candidate.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{candidate.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{candidate.stage}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-1">
                      {candidate.stageProgress.map((status, i) => (
                        <div key={i} className={cn("h-1.5 w-6 rounded-full", status === 1 ? stageColors[candidate.stage] || "bg-gray-300" : "bg-gray-200")} />
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{candidate.appliedDate}</span>
                </TableCell>
                <TableCell>
                  {candidate.owner ? (
                    <div className="flex items-center gap-2">
                      {candidate.owner.avatar ? (
                        <img src={candidate.owner.avatar || "/placeholder.svg"} alt={candidate.owner.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                          <span className="text-purple-600 font-medium">{candidate.owner.name.charAt(0)}</span>
                        </div>
                      )}

                      <span className="text-sm text-gray-900">{candidate.owner.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Add Tags</DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Add Owner</DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Email Candidate</DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2]">Edit Candidate</DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-sky-200 focus:text-[#1967d2] text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </CandidateSheet>
          ))}
        </TableBody>
      </Table>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View</span>
          <Select defaultValue="6">
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6" className="focus:bg-sky-200 focus:text-[#1967d2]">
                6
              </SelectItem>
              <SelectItem value="12" className="focus:bg-sky-200 focus:text-[#1967d2]">
                12
              </SelectItem>
              <SelectItem value="24" className="focus:bg-sky-200 focus:text-[#1967d2]">
                24
              </SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Candidates per page</span>
        </div>
        <div className="flex items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => {
              if (p < 1) return;
              if (p > totalPages) return;
              setCurrentPage(p);
            }}
          />
        </div>
      </div>
    </div>
  );
}
