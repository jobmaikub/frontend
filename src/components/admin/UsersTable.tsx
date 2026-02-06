import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { User } from "@/data/usersData";
import { UserDetailsSheet } from "./UserDetailsSheet";
import { AddUsersSheet, UserFormData } from "./AddUsersSheet";
import { useEffect } from "react";
import { fetchUsers, updateUserStatus, createUser } from "@/lib/users.api";

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for side sheets
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to fetch users";
        setError(errorMsg);
        console.error("Error fetching users:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to trigger the detail side sheet
  const handleShowDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  // Function to handle adding a new user
  const handleAddUser = async (data: UserFormData) => {
    const newUser = await createUser({
      name: data.name,
      email: data.email,
      role: data.role.toLowerCase() as "admin" | "user",
    });

    setUsers((prev) => [newUser, ...prev]);
  };


  // Function to handle Ban/Unban logic from the detail sheet
  const handleBanToggle = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const isBanned = user.banHistory.length > 0;
    const status = isBanned ? "unban" : "ban";

    const updated = await updateUserStatus(userId, status);

    // ดึง user ใหม่อีกรอบ (ง่าย & ชัวร์)
    const refreshed = await fetchUsers();
    setUsers(refreshed);
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">Error Loading Users</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No users found</p>
          <Button
            className="gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white border-none shadow-sm"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Users</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px] pl-9 bg-[#FFFFFF]"
            />
          </div>
          <Button
            className="gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white border-none shadow-sm"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      {/* Side Sheet Components */}
      <AddUsersSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddUser}
      />

      <UserDetailsSheet
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        user={users.find(u => u.id === selectedUser?.id) || null}
        onBanToggle={handleBanToggle}
      />

      {/* Main Table section */}
      <div className="overflow-hidden rounded-lg border border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#4A5DF9] hover:bg-[#4A5DF9]">
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
            {filteredUsers.map((user) => {
              const isBanned = user.banHistory && user.banHistory.length > 0;
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
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}