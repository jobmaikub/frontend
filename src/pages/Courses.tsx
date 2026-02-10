import { AdminLayout } from "@/components/admin/AdminLayout";
import { CoursesTable } from "@/components/admin/CoursesTable";

const Courses = () => {
  return (
    <AdminLayout>
      <CoursesTable />
    </AdminLayout>
  );
};

export default Courses;
