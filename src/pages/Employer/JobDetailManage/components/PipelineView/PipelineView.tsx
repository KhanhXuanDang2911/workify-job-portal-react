import  React from "react";
import { useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import CandidateSheet from "@/components/CandidateSheet";

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  daysAgo: number;
}

interface PipelineColumn {
  id: string;
  title: string;
  count: number;
  color: string;
  candidates: Candidate[];
}

const mockPipelineData: PipelineColumn[] = [
  {
    id: "new-applied",
    title: "New Applied",
    count: 10,
    color: "bg-green-500",
    candidates: [
      { id: "1", name: "Dang Xuan Khanh", avatar: "https://i.pinimg.com/474x/b2/29/88/b22988e5632084708dad509ef5f2cbab.jpg", rating: 0, daysAgo: 2 },
      { id: "2", name: "Minh Quan", avatar: "https://i.pinimg.com/474x/d0/fc/21/d0fc210ecedb6f077b3d153abf9153ca.jpg", rating: 0, daysAgo: 2 },
      { id: "3", name: "Hoang Vo", avatar: "https://i.pinimg.com/474x/7a/88/2a/7a882a615818c7b13e100cf50c6e786e.jpg", rating: 0, daysAgo: 2 },
      { id: "4", name: "Xuan Son", avatar: "https://i.pinimg.com/474x/80/27/c6/8027c6c615900bf009b322294b61fcb2.jpg", rating: 0, daysAgo: 2 },
      { id: "5", name: "Courtney Henry", avatar: "https://i.pinimg.com/474x/31/00/2d/31002d69c7163ead9e5d2bac1c539ba5.jpg", rating: 0, daysAgo: 2 },
    ],
  },
  {
    id: "screening",
    title: "Screening",
    count: 5,
    color: "bg-teal-600",
    candidates: [
      { id: "6", name: "Shawn Mendes", avatar: "https://i.pinimg.com/474x/d9/bb/b2/d9bbb25c8b3719eacfb9a755a71abba8.jpg", rating: 0, daysAgo: 2 },
      { id: "7", name: "SsQuyt M", avatar: "https://i.pinimg.com/474x/c0/61/42/c0614219f1b2c7baec98108a1a25b3d7.jpg", rating: 4, daysAgo: 2 },
      { id: "8", name: "Cody Fisher", avatar: "https://i.pinimg.com/474x/38/4d/7f/384d7fd740af3c34f3911b3930758599.jpg", rating: 3, daysAgo: 2 },
      { id: "9", name: "Minh Thao", avatar: "https://i.pinimg.com/474x/8f/85/4e/8f854e4b78ecc4c356b0ae6f940e796d.jpg", rating: 1, daysAgo: 2 },
      { id: "10", name: "Van Tung", avatar: "https://i.pinimg.com/474x/a5/2c/f6/a52cf6bf7984b780bfa1001fa969c219.jpg", rating: 2, daysAgo: 2 },
    ],
  },
  {
    id: "design-challenge",
    title: "Design challenge",
    count: 3,
    color: "bg-orange-500",
    candidates: [
      { id: "11", name: "Dung Van", avatar: "https://i.pinimg.com/474x/38/4d/7f/384d7fd740af3c34f3911b3930758599.jpg", rating: 3, daysAgo: 2 },
      { id: "12", name: "Ly Thanh", avatar: "https://i.pinimg.com/474x/61/db/db/61dbdbaaa53f963059965b95517401d1.jpg", rating: 2, daysAgo: 2 },
      { id: "13", name: "Tran Vu Lam", avatar: "https://i.pinimg.com/474x/1f/04/09/1f0409fc110a40918a1882b6b7282a13.jpg", rating: 4, daysAgo: 2 },
    ],
  },
  {
    id: "interview",
    title: "Interview",
    count: 2,
    color: "bg-purple-500",
    candidates: [
      { id: "14", name: "Yen Khuong", avatar: "https://i.pinimg.com/1200x/24/fe/82/24fe82a7d12c93980bf4084d16d00aad.jpg", rating: 4, daysAgo: 2 },
      { id: "15", name: "My Le", avatar: "https://i.pinimg.com/474x/9b/91/b1/9b91b10ae19281c952437cbc7aeae101.jpg", rating: 0, daysAgo: 2 },
    ],
  },
  {
    id: "tests",
    title: "Tests",
    count: 1,
    color: "bg-cyan-500",
    candidates: [{ id: "16", name: "Ton Nu Anh Dao", avatar: "https://i.pinimg.com/474x/7d/50/28/7d50288c8df7c5a49e284b2283a930b3.jpg", rating: 4, daysAgo: 2 }],
  },
  {
    id: "hired",
    title: "Hired",
    count: 1,
    color: "bg-yellow-500",
    candidates: [{ id: "17", name: "Van Thinh", avatar: "https://i.pinimg.com/474x/38/4d/7f/384d7fd740af3c34f3911b3930758599.jpg", rating: 5, daysAgo: 2 }],
  },
];

export default function PipelineView() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={scrollContainerRef}
      className={cn("overflow-x-auto pb-4", isDragging ? "cursor-grabbing" : "cursor-grab")}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-4 min-w-max">
        {mockPipelineData.map((column) => (
          <div key={column.id} className="w-[280px] flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className={cn("h-1.5", column.color)} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{column.title}</h3>
                  <span className="text-sm text-gray-500 bg-gray-300 rounded-sm min-w-7 text-center p-1">{column.count}</span>
                </div>
                <div className="space-y-3">
                  {column.candidates.map((candidate) => (
                    <CandidateSheet key={candidate.id} candidate={candidate}>
                      <div key={candidate.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} className="w-10 h-10 rounded-full object-cover" />
                          <span className="text-sm font-medium text-gray-900 flex-1">{candidate.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn("h-3.5 w-3.5", i < candidate.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{candidate.daysAgo} days ago</span>
                        </div>
                      </div>
                    </CandidateSheet>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
