import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getFaculties, Faculty } from "@/lib/faculties.api";
import { getMajors, Major } from "@/lib/majors.api";
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
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);

  /* 🔹 load skills */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, facultiesData, majorsData] =
          await Promise.all([
            getSkills(),
            getFaculties(),
            getMajors(),
          ]);

        setSkills(skillsData);
        setFaculties(facultiesData);
        setMajors(majorsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const q = searchQuery.toLowerCase();

    const facultyName =
      faculties.find(
        (f) => f.faculty_id === skill.category?.faculty_id
      )?.name ?? "";

    const majorName =
      majors.find(
        (m) => m.major_id === skill.category?.major_id
      )?.name ?? "";

    return (
      skill.name?.toLowerCase().includes(q) ||
      facultyName.toLowerCase().includes(q) ||
      majorName.toLowerCase().includes(q)
    );
  });

  const handleAddSkill = async (data: SkillFormData) => {
    try {
      const newSkill = await createSkill({
        name: data.name,
        category: {
          faculty_id: data.faculty_id,
          major_id: data.major_id,
        },
      });

      setSkills((prev) => [newSkill, ...prev]);
    } catch (error) {
      console.error("Create skill failed:", error);
    }
  };

  const handleEditClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditSheetOpen(true);
  };

  const handleUpdateSkill = async (
    data: SkillFormData & { skill_id: number }
  ) => {
    try {
      const result = await updateSkill(data.skill_id, {
        name: data.name,
        category: {
          faculty_id: data.faculty_id,
          major_id: data.major_id,
        },
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

      <AddSkillsSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddSkill}
        faculties={faculties}
        majors={majors}
      />

      <EditSkillsSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateSkill}
        skill={selectedSkill}
        faculties={faculties}
        majors={majors}
      />

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill Name</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Major</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSkills.map((skill) => (
              <TableRow key={skill.skill_id}>
                <TableCell>{skill.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {
                    faculties.find(
                      (f) => f.faculty_id === skill.category?.faculty_id
                    )?.name ?? "-"
                  }                </TableCell>
                <TableCell className="text-muted-foreground">
                  {
                    majors.find(
                      (m) => m.major_id === skill.category?.major_id
                    )?.name ?? "-"
                  }
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditClick(skill)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(skill.skill_id)}
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
