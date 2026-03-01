export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Pending" | "Inactive";
  joinDate: string;
}

export interface CustomersTableProps {
  customers: Customer[];
}
