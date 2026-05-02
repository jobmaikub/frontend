import { AdminLayout } from "@/components/admin/AdminLayout";
import { LessonsTable } from "@/components/admin/LessonsTable";

export default function AdminLessons() {
  return (
    <AdminLayout>
      <LessonsTable />
    </AdminLayout>
  );
}
