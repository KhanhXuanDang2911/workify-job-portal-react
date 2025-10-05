import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TalentSearchSidebar from "@/components/TalentSearchSidebar";
import Pagination from "@/components/Pagination";
import TalentSkeleton from "@/components/TalentSkeleton";
import Talent from "@/components/Talent";
import { initialRecentSearches, mockTalents } from "@/pages/Employer/SearchTalents/searchTalentMockData";
import type { TalentFilters } from "@/pages/Employer/SearchTalents/SearchTalents.type";
import LocationMultiSelect from "@/components/LocationMultiSelect";

const initialFilters: TalentFilters = {
  jobCategories: [],
  experienceLevel: [],
  careerLevel: [],
  positionType: [],
  educationLevel: { id: "", name: "", includeHigherDegrees: false },
  salary: { min: 1, max: 10, includeNoSalaryData: false },
  ageRange: [15, 70],
};

function SearchTalents() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLocationOptions, setSelectedLocationOptions] = useState<{ id: string; name: string }[]>([]);
  const [searchBy, setSearchBy] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [recentSearches, setRecentSearches] = useState<{ id: string; title: string; location?: string }[]>(initialRecentSearches);
  const [showRecent, setShowRecent] = useState(false);
  const inputKeywordRef = useRef<HTMLInputElement | null>(null);

  const [filters, setFilters] = useState<TalentFilters>(initialFilters);

  const handleFilterChange = (key: keyof TalentFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleSearch = () => {
    const title = searchKeyword.trim() || "(Chưa có tiêu đề)";
    const location = selectedLocationOptions[0]?.name;
    setRecentSearches((prev) => {
      const newItem = { id: String(Date.now()), title, location };
      const filtered = prev.filter((p) => !(p.title === title && p.location === location));
      return [newItem, ...filtered].slice(0, 10);
    });

    setIsLoading(true);
    setHasSearched(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRecent(false);
    }, 1000);
  };

 const handleSelectRecent = (item: { id: string; title: string; location?: string }) => {
   setSearchKeyword(item.title === "(Chưa có tiêu đề)" ? "" : item.title);
   
   if (item.location) {
     setSelectedLocationOptions([{ id: item.location, name: item.location }]);
   }
   setShowRecent(false);
 };

 const handleRemoveRecent = (id: string) => {
   setRecentSearches((prev) => prev.filter((p) => p.id !== id));
 };

 const handleClearRecents = () => {
   setRecentSearches([]);
 };

  const handleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const totalPages = Math.ceil(mockTalents.length / 10);

  return (
    <div className=" bg-sky-50 min-h-[calc(100vh-64px)] overflow-y-auto flex-1">
      {/* Header */}
      <div className="bg-white flex flex-col border-b py-3 px-5 border-gray-200 sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h1 className="text-3xl font-medium p-2 text-center text-[#1967d2]">Search Talents</h1>
      </div>

      {/* Search Bar */}
      <div className="space-y-1 px-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative self-start">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 " color="#1967d2" />
            <Input
              ref={inputKeywordRef}
              placeholder="Enter keywords"
              value={searchKeyword}
              onFocus={() => setShowRecent(true)}
              onBlur={() => setTimeout(() => setShowRecent(false), 150)}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 h-12 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] bg-white"
            />
            {/* Recent searches dropdown */}
            {showRecent && recentSearches.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white border rounded-md shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <div className="text-sm font-medium">Recent searches</div>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleClearRecents();
                    }}
                    className="text-sm text-blue-600"
                  >
                    Clear
                  </button>
                </div>

                <div className="max-h-64 overflow-auto">
                  {recentSearches.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-sky-50 cursor-pointer">
                      <div
                        className="flex items-start gap-3"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectRecent(item);
                        }}
                      >
                        <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <div className="truncate max-w-[360px]">{item.title}</div>
                          {item.location && <div className="text-xs text-gray-500">{item.location}</div>}
                        </div>
                      </div>

                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleRemoveRecent(item.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 px-2"
                        aria-label="remove recent"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <LocationMultiSelect selectedLocationOptions={selectedLocationOptions} setSelectedLocationOptions={setSelectedLocationOptions} placeholder="Cities, provinces" />
          </div>
          <Button onClick={handleSearch} className="bg-[#1967d2] w-28 hover:bg-[#1251a3] text-white px-8 h-12 font-medium">
            Search
          </Button>
        </div>

        {/* Search Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Search by:</span>
            <RadioGroup value={searchBy} onValueChange={setSearchBy} className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="text-sm cursor-pointer">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resume" id="resume" />
                <Label htmlFor="resume" className="text-sm cursor-pointer">
                  Resume title
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button variant="link" className="text-blue-600 text-sm">
            View all saved searches →
          </Button>
        </div>

        {/* Saved Search */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Saved search:</span>
          <Button variant="outline" size="sm" className="text-sm bg-white border-dashed border-1 rounded-2xl border-[#1967d2] text-[#1967d2] hover:bg-white hover:text-[#1967d2]">
            + Save this search
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-5 py-4">
        <div className="flex  bg-white relative ">
          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 mt-5 bg-white rounded-lg border self-start overflow-hidden">
            <TalentSearchSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
          </div>

          {/* Results Area */}
          <div className="flex-1 px-4 pb-5">
            {!hasSearched ? (
              // Empty State
              <div className="bg-white p-12 flex flex-col items-center justify-center min-h-[600px]">
                <div className="relative w-full max-w-md mb-8">
                  <img src="/search_resume_banner.png" alt="Search illustration" className="w-full h-auto" />
                </div>
                <p className="text-center text-gray-600 max-w-2xl leading-relaxed">
                  Explore thousands of high-quality resumes with our smart search tool. Start now by entering keywords in the search bar or use detailed filters to find the most
                  suitable candidates.
                </p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="bg-white rounded-sm border mt-5 p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">Result search: </span>
                      <span className="font-semibold text-green-600">45,351 resumes</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">Sort</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="latest" className="focus:bg-sky-200 focus:text-[#1967d2]">
                              Latest Resumes
                            </SelectItem>
                            <SelectItem value="relevant" className="focus:bg-sky-200 focus:text-[#1967d2]">
                              Most Relevant
                            </SelectItem>
                            <SelectItem value="experience" className="focus:bg-sky-200 focus:text-[#1967d2]">
                              Most Experience
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-1 border border-gray-200 rounded-md">
                        <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="h-8 w-8 p-0">
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="h-8 w-8 p-0">
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Grid/List */}
                {isLoading ? (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-4"}>
                    {[...Array(6)].map((_, index) => (
                      <TalentSkeleton key={index} />
                    ))}
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-4"}>
                    {mockTalents.map((talent) => (
                      <Talent key={talent.id} talent={talent} onBookmark={handleBookmark} isBookmarked={bookmarkedIds.has(talent.id)} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!isLoading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchTalents;
