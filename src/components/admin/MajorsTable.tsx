import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      major.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(major.faculty_id).includes(searchQuery)
  );

  // 🔹 create
  const handleAddMajor = async (data: MajorFormData) => {
    const created = await createMajor(data);
    setMajors((prev) => [created, ...prev]);
  };

  // 🔹 edit click
  const handleEditClick = (major: Major) => {
    setSelectedMajor(major);
    setIsEditSheetOpen(true);
  };

  // 🔹 update
  const handleUpdateMajor = async (updated: Major) => {
    const result = await updateMajor(updated.major_id, {
      name: updated.name,
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Majors</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <TableRow>
              <TableHead>Major Name</TableHead>
              <TableHead>Faculty ID</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!loading && filteredMajors.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No majors found
                </TableCell>
              </TableRow>
            )}

            {filteredMajors.map((major) => (
              <TableRow key={major.major_id}>
                <TableCell>{major.name}</TableCell>
                <TableCell>
                  {
                    faculties.find(
                      (f) => f.faculty_id === major.faculty_id
                    )?.name ?? "-"
                  }
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(major)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(major.major_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}