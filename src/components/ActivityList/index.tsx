import { FileText, Shield, UserPlus, DollarSign } from "lucide-react";

const activities = [
  { id: 1, type: "policy", message: "New policy created for John Smith", time: "2 hours ago", icon: Shield },
  { id: 2, type: "quote", message: "Quote #1234 generated for Sarah Johnson", time: "4 hours ago", icon: FileText },
  { id: 3, type: "customer", message: "New customer Michael Brown registered", time: "6 hours ago", icon: UserPlus },
  { id: 4, type: "payment", message: "Payment of £450 received from Emily Davis", time: "1 day ago", icon: DollarSign },
  { id: 5, type: "policy", message: "Policy renewed for David Wilson", time: "2 days ago", icon: Shield },
];

export function ActivityList() {
  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-100">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <ul className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
              <activity.icon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
