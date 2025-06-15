import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  Clock,
  Target,
} from "lucide-react";

// Main analytics data with dramatic spikes - only showing data up to current month (June 2025)
const assistantPerformanceData = [
  { date: "Jan 25", calls: 8, competitors: 5 },
  { date: "Feb 25", calls: 12, competitors: 7 },
  { date: "Mar 25", calls: 18, competitors: 9 },
  { date: "Apr 25", calls: 35, competitors: 12 }, // Big spike!
  { date: "May 25", calls: 25, competitors: 15 },
  { date: "Jun 25", calls: 42, competitors: 18 }, // Current month peak!
];

// Data for circular charts with meaningful categories
const assistantStatusData = [
  { name: "Active", value: 8, color: "#8b5cf6" },
  { name: "Inactive", value: 2, color: "#e5e7eb" },
];

const satisfactionData = [
  { name: "Excellent (5★)", value: 65, color: "#10b981" },
  { name: "Good (4★)", value: 25, color: "#f59e0b" },
  { name: "Poor (1-3★)", value: 10, color: "#ef4444" },
];

const responseTimeData = [
  { name: "Fast (<0.5s)", value: 70, color: "#10b981" },
  { name: "Medium (0.5-2s)", value: 25, color: "#f59e0b" },
  { name: "Slow (>2s)", value: 5, color: "#ef4444" },
];

const aiCapabilityData = [
  { name: "Advanced", value: 6, color: "#8b5cf6" },
  { name: "Standard", value: 3, color: "#6366f1" },
  { name: "Basic", value: 1, color: "#a855f7" },
];

const AssistantsSummaryCards = () => {
  return (
    <div className="space-y-6 mb-8">
      {/* Main Analytics Chart with Dramatic Spikes */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Analytics Overview
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">42</span>
                <span className="text-sm font-medium text-green-600">+68%</span>
              </div>
              <p className="text-sm text-gray-600">Total Calls</p>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">40</span>
                <span className="text-sm font-medium text-green-600">+67%</span>
              </div>
              <p className="text-sm text-gray-600">Successful Calls</p>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">95.2%</span>
                <span className="text-sm font-medium text-green-600">
                  +2.1%
                </span>
              </div>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Chart with Dramatic Spikes */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={assistantPerformanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="competitorGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d1d5db" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                domain={[0, "dataMax + 10"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="competitors"
                stroke="#d1d5db"
                strokeWidth={2}
                fill="url(#competitorGradient)"
                name="Competitors"
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#callsGradient)"
                name="Our Performance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Supporting Metrics with Legends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Assistants */}
        <Card className="p-6 bg-white border border-gray-200">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Active Assistants
            </p>
          </div>
          <div className="h-32 flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assistantStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assistantStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} assistants`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-violet-600"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-gray-600">Inactive</span>
            </div>
          </div>
        </Card>

        {/* Satisfaction Score */}
        <Card className="p-6 bg-white border border-gray-200">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Satisfaction Score
            </p>
          </div>
          <div className="h-32 flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-gray-600">Excellent</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Good</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Poor</span>
            </div>
          </div>
        </Card>

        {/* Response Time */}
        <Card className="p-6 bg-white border border-gray-200">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
              Response Time
            </p>
          </div>
          <div className="h-32 flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={responseTimeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {responseTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-gray-600">Fast</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Slow</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssistantsSummaryCards;
