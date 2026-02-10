import { AdminLayout } from "@/components/admin/AdminLayout";
import { UsersTable } from "@/components/admin/UsersTable";

const Users = () => {
  return (
    <AdminLayout>
      <UsersTable />
    </AdminLayout>
  );
};

export default Users;
