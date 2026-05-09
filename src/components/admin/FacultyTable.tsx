import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Faculty,
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "@/lib/faculties.api";
import { AddFacultySheet, FacultyFormData } from "./AddFacultySheet";
import { EditFacultySheet } from "./EditFacultySheet";

export function FacultyTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFaculties();
        setFaculties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load faculties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredFaculties = faculties.filter(
    (f) =>
      f.eng_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.th_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredFaculties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFaculties = filteredFaculties.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddFaculty = async (data: FacultyFormData) => {
    try {
      await createFaculty({
        eng_name: data.eng_name,
        th_name: data.th_name,
      });
      const updated = await getFaculties();
      setFaculties(Array.isArray(updated) ? updated : []);
      setIsAddSheetOpen(false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to add faculty:", err);
    }
  };

  const handleUpdateFaculty = async (data: Faculty) => {
    try {
      await updateFaculty(data.faculty_id, {
        eng_name: data.eng_name,
        th_name: data.th_name,
      });
      const updated = await getFaculties();
      setFaculties(Array.isArray(updated) ? updated : []);
      setIsEditSheetOpen(false);
      setSelectedFaculty(null);
    } catch (err) {
      console.error("Failed to update faculty:", err);
    }
  };

  const handleEditClick = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsEditSheetOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFaculty(id);
      setFaculties((prev) => prev.filter((f) => f.faculty_id !== id));
      setFacultyToDelete(null);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to delete faculty:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Faculties</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[200px] pl-9 bg-white"
            />
          </div>

          <Button
            className="gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white"
            onClick={() => setIsAddSheetOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <AddFacultySheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddFaculty}
      />

      <EditFacultySheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateFaculty}
        faculty={selectedFaculty}
      />

      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Faculty Name</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Edit</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && filteredFaculties.length === 0 ? (
              // Loading skeleton rows - match actual row height
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredFaculties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No faculties found
                </TableCell>
              </TableRow>
            ) : (
              paginatedFaculties.map((f) => (
              <TableRow key={f.faculty_id} className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b">
                <TableCell className="font-medium">{f.eng_name}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
                    onClick={() => handleEditClick(f)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={() => setFacultyToDelete(f.faculty_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls - Fixed Height */}
        {filteredFaculties.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredFaculties.length)} of {filteredFaculties.length}
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
      <Dialog open={facultyToDelete !== null} onOpenChange={(open) => !open && setFacultyToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this faculty?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setFacultyToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (facultyToDelete !== null) {
                  void handleDelete(facultyToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}





