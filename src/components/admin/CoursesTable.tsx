import { useEffect, useState } from "react";
import { coursesApi } from "@/lib/courses.api";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course, UpdateCoursePayload } from "@/data/coursesData";
import { AddCoursesSheet, CourseFormData } from "./AddCoursesSheet";
import { EditCoursesSheet } from "./EditCoursesSheet";
const careerPathLabelMap: Record<string, string> = {
  UXDesigner: "UX Designer",
  DataScientist: "Data Scientist",
  SoftwareEngineer: "Software Engineer",
  ProductManager: "Product Manager",
};

export function CoursesTable() {
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await coursesApi.getAll();

      const mapped: Course[] = res.data.map((c: any) => ({
        id: c.course_id,
        title: c.title,
        description: c.description,
        career: c.career_path,
        level: c.level,
        hours: c.duration,
        externalUrl: c.external_url,
        order: c.course_order,
        skillsTaught: c.skills_taught ?? [],
        learningOutcome: c.learning_outcome,
        image: "/placeholder.svg",
      }));

      setCourses(mapped);
    };

    fetchCourses();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);

  // State for Add Sheet
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  // State for Edit Sheet
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.career.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    await coursesApi.delete(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };


  const handleAddCourse = async (data: CourseFormData) => {
    const res = await coursesApi.create(data);

    const c = res.data;

    setCourses((prev) => [
      {
        id: c.course_id,
        title: c.title,
        description: c.description,
        career: c.career_path,
        level: c.level,
        hours: c.duration,
        externalUrl: c.external_url,
        order: c.course_order,
        skillsTaught: c.skills_taught ?? [],
        learningOutcome: c.learning_outcome,
        image: "/placeholder.svg",
      },
      ...prev,
    ]);
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditSheetOpen(true);
  };

  const handleUpdateCourse = async (payload: UpdateCoursePayload) => {
    if (!selectedCourse) return;

    const res = await coursesApi.update(selectedCourse.id, payload);
    const c = res.data;

    setCourses((prev) =>
      prev.map((course) =>
        course.id === c.course_id
          ? {
            id: c.course_id,
            title: c.title,
            description: c.description,
            career: c.career_path,
            level: c.level,
            hours: c.duration,
            externalUrl: c.external_url,
            order: c.course_order,
            skillsTaught: c.skills_taught ?? [],
            learningOutcome: c.learning_outcome,
            image: "/placeholder.svg",
          }
          : course
      )
    );
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

      {/* Form Sheets */}
      <AddCoursesSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        onSubmit={handleAddCourse}
      />

      <EditCoursesSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        onSubmit={handleUpdateCourse}
        course={selectedCourse}
      />

      {/* Table Section */}
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground font-semibold">Image</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Title</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Career Path</TableHead>
              <TableHead className="text-table-header-foreground font-semibold">Level</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Hours</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Edit</TableHead>
              <TableHead className="text-table-header-foreground font-semibold text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow
                key={course.id}
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] transition-colors border-b"
              >
                <TableCell>
                  <div className="h-12 w-20 overflow-hidden rounded-md bg-muted">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{course.title}</TableCell>

                {/* UPDATED: Career Path text color changed to grey (text-muted-foreground) */}
                <TableCell>
                  <span className="text-muted-foreground font-medium">
                    {careerPathLabelMap[course.career] ?? course.career}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-white text-black border-slate-200 hover:bg-white hover:text-black capitalize font-normal"
                  >
                    {course.level}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{course.hours}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-[#4A5DF9] hover:bg-transparent"
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
                    onClick={() => handleDelete(course.id)}
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