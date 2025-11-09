import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MoreVertical, Edit, Trash2, Eye, XIcon } from "lucide-react";
import { admin_routes } from "@/routes/routes.const";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { CompanySize, CompanySizeLabelEN, CompanySizeLabelVN, RowsPerPageOptions, UserStatusColors, UserStatusLabelEN, type RowsPerPage } from "@/constants";
import Pagination from "@/components/Pagination";
import MultiSortButton from "@/components/MultiSortButton";
import { employerService, industryService, provinceService } from "@/services";
import CreateEmployerModal from "@/pages/Admin/EmployerManagement/CreateEmployerModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameInitials } from "@/utils";

type SortField = "companyName" | "status" | "companySize" | "email" | "district.name" | "province.name" | "createdAt" | "updatedAt";
type SortDirection = "asc" | "desc";

export default function EmployerManagement() {
  const navigate = useNavigate();

  const location = useLocation();

  const queryClient = useQueryClient();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sorts, setSorts] = useState<{ field: SortField; direction: SortDirection }[]>([]);
  const [provinceId, setProvinceId] = useState<number | undefined>(undefined);
  // const [companySize, setCompanySize] = useState<CompanySize | undefined>(undefined);

  const [searchProvince, setSearchProvince] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [provincesOptions, setProvincesOptions] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (location.state?.refresh) {
      ClearFilters();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");

  const { data: employersData, isLoading: isLoadingEmployers } = useQuery({
    queryKey: ["employers", pageNumber, pageSize, keyword, sortsString,provinceId],
    queryFn: () =>
      employerService.getEmployersWithSearchParam({
        pageNumber,
        pageSize,
        keyword: keyword || undefined,
        sorts: sortsString || undefined,
        provinceId
      }),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: employerService.deleteEmployer,
    onSuccess: () => {
      toast.success("Employer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employers", pageNumber, pageSize, keyword, sortsString] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => {
      toast.error("An error occurred while deleting the employer");
    },
  });

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await provinceService.getProvinces();
      return res.data;
    },
    select: (data) => data?.map((province: { id: number; name: string }) => ({ id: province.id, name: province.name })),
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (provinces && provinces.length > 0) {
      setProvincesOptions(provinces);
    }
  }, [provinces]);

  const handleSortChange = useCallback((field: SortField, newDirection: SortDirection | null) => {
    setSorts((prev) => {
      if (newDirection === null) {
        return prev.filter((s) => s.field !== field);
      }
      const existing = prev.find((s) => s.field === field);
      if (existing) {
        return prev.map((s) => (s.field === field ? { ...s, direction: newDirection } : s));
      }
      return [...prev, { field, direction: newDirection }];
    });

    setPageNumber(1);
  }, []);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPageNumber(1);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const employers = employersData?.data.items || [];
  const totalPages = employersData?.data.totalPages || 0;
  const totalEmployers = employersData?.data.numberOfElements || 0;

  const ClearFilters = () => {
    setKeyword("");
    setSearchInput("");
    setPageNumber(1);
    setPageSize(10);
    setProvinceId(undefined);
    // setCompanySize(undefined);
    setSorts([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(employersData?.data.items.map((item) => item.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleView = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.EMPLOYERS}/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.EMPLOYERS}/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Employer Management</h1>
        <p className="text-muted-foreground mt-1">Manage all employers in the system</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by title, content, or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary" className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all">
              Search
            </Button>

            <Select value={provinceId ? String(provinceId) : ""} onValueChange={(value) => setProvinceId(Number(value) || undefined)}>
              <SelectTrigger className="!text-gray-500 w-64">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" color="#1967d2" />
                    <Input
                      placeholder="Search"
                      className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#1967d2] pr-10"
                      value={searchProvince}
                      onChange={(event) => {
                        setSearchProvince(event.target.value);
                        if (event.target.value === "") {
                          setProvincesOptions(provinces || []);
                          return;
                        }
                        const filtered = provinces?.filter((option) => option.name.toLowerCase().includes(event.target.value.toLowerCase()));
                        setProvincesOptions(filtered || []);
                      }}
                    />
                    {searchProvince && (
                      <XIcon
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        color="#1967d2"
                        onClick={() => {
                          setSearchProvince("");
                          setProvincesOptions(provinces || []);
                        }}
                      />
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {provincesOptions.length > 0 ? (
                      provincesOptions.map((province) => (
                        <SelectItem key={province.id} value={String(province.id)} className="focus:bg-sky-200 focus:text-[#1967d2]">
                          {province.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No province found.</div>
                    )}
                  </div>
                </div>
              </SelectContent>
            </Select>

            {/* <Select value={companySize ?? ""} onValueChange={(value) => setCompanySize(value as CompanySize | undefined)}>
              <SelectTrigger className="w-64 !text-gray-500">
                <SelectValue placeholder="Company size" />
              </SelectTrigger>
              <SelectContent className="w-64 p-0">
                <div className="p-4">
                  <div className="max-h-64 overflow-y-auto">
                    {Object.entries(CompanySize).map(([key, value]) => (
                      <SelectItem key={key} value={value} className="focus:bg-sky-200 focus:text-[#1967d2]">
                        {CompanySizeLabelVN[key as CompanySize]}
                      </SelectItem>
                    ))}
                  </div>
                </div>
              </SelectContent>
            </Select> */}
          </div>
          <CreateEmployerModal />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
            size="sm"
            onClick={ClearFilters}
          >
            Clear filters
          </Button>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedIds.length} selected</Badge>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-600/10">
                Delete selected
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-card rounded-lg border shadow-sm overflow-x-auto [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-teal-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-teal-500"
      >
        <table className="w-full border-collapse text-sm table-fixed min-w-screen">
          {/* Table Header */}
          <thead>
            <tr className="bg-muted/40 text-left text-gray-700 dark:text-gray-300 border-b">
              <th className="px-4 py-3 w-[20px]">
                <Checkbox checked={selectedIds.length === employers.length && employers.length > 0} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[170px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Name</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "companyName")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("companyName", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[80px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Status</span>
                  <MultiSortButton direction={sorts.find((s) => s.field === "status")?.direction ?? null} onChange={(newDirection) => handleSortChange("status", newDirection)} />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[90px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Size</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "companySize")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("companySize", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[160px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Email</span>
                  <MultiSortButton direction={sorts.find((s) => s.field === "email")?.direction ?? null} onChange={(newDirection) => handleSortChange("email", newDirection)} />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[100px]">
                <div className="flex items-center justify-start gap-2">
                  <span>District</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "district.name")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("district.name", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[100px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Province</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "province.name")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("province.name", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[90px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Created At</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "createdAt")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("createdAt", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[90px]">
                <div className="flex items-center justify-start gap-2">
                  <span>Updated At</span>
                  <MultiSortButton
                    direction={sorts.find((s) => s.field === "updatedAt")?.direction ?? null}
                    onChange={(newDirection) => handleSortChange("updatedAt", newDirection)}
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-12 text-right"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoadingEmployers ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground italic">
                  Loading...
                </td>
              </tr>
            ) : employers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground">
                  <img src="/empty-folder.png" alt="Empty" className="mx-auto w-20 opacity-70" />
                  <p className="mt-2 text-sm text-gray-500">No employers found</p>
                </td>
              </tr>
            ) : (
              employers.map((employer) => (
                <tr key={employer.id} className="hover:bg-muted/30 border-b last:border-none transition-colors">
                  <td className="px-4 py-3 w-[20px]">
                    <Checkbox checked={selectedIds.includes(employer.id)} onCheckedChange={(checked) => handleSelectOne(employer.id, checked as boolean)} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 w-[170px] truncate">
                    <div className="w-full flex items-center gap-1.5">
                      {/* Avatar */}
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={employer.avatarUrl || ""} alt={employer.companyName || "user"} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">{getNameInitials(employer?.companyName)}</AvatarFallback>
                      </Avatar>
                      <p>{employer.companyName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 w-[80px]">
                    <Badge variant="outline" className={UserStatusColors[employer.status]}>
                      {UserStatusLabelEN[employer.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 w-[90px]">{CompanySizeLabelEN[employer.companySize]}</td>
                  <td className="px-4 py-3 w-[160px] truncate">{employer.email}</td>
                  <td className="px-4 py-3 w-[100px]">{employer.district?.name}</td>
                  <td className="px-4 py-3 w-[100px]">{employer.province?.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[90px]">{new Date(employer.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[90px]">{new Date(employer.updatedAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleView(employer.id)}>
                          <Eye className="w-4 h-4 mr-2 text-blue-500" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(employer.id)}>
                          <Edit className="w-4 h-4 mr-2 text-green-500" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(employer.id)} className="text-red-600 focus:text-red-700">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalEmployers > 0 && (
          <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
            {(() => {
              const minOption = Math.min(...RowsPerPageOptions.map((opt) => Number(opt.value)));
              if (totalEmployers < minOption) return null;

              return (
                <div className="flex self-start items-center space-x-2 text-sm text-gray-600">
                  <span>Shows:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      setPageSize(Number(value) as RowsPerPage);
                      setPageNumber(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RowsPerPageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>Rows</span>
                </div>
              );
            })()}

            <div className="w-full sm:w-auto flex justify-center">
              <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete confirmation</AlertDialogTitle>
            <AlertDialogDescription> Are you sure you want to delete this employer? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
