import { AdminLayout } from "@/components/admin/AdminLayout";
import { CoursesTable } from "@/components/admin/CoursesTable";

export default function AdminCourses() {
  return (
    <AdminLayout>
      <CoursesTable />
    </AdminLayout>
  );
}
