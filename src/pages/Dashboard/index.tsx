import { Layout } from "../../components/Layout";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/Badge";

const mockCustomers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "07700 900123",
    status: "Active" as const,
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "07700 900456",
    status: "Active" as const,
    joinDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "07700 900789",
    status: "Pending" as const,
    joinDate: "2024-03-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "07700 900321",
    status: "Active" as const,
    joinDate: "2024-03-22",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "d.wilson@email.com",
    phone: "07700 900654",
    status: "Active" as const,
    joinDate: "2024-04-05",
  },
] as const;

type Customer = (typeof mockCustomers)[number];

export function Dashboard() {
  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (customer: Customer) => customer.name,
      cellClassName:
        "whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900",
    },
    {
      id: "email",
      header: "Email",
      cell: (customer: Customer) => customer.email,
      cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
    },
    {
      id: "phone",
      header: "Phone",
      cell: (customer: Customer) => customer.phone,
      cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
    },
    {
      id: "status",
      header: "Status",
      cell: (customer: Customer) => <StatusBadge status={customer.status} />,
      cellClassName: "whitespace-nowrap px-6 py-4",
    },
    {
      id: "joinDate",
      header: "Joined",
      cell: (customer: Customer) => customer.joinDate,
      cellClassName: "whitespace-nowrap px-6 py-4 text-sm text-gray-600",
    },
  ] as const;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      <div className="w-full">
        <DataTable
          title="Jobs"
          data={mockCustomers}
          columns={columns}
          getRowKey={(customer) => customer.id}
        />
      </div>
    </Layout>
  );
}

export default Dashboard;
