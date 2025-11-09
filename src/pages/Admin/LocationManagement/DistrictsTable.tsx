import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import Pagination from "@/components/Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import type { District } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { districtService } from "@/services";
import { toast } from "react-toastify";
import type { With } from "@/types/common";
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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import DistrictSheet from "@/pages/Admin/LocationManagement/DistrictSheet";
import CreateDistrictModal from "@/pages/Admin/LocationManagement/CreateDistrictModal";

export default function DistrictsTable({ provinceId }: { provinceId: number }) {
  const [searchInput, setSearchInput] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState<With<District, { provinceId: number }> | null>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [deleteDistrictId, setDeleteDistrictId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { data: districtsData, isLoading } = useQuery({
    queryKey: ["districts", provinceId ],
    queryFn: async () => {
      const res = await districtService.getDistrictsByProvinceId(provinceId);
      return res.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

    useEffect(() => {
      if (districtsData) {
        setFilteredDistricts(districtsData);
      }
    }, [districtsData]);
  
    useEffect(() => {
      setFilteredDistricts(() => {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return districtsData?.slice(startIndex, endIndex) || [];
      });
    }, [pageNumber, pageSize, districtsData]);
  
   const totalDistricts = districtsData ? districtsData.length : 0;
   const totalPages = Math.ceil(totalDistricts / pageSize);
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => districtService.deleteDistrict(id),
    onSuccess: () => {
      toast.success("Delete successful");
      setDeleteDistrictId(null);
      queryClient.invalidateQueries({ queryKey: ["districts", provinceId] });
    },
    onError: () => {
      toast.error("Delete failed");
    },
  });

  const ClearFilters = () => {
    setSearchInput("");
    setPageNumber(1);
    setFilteredDistricts(districtsData || []);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredDistricts?.map((item) => item.id) || []);
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

  const handleSearch = () => {
    setPageNumber(1);
    if (searchInput.trim() === "") {
      setFilteredDistricts(districtsData || []);
      console.log("No action");
      return;
    }
    const keyword = searchInput.toLowerCase();
    const filtered = districtsData?.filter(
      (district) =>
        district.name.toLowerCase().includes(keyword) ||
        district.code.toLowerCase().includes(keyword) 
    );
    console.log(filtered);
    setFilteredDistricts(filtered||[]);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleEdit = (district: With<District, { provinceId: number }>) => {
    setSelectedDistrict(district);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 px-8 py-2 bg-teal-500 text-white w-fit"
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)" }}
        >
          <span className="font-semibold">Districts</span>
        </div>

        <div className="">
          <CreateDistrictModal provinceId={provinceId} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Search by name or eng name, created at, updated at..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 focus-visible:border-none bg-white focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-900" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <Button
          variant="outline"
          className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
          size="sm"
          onClick={ClearFilters}
        >
          Clear filters
        </Button>
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="secondary">{selectedIds.length} selected</Badge>
          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-600/10">
            Delete selected
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm border-gray-200 ">
              <th className="px-4 py-3 text-left">
                <Checkbox checked={selectedIds.length === filteredDistricts.length && filteredDistricts.length > 0} onCheckedChange={handleSelectAll} />
              </th>
              <th className="px-4 py-3 text-left">
                <span>Name</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span>Code</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span>Created At</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span>Updated At</span>
              </th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground italic">
                  Loading...
                </td>
              </tr>
            ) : filteredDistricts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  <img src="/empty-folder.png" alt="Empty" className="mx-auto w-20 opacity-70" />
                  <p className="mt-2 text-sm text-gray-500">No districts found</p>
                </td>
              </tr>
            ) : (
              filteredDistricts.map((district) => (
                <tr
                  key={district.id}
                  className={cn("border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer", selectedDistrict?.id === district.id && "bg-green-200")}
                  onClick={() => handleEdit({ ...district, provinceId })}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      onClick={(e) => e.stopPropagation()}
                      checked={selectedIds.includes(district.id)}
                      onCheckedChange={(checked) => handleSelectOne(district.id, checked as boolean)}
                    />
                  </td>
                  <td className="px-4 py-3">{district.name}</td>
                  <td className="px-4 py-3">{district.code}</td>
                  <td className="px-4 py-3">{new Date(district?.createdAt as string).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(district?.updatedAt as string).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDistrictId(district.id);
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalDistricts > 0 && (
        <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
          {(() => {
            const minOption = Math.min(...RowsPerPageOptions.map((opt) => Number(opt.value)));
            if (totalDistricts < minOption) return null;

            return (
              <div className="flex items-center self-start space-x-2 text-sm text-gray-600">
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

      {/* District Sheet */}
      {selectedDistrict && (
        <DistrictSheet
          district={selectedDistrict}
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSelectedDistrict(null);
          }}
          provinceId={provinceId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDistrictId !== null} onOpenChange={() => setDeleteDistrictId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this district. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDistrictId && handleDelete(deleteDistrictId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
