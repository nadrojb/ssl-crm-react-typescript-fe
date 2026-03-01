import { StatusBadge } from "../StatusBadge";
import type { Customer, CustomersTableProps } from "./types";

function CustomerRow({ customer }: { customer: Customer }) {
  return (
    <tr key={customer.id} className="hover:bg-gray-50">
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
        {customer.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {customer.email}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {customer.phone}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <StatusBadge status={customer.status} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
        {customer.joinDate}
      </td>
    </tr>
  );
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-100">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Jobs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
