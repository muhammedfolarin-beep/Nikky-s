import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Revenue", value: "$45,231.89", icon: <DollarSign size={20} className="text-green-600" />, trend: "+20.1% from last month" },
          { title: "Active Users", value: "+2350", icon: <Users size={20} className="text-blue-600" />, trend: "+180.1% from last month" },
          { title: "Sales", value: "+12,234", icon: <BarChart3 size={20} className="text-purple-600" />, trend: "+19% from last month" },
          { title: "Conversion Rate", value: "3.2%", icon: <TrendingUp size={20} className="text-orange-600" />, trend: "+1.2% from last month" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-96 flex items-center justify-center flex-col">
        <BarChart3 size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Chart</h3>
        <p className="text-gray-500 text-sm">Real-time charting will appear here once live order data is sufficient.</p>
      </div>
    </div>
  );
}
