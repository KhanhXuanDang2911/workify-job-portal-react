import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Search } from "lucide-react";
import { candidates } from "./candidatesMockData";
import { useContext, useState } from "react";
import Pagination from "@/components/Pagination";
import { ResponsiveContext } from "@/context/ResponsiveContext";
import MenuSheet from "@/components/MenuSheet";

type CandidateStatus = "Interview" | "Shortlisted" | "Declined" | "Hired" | "Interviewed";

const statusOutlineColor: Record<CandidateStatus, string> = {
  Interview: "border-[#ffb836] text-[#ffb836]",
  Shortlisted: "border-[#4640de] text-[#4640de]",
  Declined: "border-[#ff6550] text-[#ff6550]",
  Hired: "border-[#449b82] text-[#449b82]",
  Interviewed: "border-[#26a4ff] text-[#26a4ff]",
};

function Candidates() {
  const { device } = useContext(ResponsiveContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const totalPages = Math.ceil(candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  console.log(device);

  return (
    <>
      {/* Main Content */}
      {device !== "desktop" && <MenuSheet isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />}
      <main className="flex-1 p-6 ">
        {/* Content Header */}
        <div className={`flex items-center ${device !== "desktop" ? "flex-col items-stretch gap-5" : ""} justify-between mb-6`}>
          <h2 className="text-2xl font-semibold text-[#084abc]">Received Applications: 19</h2>

          <div className={`flex items-center gap-4 ${device === "mobile" ? "flex-col items-stretch gap-5" : ""} `}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7c8493]" size={20} />
              <Input placeholder="Tìm kiếm ứng viên" className={`pl-10 ${device === "mobile" ? "w-full" : "w-72"} bg-white border-[#e2e7f5]`} />
            </div>

            <Button className="bg-[#4640de] hover:bg-[#4640de]/90 text-white">Xuất danh sách CV</Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#e2e7f5] overflow-hidden">
          {/* Responsive Table Header */}
          <div className="overflow-x-auto">
            {/* Desktop Table Header */}
            {device === "desktop" && (
              <div
                className="hidden md:grid gap-4 p-4 bg-[#f8f8fd] border-b border-[#e2e7f5] text-sm font-medium text-[#7c8493] min-w-[900px]"
                style={{ gridTemplateColumns: "60px 1fr 140px 140px 140px 120px 40px" }}
              >
                <div className="text-center">STT</div>
                <div className="flex items-center gap-2">
                  <span>Full Name</span>
                </div>
                <div>Trạng thái</div>
                <div>Ngày ứng tuyển</div>
                <div>Vị trí</div>
                <div>Thao tác</div>
                <div></div>
              </div>
            )}
          </div>

          {candidates.length === 0 ? (
            <>
              <div className="flex flex-col items-center justify-center py-16">
                <img src="/empty-folder.png" alt="No candidates" className="w-48 h-48 mb-4" />
                <p className="text-[#7c8493] text-lg">Hiện chưa có ứng viên nào</p>
              </div>
            </>
          ) : (
            <>
              {/* Candidate Rows */}
              {candidates.map((candidate, index) => (
                <div key={candidate.id}>
                  {device === "desktop" ? (
                    <>
                      {/* Desktop Row */}
                      <div
                        className="hidden md:grid gap-4 p-4 border-b border-[#e2e7f5] hover:bg-[#f8f8fd]/50 min-w-[900px]"
                        style={{ gridTemplateColumns: "60px 1fr 140px 140px 140px 120px 40px" }}
                      >
                        <div className="text-center text-[#7c8493] font-medium">{startIndex + index + 1}</div>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-[#202430] truncate">{candidate.name}</span>
                        </div>

                        <div>
                          <Badge
                            className={`${statusOutlineColor[candidate.status as keyof typeof statusOutlineColor]} px-3 py-1 rounded-full text-xs font-medium`}
                            variant="outline"
                          >
                            {candidate.status}
                          </Badge>
                        </div>

                        <div className="text-[#7c8493]">{candidate.date}</div>

                        <div className="text-[#202430] font-medium">{candidate.position}</div>

                        <div>
                          <Button variant="outline" className="text-[#4640de] border-[#4640de] hover:bg-[#4640de]/10 bg-transparent text-sm">
                            Xem hồ sơ
                          </Button>
                        </div>

                        <div className="flex justify-center">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Mobile/Tablet Card Layout */}
                      <div className=" p-4 border-b border-[#e2e7f5] hover:bg-[#f8f8fd]/50">
                        <div className="flex items-start gap-3">
                          <div className="text-sm text-[#7c8493] font-medium mt-1 min-w-[24px]">{startIndex + index + 1}.</div>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={candidate.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-[#202430] truncate">{candidate.name}</h3>
                                <p className="text-sm text-[#7c8493] mt-1">{candidate.position}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-2">
                                <MoreHorizontal size={16} />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                className={`${statusOutlineColor[candidate.status as keyof typeof statusOutlineColor]} px-2 py-1 rounded-full text-xs font-medium`}
                                variant="outline"
                              >
                                {candidate.status}
                              </Badge>
                              <span className="text-xs text-[#7c8493]">{candidate.date}</span>
                            </div>
                            <div className="mt-3">
                              <Button variant="outline" size="sm" className="text-[#4640de] border-[#4640de] hover:bg-[#4640de]/10 bg-transparent w-full">
                                Xem hồ sơ
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {candidates.length > 0 && (
          <>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-[#7c8493]">
                <span>Hiển thị</span>
                <select
                  className="border border-[#e2e7f5] rounded px-2 py-1 bg-white"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>15</option>
                  <option value={50}>30</option>
                </select>
                <span>Ứng viên mỗi trang</span>
              </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </main>
    </>
  );
}

export default Candidates;
