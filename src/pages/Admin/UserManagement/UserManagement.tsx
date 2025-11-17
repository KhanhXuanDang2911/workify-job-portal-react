import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  RoleColors,
  RoleLabelEN,
  RowsPerPageOptions,
  UserStatusColors,
  UserStatusLabelEN,
  type RowsPerPage,
} from "@/constants";
import Pagination from "@/components/Pagination";
import MultiSortButton from "@/components/MultiSortButton";
import { userService } from "@/services";
import CreateUserModal from "@/pages/Admin/UserManagement/CreateUserModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameInitials } from "@/utils";
import { useTranslation } from "@/hooks/useTranslation";

type SortField =
  | "fullName"
  | "status"
  | "phoneNumber"
  | "email"
  | "birthDate"
  | "gender"
  | "role"
  | "createdAt"
  | "updatedAt";
type SortDirection = "asc" | "desc";

export default function UserManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Initialize state from URL params
  const [pageNumber, setPageNumber] = useState(
    Number(searchParams.get("pageNumber")) || 1
  );
  const [pageSize, setPageSize] = useState<RowsPerPage>(
    (Number(searchParams.get("pageSize")) as RowsPerPage) || 10
  );
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("keyword") || ""
  );
  const [sorts, setSorts] = useState<
    { field: SortField; direction: SortDirection }[]
  >(() => {
    const sortsParam = searchParams.get("sorts");
    if (!sortsParam) return [];
    return sortsParam.split(",").map((s) => {
      const [field, direction] = s.split(":");
      return {
        field: field as SortField,
        direction: direction as SortDirection,
      };
    });
  });

  // Sync state to URL params
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("pageNumber", String(pageNumber));
    params.set("pageSize", String(pageSize));
    if (keyword) params.set("keyword", keyword);
    if (sorts.length > 0) {
      params.set(
        "sorts",
        sorts.map((s) => `${s.field}:${s.direction}`).join(",")
      );
    }
    setSearchParams(params, { replace: true });
  }, [pageNumber, pageSize, keyword, sorts, setSearchParams]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const sortsString = sorts.map((s) => `${s.field}:${s.direction}`).join(",");

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", pageNumber, pageSize, keyword, sortsString],
    queryFn: () =>
      userService.getUsers({
        pageNumber,
        pageSize,
        keyword: keyword || undefined,
        sorts: sortsString || undefined,
      }),
    staleTime: 0,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      toast.success(t("toast.success.userDeleted"));
      queryClient.invalidateQueries({
        queryKey: ["users", pageNumber, pageSize, keyword, sortsString],
      });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t("toast.error.deleteUserFailed"));
    },
  });

  const handleSortChange = useCallback(
    (field: SortField, newDirection: SortDirection | null) => {
      setSorts((prev) => {
        if (newDirection === null) {
          return prev.filter((s) => s.field !== field);
        }
        const existing = prev.find((s) => s.field === field);
        if (existing) {
          return prev.map((s) =>
            s.field === field ? { ...s, direction: newDirection } : s
          );
        }
        return [...prev, { field, direction: newDirection }];
      });

      setPageNumber(1);
    },
    []
  );

  const handleSearch = () => {
    setKeyword(searchInput);
    setPageNumber(1);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const users = usersData?.data.items || [];
  const totalPages = usersData?.data.totalPages || 0;
  const totalUsers = usersData?.data.numberOfElements || 0;

  const ClearFilters = () => {
    setKeyword("");
    setSearchInput("");
    setPageNumber(1);
    setPageSize(10);
    setSorts([]);
  };

  const handleView = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.USERS}/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`${admin_routes.BASE}/${admin_routes.USERS}/edit/${id}`);
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
        <h1 className="text-3xl font-bold text-foreground">
          {t("admin.userManagement.title")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.userManagement.description")}
        </p>
      </div>

      {/* Search and Actions */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("admin.userManagement.searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 focus-visible:border-none focus-visible:ring-1 focus-visible:ring-[#4B9D7C]"
              />
            </div>
            <Button
              onClick={handleSearch}
              variant="secondary"
              className="bg-[#4B9D7C] hover:bg-[#4B9D7C]/90 text-white transition-all"
            >
              {t("admin.userManagement.search")}
            </Button>
          </div>
          <CreateUserModal />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="border-[#4B9D7C] hover-border-[#4B9D7C] text-[#4B9D7C] hover:bg-[#4B9D7C]/10 hover:text-[#4B9D7C] transition-all"
            size="sm"
            onClick={ClearFilters}
          >
            {t("admin.userManagement.clearFilters")}
          </Button>
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
        <table className="min-w-screen w-full border-collapse text-sm table-fixed">
          {/* Table Header */}
          <thead>
            <tr className="bg-muted/40 text-left text-gray-700 dark:text-gray-300 border-b">
              <th className="px-4 py-3 w-[190px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>{t("admin.userManagement.tableHeaders.fullName")}</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "fullName")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("fullName", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[80px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>{t("admin.userManagement.tableHeaders.status")}</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "status")?.direction ?? null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("status", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[160px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>{t("admin.userManagement.tableHeaders.email")}</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "email")?.direction ?? null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("email", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[80px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>{t("admin.userManagement.tableHeaders.role")}</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "role")?.direction ?? null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("role", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[90px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>
                    {t("admin.userManagement.tableHeaders.phoneNumber")}
                  </span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "phoneNumber")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("phoneNumber", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[80px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>{t("admin.userManagement.tableHeaders.gender")}</span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "gender")?.direction ?? null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("gender", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[90px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>
                    {t("admin.userManagement.tableHeaders.birthDate")}
                  </span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "birthDate")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("birthDate", newDirection)
                    }
                  />
                </div>
              </th>

              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[100px]">
                {t("admin.userManagement.tableHeaders.district")}
              </th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wide text-xs w-[100px]">
                {t("admin.userManagement.tableHeaders.province")}
              </th>
              <th className="px-4 py-3 w-[90px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>
                    {t("admin.userManagement.tableHeaders.createdAt")}
                  </span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "createdAt")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("createdAt", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 w-[90px] font-semibold uppercase tracking-wide text-xs">
                <div className="flex items-center justify-start gap-2">
                  <span>
                    {t("admin.userManagement.tableHeaders.updatedAt")}
                  </span>
                  <MultiSortButton
                    direction={
                      sorts.find((s) => s.field === "updatedAt")?.direction ??
                      null
                    }
                    onChange={(newDirection) =>
                      handleSortChange("updatedAt", newDirection)
                    }
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-right w-[30px]"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoadingUsers ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-10 text-muted-foreground italic"
                >
                  {t("admin.userManagement.loading")}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-10 text-muted-foreground"
                >
                  <img
                    src="/empty-folder.png"
                    alt="Empty"
                    className="mx-auto w-20 opacity-70"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t("admin.userManagement.noUsersFound")}
                  </p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/30 border-b last:border-none transition-colors"
                >
                  <td className="px-4 py-3 w-[190px] font-medium  text-gray-900 dark:text-gray-100 truncate">
                    <div className="w-full flex items-center gap-1.5">
                      {/* Avatar */}
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={user.avatarUrl || ""}
                          alt={user.fullName || "user"}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                          {getNameInitials(user?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <p>{user.fullName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 w-[80px]">
                    <Badge
                      variant="outline"
                      className={UserStatusColors[user.status]}
                    >
                      {UserStatusLabelEN[user.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 w-[160px] truncate">{user.email}</td>
                  <td className="px-4 py-3 w-[80px]">
                    <Badge variant="outline" className={RoleColors[user.role]}>
                      {RoleLabelEN[user.role]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 w-[90px]">
                    {user.phoneNumber ? user.phoneNumber : "null"}
                  </td>
                  <td className="px-4 py-3 w-[80px]">
                    {user.gender ? user.gender : "null"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[90px]">
                    {new Date(user.birthDate as string).toLocaleDateString(
                      "vi-VN"
                    )}
                  </td>
                  <td className="px-4 py-3 w-[100px]">
                    {user.district?.name ? user.district.name : "null"}
                  </td>
                  <td className="px-4 py-3 w-[100px]">
                    {user.province?.name ? user.province.name : "null"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[90px]">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 w-[90px]">
                    {new Date(user.updatedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right w-[30px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-muted rounded-full"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => handleView(user.id)}>
                          <Eye className="w-4 h-4 mr-2 text-blue-500" />
                          {t("admin.userManagement.actions.viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                          <Edit className="w-4 h-4 mr-2 text-green-500" />
                          {t("admin.userManagement.actions.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("admin.userManagement.actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalUsers > 0 && (
          <div className="flex flex-col items-center justify-between px-3 md:px-6 py-4 border-t">
            {(() => {
              const minOption = Math.min(
                ...RowsPerPageOptions.map((opt) => Number(opt.value))
              );
              if (totalUsers < minOption) return null;

              return (
                <div className="flex self-start items-center space-x-2 text-sm text-gray-600">
                  <span>{t("admin.userManagement.pagination.shows")}</span>
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
                  <span>{t("admin.userManagement.pagination.rows")}</span>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.userManagement.deleteDialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.userManagement.deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.userManagement.deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("admin.userManagement.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
