import { useState } from "react";
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
  TableRow
} from "@/components/ui/table";
import { Lesson, getLessons, deleteLesson, createLesson, updateLesson } from "@/lib/lessons.api";
import { getCourses, Course } from "@/lib/courses.api";
import { AddLessonsSheet, LessonFormData } from "./AddLessonsSheet";
import { EditLessonsSheet } from "./EditLessonsSheet";
import { useEffect } from "react";

const mapLesson = (l: any, courses: Course[]) => {
  const course = courses.find((c) => c.course_id === l.course_id);
  return {
    lesson_id: l.lesson_id,
    id: l.lesson_id,
    title: l.title,
    course_id: l.course_id,
    courseId: l.course_id,
    course: course?.title || `Course #${l.course_id}`,
    lesson_order: l.lesson_order,
    order: l.lesson_order,
    duration_mins: l.duration_mins,
    external_url: l.external_url,
    externalUrl: l.external_url,
  };
};

export function LessonsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLessons = filteredLessons.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsData, coursesData] = await Promise.all([
          getLessons(),
          getCourses(),
        ]);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setLessons((lessonsData || []).map((l) => mapLesson(l, Array.isArray(coursesData) ? coursesData : [])));
      } catch (err) {
        console.error('Failed to load lessons or courses:', err);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddLesson = async (data: Partial<Lesson>) => {
    try {
      await createLesson(data as Lesson);
      const lessonsData = await getLessons();
      setLessons((lessonsData || []).map((l) => mapLesson(l, courses)));
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to add lesson:", err);
    }
  };


  const handleUpdateLesson = async (data: Partial<Lesson>) => {
    if (!selectedLesson?.lesson_id) return;
    await updateLesson(selectedLesson.lesson_id, data);

    const lessonsData = await getLessons();
    setLessons((lessonsData || []).map((l) => mapLesson(l, courses)));
    setCurrentPage(1);
  };

  const handleEditClick = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsEditSheetOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteLesson(id);
    setLessons(lessons.filter((l) => l.id !== id));
    setLessonToDelete(null);
    setCurrentPage(1);
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[200px] pl-9 bg-[#FFFFFF]"
            />
          </div>
          <Button
            className="gap-2 bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 text-white shadow-sm"
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

      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Lesson Name</TableHead>
              <TableHead className="text-white font-semibold">Course</TableHead>
              <TableHead className="text-white font-semibold text-center">Order</TableHead>
              <TableHead className="text-white font-semibold text-center">Duration (min)</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Edit</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && filteredLessons.length === 0 ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                  <TableCell className="text-center"><div className="h-3 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-3 bg-gray-200 rounded animate-pulse w-12 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredLessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No lessons found
                </TableCell>
              </TableRow>
            ) : (
              paginatedLessons.map((lesson) => (
              <TableRow
                key={lesson.id}
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
              >
                <TableCell className="font-medium text-foreground">{lesson.title}</TableCell>
                <TableCell className="text-muted-foreground">{lesson.course}</TableCell>
                <TableCell className="text-center text-foreground">{lesson.order}</TableCell>
                <TableCell className="text-center text-muted-foreground">{lesson.duration_mins}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
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
                    onClick={() => setLessonToDelete(lesson.id)}
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
        {filteredLessons.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLessons.length)} of {filteredLessons.length}
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
      <Dialog open={lessonToDelete !== null} onOpenChange={(open) => !open && setLessonToDelete(null)}>
        <DialogContent className="z-50 bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this lesson?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setLessonToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (lessonToDelete !== null) {
                  void handleDelete(lessonToDelete);
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





