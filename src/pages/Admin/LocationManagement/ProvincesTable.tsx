import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RowsPerPageOptions, type RowsPerPage } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { provinceService } from "@/services";
import type { Province } from "@/types";
import CreateProvinceModal from "@/pages/Admin/LocationManagement/CreateProvinceModal";
import { useTranslation } from "@/hooks/useTranslation";

interface ProvincesTableProps {
  onSelectProvince: (province: Province) => void;
  selectedProvince: Province | null;
}

export default function ProvincesTable({
  onSelectProvince,
  selectedProvince,
}: ProvincesTableProps) {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<RowsPerPage>(10);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);

  const { data: provincesData, isLoading: isLoadingProvincesData } = useQuery({
    queryKey: ["provinces", "all"],
    queryFn: async () => {
      const res = await provinceService.getProvinces();
      return res.data;
    },
    staleTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (provincesData) {
      setFilteredProvinces(provincesData);
    }
  }, [provincesData]);

  useEffect(() => {
    setFilteredProvinces(() => {
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return provincesData?.slice(startIndex, endIndex) || [];
    });
  }, [pageNumber, pageSize, provincesData]);

  const totalProvinces = provincesData ? provincesData.length : 0;
  const totalPages = Math.ceil(totalProvinces / pageSize);

  const ClearFilters = () => {
    setSearchInput("");
    setPageNumber(1);
    setFilteredProvinces(provincesData || []);
  };

  const handleSearch = () => {
    setPageNumber(1);
    if (searchInput.trim() === "") {
      setFilteredProvinces(provincesData || []);
      return;
    }
    const keyword = searchInput.toLowerCase();
    const filtered = provincesData?.filter(
      (province) =>
        province.name.toLowerCase().includes(keyword) ||
        province.engName.toLowerCase().includes(keyword) ||
        province.code.toLowerCase().includes(keyword)
    );
    setFilteredProvinces(filtered || []);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-2 px-8 py-2 bg-teal-500 text-white w-fit"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
          }}
        >
          <span className="font-semibold">
            {t("admin.locationManagement.provinces.title")}
          </span>
        </div>

        <div className="">
          <CreateProvinceModal />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder={t(
              "admin.locationManagement.provinces.searchPlaceholder"
            )}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 focus-visible:border-none bg-white focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
          />
          <Button
            variant="secondary"
            className="bg-gray-800 text-white hover:bg-gray-900"
            onClick={handleSearch}
          >
            {t("admin.locationManagement.provinces.search")}
          </Button>
        </div>

        <Button
          variant="outline"
          className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
          size="sm"
          onClick={ClearFilters}
        >
          {t("admin.locationManagement.provinces.clearFilters")}
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-sm border-gray-200">
              <th className="px-4 py-3 text-left">
                <span className="">
                  {t("admin.locationManagement.provinces.tableHeaders.name")}
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>
                    {t(
                      "admin.locationManagement.provinces.tableHeaders.engName"
                    )}
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span>
                    {t("admin.locationManagement.provinces.tableHeaders.code")}
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <span>
                  {t(
                    "admin.locationManagement.provinces.tableHeaders.createdAt"
                  )}
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span>
                  {t(
                    "admin.locationManagement.provinces.tableHeaders.updatedAt"
                  )}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingProvincesData ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground italic"
                >
                  {t("admin.locationManagement.provinces.loading")}
                </td>
              </tr>
            ) : filteredProvinces.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  <img
                    src="/empty-folder.png"
                    alt="Empty"
                    className="mx-auto w-20 opacity-70"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t("admin.locationManagement.provinces.noProvincesFound")}
                  </p>
                </td>
              </tr>
            ) : (
              filteredProvinces.map((province) => (
                <tr
                  key={province.id}
                  onClick={() => onSelectProvince(province)}
                  className={cn(
                    "border-b border-gray-200 text-[13px] hover:bg-gray-50 cursor-pointer",
                    province.id === selectedProvince?.id && "bg-green-200"
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{province.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100">
                      {province.engName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100">
                      {province.code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(province?.createdAt as string).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(province?.updatedAt as string).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalProvinces > 0 && (
        <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
          {(() => {
            const minOption = Math.min(
              ...RowsPerPageOptions.map((opt) => Number(opt.value))
            );
            if (totalProvinces < minOption) return null;

            return (
              <div className="flex items-center self-start space-x-2 text-sm text-gray-600">
                <span>
                  {t("admin.locationManagement.provinces.pagination.shows")}
                </span>
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
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>
                  {t("admin.locationManagement.provinces.pagination.rows")}
                </span>
              </div>
            );
          })()}

          <div className="w-full sm:w-auto flex justify-center">
            <Pagination
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
