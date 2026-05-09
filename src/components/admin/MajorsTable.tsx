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
  Major,
  getMajors,
  createMajor,
  updateMajor,
  deleteMajor,
} from "@/lib/majors.api";
import { getFaculties, Faculty } from "@/lib/faculties.api";
import { AddMajorsSheet, MajorFormData } from "./AddMajorsSheet";
import { EditMajorsSheet } from "./EditMajorsSheet";

export function MajorsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [majorToDelete, setMajorToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔹 load majors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [majorsData, facultiesData] = await Promise.all([
          getMajors(),
          getFaculties(),
        ]);

        setMajors(Array.isArray(majorsData) ? majorsData : []);
        setFaculties(Array.isArray(facultiesData) ? facultiesData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMajors = majors.filter(
    (major) =>
      major.eng_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(major.faculty_id).includes(searchQuery)
  );

  // Pagination
  const totalPages = Math.ceil(filteredMajors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMajors = filteredMajors.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // 🔹 create
  const handleAddMajor = async (data: MajorFormData) => {
    const created = await createMajor(data);
    setMajors((prev) => [created, ...prev]);
    setCurrentPage(1);
  };

  // 🔹 edit click
  const handleEditClick = (major: Major) => {
    setSelectedMajor(major);
    setIsEditSheetOpen(true);
  };

  // 🔹 update
  const handleUpdateMajor = async (updated: Major) => {
    const result = await updateMajor(updated.major_id, {
      eng_name: updated.eng_name,
      th_name: updated.th_name,
      faculty_id: updated.faculty_id,
    });

    setMajors((prev) =>
      prev.map((m) =>
        m.major_id === result.major_id ? result : m
      )
    );

    setIsEditSheetOpen(false);
    setSelectedMajor(null);
  };

  // 🔹 delete
  const handleDelete = async (id: number) => {
    await deleteMajor(id);
    setMajors((prev) => prev.filter((m) => m.major_id !== id));
    setMajorToDelete(null);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Majors</h1>

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

      {/* Sheets */}
      <AddMajorsSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddMajor}
        faculties={faculties}
      />


      <EditMajorsSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateMajor}
        major={selectedMajor}
        faculties={faculties}
      />


      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Major Name</TableHead>
              <TableHead className="text-white font-semibold">Faculty</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Edit</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && filteredMajors.length === 0 ? (
              // Loading skeleton rows - match actual row height
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredMajors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No majors found
                </TableCell>
              </TableRow>
            ) : (
              paginatedMajors.map((major) => (
              <TableRow key={major.major_id} className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b">
                <TableCell className="text-foreground font-medium">{major.eng_name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {
                    faculties.find(
                      (f) => f.faculty_id === major.faculty_id
                    )?.eng_name ?? "-"
                  }
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
                    onClick={() => handleEditClick(major)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={() => setMajorToDelete(major.major_id)}
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
        {filteredMajors.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMajors.length)} of {filteredMajors.length}
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
      <Dialog open={majorToDelete !== null} onOpenChange={(open) => !open && setMajorToDelete(null)}>
        <DialogContent className="z-50 bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this major?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setMajorToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (majorToDelete !== null) {
                  void handleDelete(majorToDelete);
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





