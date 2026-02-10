import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
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
import { Lesson } from "@/data/lessonsData";
import { AddLessonsSheet, LessonFormData } from "./AddLessonsSheet";
import { EditLessonsSheet } from "./EditLessonsSheet"; // Import the edit sheet
import { useEffect } from "react";
import { lessonsApi } from "@/lib/lessons.api";

const mapLesson = (l: any) => ({
  id: l.lesson_id,
  title: l.title,
  courseId: l.course_id,
  course: l.courses?.title ?? "",
  order: l.lesson_order,
  duration: l.duration,
  externalUrl: l.external_url,
});

export function LessonsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
  lessonsApi.getAll().then((res) => {
    setLessons(res.data.map(mapLesson));
  });
}, []);

  const handleAddLesson = async (data: LessonFormData) => {
  await lessonsApi.create(data);
  const res = await lessonsApi.getAll();
  setLessons(res.data.map(mapLesson));
};


  const handleUpdateLesson = async (lesson: Lesson) => {
  await lessonsApi.update(lesson.id, {
    title: lesson.title,
    courseId: lesson.courseId,
    order: lesson.order,
    duration: lesson.duration,
    externalUrl: lesson.externalUrl,
  });

  const res = await lessonsApi.getAll();
  setLessons(res.data.map(mapLesson));
};

  const handleEditClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsEditSheetOpen(true);
  };

  const handleDelete = async (id: number) => {
    await lessonsApi.delete(id);
    setLessons(lessons.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Lessons</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] pl-9 bg-[#FFFFFF]"
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

      <AddLessonsSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddLesson}
      />

      <EditLessonsSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateLesson}
        lesson={selectedLesson}
      />

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground font-semibold">Title</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Course</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Order</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Duration (min)</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Edit</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLessons.map((lesson) => (
              <TableRow
                key={lesson.id}
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
              >
                <TableCell className="font-medium">{lesson.title}</TableCell>
                <TableCell className="text-muted-foreground">{lesson.course}</TableCell>
                <TableCell className="text-center">{lesson.order}</TableCell>
                <TableCell className="text-center">{lesson.duration}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-transparent"
                    onClick={() => handleEditClick(lesson)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={() => handleDelete(lesson.id)}
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
