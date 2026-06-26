"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 7000 },
  { month: "May", revenue: 6000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Revenue Analytics
        </h2>

        <p className="text-sm text-gray-500">
          Monthly earnings overview
        </p>
      </div>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            <XAxis dataKey="month" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              strokeWidth={4}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}