import { useEffect, useState } from "react";
import axios from "axios";
import { getCourses, deleteCourse, createCourse, updateCourse, Course } from "@/lib/courses.api";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { AddCoursesSheet, CourseFormData } from "./AddCoursesSheet";
import { EditCoursesSheet } from "./EditCoursesSheet";
import { fetchCareers, Career } from "@/lib/careers.api";

export function CoursesTable() {
  const [courses, setCourses] = useState<any[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [apiCourses, careersData] = await Promise.all([
          getCourses(),
          fetchCareers(),
        ]);
        setCareers(Array.isArray(careersData) ? careersData : []);

        const mapped = apiCourses.map((c: Course) => ({
          course_id: c.course_id,
          id: c.course_id,
          title: c.title,
          description: c.description,
          image: c.image_url,
          image_url: c.image_url,
          career_id: c.career_id,
          career_path: c.career_path || c.career_name,
          career_name: c.career_name,
          level: c.level,
          duration_mins: c.duration_mins,
          course_order: c.course_order,
          skills_taught: c.skills_taught ?? [],
          learning_outcome: c.learning_outcome ?? [],
        }));

        setCourses(mapped);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setCourses([]);
        setCareers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (id: number) => {
    await deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setCourseToDelete(null);
    setCurrentPage(1);
  };


  const handleAddCourse = async (data: CourseFormData) => {
    try {
      const parsedSkills = (data.skills_taught || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedOutcome = (data.learning_outcome || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const c = await createCourse({
        ...data,
        skills_taught: parsedSkills,
        learning_outcome: parsedOutcome,
      });

      setCourses((prev) => [
        {
          course_id: c.course_id,
          id: c.course_id,
          title: c.title,
          description: c.description,
          image: c.image_url,
          image_url: c.image_url,
          career_id: c.career_id,
          career_path: c.career_path || c.career_name,
          career_name: c.career_name,
          level: c.level,
          duration_mins: c.duration_mins,
          course_order: c.course_order,
          skills_taught: c.skills_taught ?? [],
          learning_outcome: c.learning_outcome ?? [],
        },
        ...prev,
      ]);
      setCurrentPage(1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to add course:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      }
      console.error("Failed to add course:", err);
      throw err;
    }
  };

  const handleEditClick = (course: any) => {
    setSelectedCourse(course);
    setIsEditSheetOpen(true);
  };

  const handleUpdateCourse = async (payload: Partial<Course>) => {
    if (!selectedCourse) return;

    try {
      const c = await updateCourse(selectedCourse.course_id, payload);

      setCourses((prev) =>
        prev.map((course) =>
          course.id === c.course_id
            ? {
                  course_id: c.course_id,
                  id: c.course_id,
              title: c.title,
              description: c.description,
                image: c.image_url,
                image_url: c.image_url,
              career_id: c.career_id,
                  career_path: c.career_path || c.career_name,
              career_name: c.career_name,
              level: c.level,
              duration_mins: c.duration_mins,
              course_order: c.course_order,
              skills_taught: c.skills_taught ?? [],
              learning_outcome: c.learning_outcome ?? [],
            }
            : course
        )
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Failed to update course:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
      }
      console.error("Failed to update course:", err);
      throw err;
    }
  };

  const getLevelBadgeClassName = (level: string) => {
    switch ((level || "").toLowerCase()) {
      case "beginner":
        return "bg-[#1FAA52] text-white border-transparent";
      case "intermediate":
        return "bg-[#4A5DF9] text-white border-transparent";
      case "advanced":
        return "bg-[#A855F7] text-white border-transparent";
      default:
        return "bg-white text-black border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">Courses</h1>

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

      {/* Form Sheets */}
      <AddCoursesSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddCourse}
        careers={careers}
      />

      <EditCoursesSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateCourse}
        course={selectedCourse}
        careers={careers}
      />

      {/* Table Section */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="admin-table-header hover:bg-[#4A5DF9]">
              <TableHead className="text-white font-semibold">Image</TableHead>
              <TableHead className="text-white font-semibold">Course Name</TableHead>
              <TableHead className="text-white font-semibold">Career Path</TableHead>
              <TableHead className="text-white font-semibold">Level</TableHead>
              <TableHead className="text-white font-semibold text-center">Duration (min)</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Edit</TableHead>
              <TableHead className="text-white font-semibold text-center w-[100px]">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && filteredCourses.length === 0 ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={`loading-${idx}`} className="bg-[#FFFFFF] border-b h-14">
                  <TableCell><div className="h-12 w-20 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                  <TableCell><div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                  <TableCell className="text-center"><div className="h-3 bg-gray-200 rounded animate-pulse w-12 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                  <TableCell className="text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-8 mx-auto"></div></TableCell>
                </TableRow>
              ))
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCourses.map((course) => (
              <TableRow
                key={course.id}
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
              >
                <TableCell>
                  <div className="h-12 w-20 overflow-hidden rounded-md bg-muted">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.warn(`Image failed to load: ${course.image}`);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{course.title}</TableCell>

                {/* UPDATED: Career Path text color changed to grey (text-muted-foreground) */}
                <TableCell>
                  <span className="text-muted-foreground font-medium">
                    {course.career_path || course.career_name || "-"}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize font-normal ${getLevelBadgeClassName(
                      String(course.level)
                    )}`}
                  >
                    {course.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">{course.duration_mins}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:text-[#4A5DF9] hover:bg-transparent"
                    onClick={() => handleEditClick(course)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-transparent hover:text-destructive"
                    onClick={() => setCourseToDelete(course.id)}
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
        {filteredCourses.length > 0 && (
          <div className="h-16 flex items-center justify-between px-4 border-t bg-[#F9FAFB] flex-shrink-0">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCourses.length)} of {filteredCourses.length}
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
      <Dialog open={courseToDelete !== null} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Do you want to delete this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="bg-white hover:bg-slate-100 text-black hover:text-black" onClick={() => setCourseToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="hover:bg-[#b91c1c]"
              onClick={() => {
                if (courseToDelete !== null) {
                  void handleDelete(courseToDelete);
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





