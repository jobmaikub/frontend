import { AdminLayout } from "@/components/admin/AdminLayout";
import { UsersTable } from "@/components/admin/UsersTable";

export default function AdminUsers() {
  return (
    <AdminLayout>
      <UsersTable />
    </AdminLayout>
  );
}
