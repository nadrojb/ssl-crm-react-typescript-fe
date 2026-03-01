import { Layout } from "../../components/Layout";
import { CustomersTable } from "../../components/CustomersTable";

const mockCustomers = [
  { id: 1, name: "John Smith", email: "john.smith@email.com", phone: "07700 900123", status: "Active" as const, joinDate: "2024-01-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah.j@email.com", phone: "07700 900456", status: "Active" as const, joinDate: "2024-02-20" },
  { id: 3, name: "Michael Brown", email: "m.brown@email.com", phone: "07700 900789", status: "Pending" as const, joinDate: "2024-03-10" },
  { id: 4, name: "Emily Davis", email: "emily.d@email.com", phone: "07700 900321", status: "Active" as const, joinDate: "2024-03-22" },
  { id: 5, name: "David Wilson", email: "d.wilson@email.com", phone: "07700 900654", status: "Active" as const, joinDate: "2024-04-05" },
];

export function Dashboard() {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CustomersTable customers={mockCustomers} />
      </div>
    </Layout>
  );
}

export default Dashboard;
