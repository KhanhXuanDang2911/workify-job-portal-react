import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import type { ApiResponse, PageResponse } from "@/types";
import type { RowsPerPage } from "@/constants";

export type SortDirection = "asc" | "desc";

export interface UseTableQueryOptions<T> {
  queryKey: string[];
  fetchFn: (params: {
    pageNumber: number;
    pageSize: number;
    sortField: string;
    sortDirection: SortDirection;
    keyword?: string;
  }) => Promise<ApiResponse<PageResponse<T>>>;
  defaultSortField?: string;
  defaultSortDirection?: SortDirection;
}

export function useTableQuery<T>({
  queryKey,
  fetchFn,
  defaultSortField = "createdAt",
  defaultSortDirection = "desc",
}: UseTableQueryOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );
  const [searchInput, setSearchInput] = useState(
    searchParams.get("keyword") || ""
  );
  const [sortField, setSortField] = useState(
    searchParams.get("sortField") || defaultSortField
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    (searchParams.get("sortDirection") as SortDirection) || defaultSortDirection
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(
    (Number(searchParams.get("size")) as RowsPerPage) || 10
  );

  const { data, isLoading } = useQuery({
    queryKey: [
      ...queryKey,
      currentPage,
      rowsPerPage,
      sortField,
      sortDirection,
      searchTerm,
    ],
    queryFn: async () => {
      const res = await fetchFn({
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        sortField,
        sortDirection,
        keyword: searchTerm || undefined,
      });
      return res.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    const params: Record<string, string> = {
      page: currentPage.toString(),
      size: rowsPerPage.toString(),
      sortField,
      sortDirection,
    };
    if (searchTerm) params.keyword = searchTerm;
    setSearchParams(params);
  }, [
    currentPage,
    rowsPerPage,
    sortField,
    sortDirection,
    searchTerm,
    setSearchParams,
  ]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleRowsPerPageChange = (value: RowsPerPage) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return {
    data,
    isLoading,
    searchInput,
    setSearchInput,
    handleSearch,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    handlePageChange,
    rowsPerPage,
    handleRowsPerPageChange,
  };
}
