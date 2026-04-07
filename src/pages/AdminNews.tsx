import { AdminLayout } from "@/components/admin/AdminLayout";
import { NewsTable } from "@/components/admin/NewsTable";

export default function AdminNews() {
  return (
    <AdminLayout>
      <NewsTable />
    </AdminLayout>
  );
}
