import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { User } from "@/types/users.types";
import { UserDetailsSheet } from "./UserDetailsSheet";
import { useEffect } from "react";
import {
  fetchUsers,
  fetchUserById,
  fetchBanHistory,
  banUser,
  unbanUser,
  BanUserRow,
} from "@/lib/users.api";
import { useAuth } from "@/contexts/AuthContexts";

type UIBanHistory = {
  banId: string;
  banDate: string;
  unbanDate: string | null;
  reason: string;
};

const hasActiveBanFromHistory = (banHistory: UIBanHistory[]) =>
  banHistory.some((entry) => !entry.unbanDate || new Date(entry.unbanDate) > new Date());

const isUserBanned = (user: User, banHistory?: UIBanHistory[]) => {
  const history = banHistory ?? ((user.banHistory as UIBanHistory[]) || []);
  return Boolean(user.is_banned) || hasActiveBanFromHistory(history);
};

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // State for side sheets
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusSort, setStatusSort] = useState<"" | "active-first" | "banned-first">("");
  const [roleSort, setRoleSort] = useState<"" | "admin-first" | "user-first">("");
  const itemsPerPage = 10;
  const { user: authUser } = useAuth();

  useEffect(() => {
    Promise.all([fetchUsers(), fetchBanHistory()])
      .then(([usersData, banRows]) => {
        const now = new Date();
        const mapped = usersData.map((u: User) => {
          const userBans = banRows
            .filter((b: BanUserRow) => String(b.user_id) === String(u.id))
            .map((b: BanUserRow): UIBanHistory => ({
              banId: b.ban_id,
              banDate: b.ban_date,
              unbanDate: b.unban_date,
              reason: b.reason || "No reason",
            }));
          return {
            ...u,
            is_banned: isUserBanned(u, userBans),
            banHistory: userBans,
          };
        });
        setUsers(mapped);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to fetch users";
        setError(errorMsg);
        console.error("Error fetching users:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (user) => {
      const q = searchQuery.toLowerCase();
      const userId = String(user.id ?? "").toLowerCase();
      const name = String(user.name ?? "").toLowerCase();
      const email = String(user.email ?? "").toLowerCase();

      return (
        userId.includes(q) ||
        name.includes(q) ||
        email.includes(q)
      );
    }
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let result = 0;

    if (statusSort !== "") {
      const aBanned = isUserBanned(a) ? 1 : 0;
      const bBanned = isUserBanned(b) ? 1 : 0;

      result = statusSort === "banned-first" ? bBanned - aBanned : aBanned - bBanned;
    }

    if (result === 0 && roleSort !== "") {
      const aRole = (a.role || "user").toLowerCase();
      const bRole = (b.role || "user").toLowerCase();
      const aAdmin = aRole === "admin" ? 1 : 0;
      const bAdmin = bRole === "admin" ? 1 : 0;

      result = roleSort === "admin-first" ? bAdmin - aAdmin : aAdmin - bAdmin;
    }

    return result;
  });

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Function to trigger the detail side sheet
  const handleShowDetails = async (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);

    try {
      const fullUser = await fetchUserById(user.id);
      setSelectedUser(fullUser);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to load user details";
      setError(errorMsg);
    }
  };

  // Function to handle Ban/Unban logic from the detail sheet
  const handleBanToggle = async (userId: string | number, reason?: string, banUntil?: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const hasActiveBan = isUserBanned(user);

    try {
      if (hasActiveBan) {
        await unbanUser(userId);
      } else {
        await banUser(userId, reason || "Banned by admin", authUser?.id ?? null, banUntil);
      }

      const [usersData, banRows] = await Promise.all([fetchUsers(), fetchBanHistory()]);
      const now = new Date();
      const mapped = usersData.map((u: User) => {
        const userBans = banRows
          .filter((b: BanUserRow) => String(b.user_id) === String(u.id))
          .map((b: BanUserRow): UIBanHistory => ({
            banId: b.ban_id,
            banDate: b.ban_date,
            unbanDate: b.unban_date,
            reason: b.reason || "No reason",
          }));
        return {
          ...u,
          is_banned: isUserBanned(u, userBans),
          banHistory: userBans,
        };
      });
      setUsers(mapped);
      setError(null);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to update ban status";
      setError(errorMsg);
    }
  };

  if (users.length === 0 && !loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Users</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-11 pl-10 bg-white rounded-xl border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-[#4A5DF9] focus-visible:border-[#4A5DF9]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Select
              open={isRoleSelectOpen}
              onOpenChange={setIsRoleSelectOpen}
              value={roleSort}
              onValueChange={(value: "admin-first" | "user-first") => {
                setRoleSort(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="flex-1 sm:w-[140px] bg-[#FFFFFF]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#FFFFFF]">
                <SelectItem value="admin-first">Admin First</SelectItem>
                <SelectItem value="user-first">User First</SelectItem>
              </SelectContent>
            </Select>

            <Select
              open={isStatusSelectOpen}
              onOpenChange={setIsStatusSelectOpen}
              value={statusSort}
              onValueChange={(value: "active-first" | "banned-first") => {
                setStatusSort(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="flex-1 sm:w-[150px] bg-[#FFFFFF]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#FFFFFF]">
                <SelectItem value="banned-first">Banned First</SelectItem>
                <SelectItem value="active-first">Active First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Side Sheet Components */}
      <UserDetailsSheet
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        user={selectedUser}
        onBanToggle={handleBanToggle}
      />

      {/* Main Table section */}
      <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">User ID</TableHead>
              <TableHead className="text-white font-semibold">Fullname</TableHead>
              <TableHead className="text-white font-semibold">Email</TableHead>
              <TableHead className="text-white font-semibold">Role</TableHead>
              <TableHead className="text-white font-semibold">Joined</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && users.length === 0 ? (
              // Loading skeleton rows - match actual row height
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell className="text-muted-foreground"><div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-28 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => {
                const isBanned = isUserBanned(user);
                return (
                  <TableRow
                    key={user.id}
                    className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
                  >
                    <TableCell className="text-muted-foreground">{user.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-muted-foreground">{user.joinedDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${isBanned ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}>
                        {isBanned ? "Banned" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white h-8 px-4 text-xs rounded-md shadow-none"
                        onClick={() => handleShowDetails(user)}
                      >
                        Show Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls - Fixed Height */}
        {sortedUsers.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedUsers.length)} of {sortedUsers.length}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="flex items-center justify-center min-w-14 px-2 py-1 rounded border border-gray-300 bg-white font-medium text-sm">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



