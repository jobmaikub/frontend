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
  Skill,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/skills.api";

import { AddSkillsSheet, SkillFormData } from "./AddSkillsSheet";
import { EditSkillsSheet } from "./EditSkillsSheet";

export function SkillsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* 🔹 load skills */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData || []);
      } catch (err) {
        console.error("Failed to load skills:", err);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const q = searchQuery.toLowerCase();
    return skill.name?.toLowerCase().includes(q);
  });

  // Pagination
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSkills = filteredSkills.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleAddSkill = async (data: Partial<Skill>) => {
    try {
      await createSkill({
        name: data.name || "",
        category: {},
      });

      // Reload all skills to maintain database order
      const updatedSkills = await getSkills();
      setSkills(updatedSkills || []);
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error("Create skill failed:", error);
    }
  };

  const handleEditClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditSheetOpen(true);
  };

  const handleUpdateSkill = async (data: Partial<Skill>) => {
    try {
      if (!data.skill_id) return;
      const result = await updateSkill(data.skill_id, {
        name: data.name,
      });

      setSkills((prev) =>
        prev.map((s) =>
          s.skill_id === result.skill_id ? result : s
        )
      );

      setIsEditSheetOpen(false);
      setSelectedSkill(null);
    } catch (err) {
      console.error("Update skill failed:", err);
    }
  };


  const handleDelete = async (id: number) => {
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.skill_id !== id));
      setSkillToDelete(null);
      setCurrentPage(1); // Reset to first page
    } catch (err) {
      console.error("Delete skill failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Skills</h1>

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

      <AddSkillsSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddSkill}
      />

      <EditSkillsSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateSkill}
        skill={selectedSkill}
      />

      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Skill Name</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Edit</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && filteredSkills.length === 0 ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : paginatedSkills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No skills found
                </TableCell>
              </TableRow>
            ) : (
              paginatedSkills.map((skill) => (
              <TableRow key={skill.skill_id} className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b">
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
                    onClick={() => handleEditClick(skill)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={() => setSkillToDelete(skill.skill_id)}
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
        {filteredSkills.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSkills.length)} of {filteredSkills.length}
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
      <Dialog open={skillToDelete !== null} onOpenChange={(open) => !open && setSkillToDelete(null)}>
        <DialogContent className="z-50 bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this skill?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setSkillToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (skillToDelete !== null) {
                  void handleDelete(skillToDelete);
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





