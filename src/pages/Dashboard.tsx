import React, { useState, useEffect } from "react";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Settings,
  TrendingUp,
  TrendingDown,
  Building2,
  PiggyBank,
  Receipt,
  MoreHorizontal,
  ArrowUpDown,
  CreditCard,
  Filter,
  Play,
  Phone,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";
import PageHeader from "../components/PageHeader";
import CallDetailsDrawer from "../components/CallDetailsDrawer";
import {
  callsApi,
  type Call,
  type CallsResponse,
  type AnalyticsData,
} from "@/services/callsApi";

// Data for call minutes pie chart
const callMinutesData = [
  { name: "Used", value: 80, color: "#6366f1" },
  { name: "Remaining", value: 20, color: "#93c5fd" },
];

const Dashboard = () => {
  const [callsData, setCallsData] = useState<Call[]>([]);
  const [callsStats, setCallsStats] = useState<CallsResponse | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<
    "transcript" | "summary" | "audio"
  >("transcript");

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch calls and analytics data in parallel
        const [callsResponse, analytics] = await Promise.all([
          callsApi.fetchCalls(),
          callsApi.fetchCallAnalytics(),
        ]);

        // Sort calls by creation date (newest first)
        const sortedCalls = callsResponse.calls.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.callDate || a.id);
          const dateB = new Date(b.createdAt || b.callDate || b.id);
          return dateB.getTime() - dateA.getTime();
        });

        setCallsData(sortedCalls);
        setCallsStats(callsResponse);
        setAnalyticsData(analytics);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard data"
        );
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCallClick = (
    call: Call,
    tab: "transcript" | "summary" | "audio" = "transcript"
  ) => {
    setSelectedCall(call);
    setInitialTab(tab);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCall(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <PageHeader
          title="Dashboard"
          searchPlaceholder="Search by product name..."
          onSearch={() => {}} // Disabled while loading
          onFilterClick={() => console.log("Filter clicked")}
          onDatePickerClick={() => console.log("Date picker clicked")}
        />
        <div className="mt-6 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <PageHeader
          title="Dashboard"
          searchPlaceholder="Search by product name..."
          onSearch={() => {}} // Disabled on error
          onFilterClick={() => console.log("Filter clicked")}
          onDatePickerClick={() => console.log("Date picker clicked")}
        />
        <div className="mt-6 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to load dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        searchPlaceholder="Search by product name..."
        onSearch={(value) => console.log("Search:", value)}
        onFilterClick={() => console.log("Filter clicked")}
        onDatePickerClick={() => console.log("Date picker clicked")}
      />

      {/* Top Row - Analytics (70%) and Call Minutes (30%) */}
      <div className="grid grid-cols-10 gap-6 mb-6">
        {/* Call Analytics Chart - 70% width */}
        <div className="col-span-7">
          <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Analytics
              </h2>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {callsStats?.totalCalls || 0}
                </div>
                <div className="text-xs text-gray-500">Total Calls</div>
                <div className="text-xs text-green-600 mt-1">+23%</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {callsStats?.successfulCalls || 0}
                </div>
                <div className="text-xs text-gray-500">Successful</div>
                <div className="text-xs text-green-600 mt-1">+18%</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {callsStats?.successRate || 0}%
                </div>
                <div className="text-xs text-gray-500">Success Rate</div>
                <div className="text-xs text-red-600 mt-1">-5%</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {callsStats?.avgDuration || "N/A"}
                </div>
                <div className="text-xs text-gray-500">Avg Duration</div>
                <div className="text-xs text-red-600 mt-1">-8%</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorTotalCalls"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorSuccessfulCalls"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                    domain={[0, 80]}
                    tickFormatter={(value: number) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} calls`,
                      name === "totalCalls"
                        ? "Total Calls"
                        : "Successful Calls",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="successfulCalls"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSuccessfulCalls)"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalCalls"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotalCalls)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Call Minutes Chart - 30% width */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Call Minutes
              </h3>
              <p className="text-sm text-gray-500">Monthly usage breakdown</p>
            </div>

            {/* Pie Chart - Same height as Analytics chart */}
            <div className="relative h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={callMinutesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {callMinutesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} mins (${name === "Used" ? "80%" : "20%"})`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100</div>
                  <div className="text-sm text-gray-500">Total Minutes</div>
                </div>
              </div>
            </div>

            {/* Simple Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="text-sm font-medium text-gray-700">Used</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <span className="text-sm font-medium text-gray-700">
                  Remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Calls Table Full Width */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Calls</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm font-medium">Sort</span>
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          {/* Table Header */}
          <div
            className="grid gap-4 text-xs font-semibold text-gray-900 opacity-80 pb-3 border-b border-gray-200 bg-gray-50 px-4 py-3 rounded-t-lg"
            style={{
              gridTemplateColumns:
                "1.2fr 1fr 1.1fr 1.3fr 0.8fr 1.8fr 1.8fr 0.8fr",
            }}
          >
            <div>CUSTOMER</div>
            <div>ASSISTANT</div>
            <div>PHONE</div>
            <div>PRODUCT</div>
            <div>STATUS</div>
            <div>TRANSCRIPT</div>
            <div>SUMMARY</div>
            <div className="text-right">AUDIO</div>
          </div>

          {/* Table Body */}
          <div className="space-y-0">
            {callsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No calls found
                </h3>
                <p className="text-gray-500 max-w-sm">
                  There are no calls to display at the moment. Calls will appear
                  here once they are made.
                </p>
              </div>
            ) : (
              callsData.map((call, index) => (
                <div
                  key={call.id}
                  className="grid gap-4 py-4 px-4 items-center hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
                  style={{
                    gridTemplateColumns:
                      "1.2fr 1fr 1.1fr 1.3fr 0.8fr 1.8fr 1.8fr 0.8fr",
                  }}
                >
                  {/* Customer Name & Order ID */}
                  <div>
                    <div className="font-medium text-gray-700 text-sm">
                      {call.customerName}
                    </div>
                    <div className="text-sm text-violet-600 opacity-70">
                      {call.orderId}
                    </div>
                  </div>

                  {/* Assistant Name */}
                  <div className="text-gray-600 text-sm">
                    {call.assistantName}
                  </div>

                  {/* Phone Number */}
                  <div className="text-gray-600 text-sm">
                    {call.phoneNumber}
                  </div>

                  {/* Product Name */}
                  <div className="text-gray-700 text-sm">
                    {call.productName}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        call.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : call.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : call.status === "scheduled"
                          ? "bg-violet-100 text-violet-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {call.status === "in_progress"
                        ? "In Progress"
                        : call.status.charAt(0).toUpperCase() +
                          call.status.slice(1)}
                    </span>
                  </div>

                  {/* Transcript - Clickable */}
                  <div className="text-gray-600 text-sm">
                    <button
                      onClick={() => handleCallClick(call, "transcript")}
                      className="text-left hover:text-violet-600 transition-colors"
                    >
                      <div
                        className="truncate max-w-[200px]"
                        title="Click to view full transcript"
                      >
                        {call.transcript}
                      </div>
                    </button>
                  </div>

                  {/* Summary - Clickable */}
                  <div className="text-gray-600 text-sm">
                    <button
                      onClick={() => handleCallClick(call, "summary")}
                      className="text-left hover:text-violet-600 transition-colors"
                    >
                      <div
                        className="truncate max-w-[200px]"
                        title="Click to view full summary"
                      >
                        {call.summary}
                      </div>
                    </button>
                  </div>

                  {/* Audio Play Button */}
                  <div className="flex justify-end">
                    <button
                      className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md group"
                      onClick={() => handleCallClick(call, "audio")}
                      title="Play audio recording"
                    >
                      <Play className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200 ml-0.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Call Details Drawer */}
      <CallDetailsDrawer
        call={selectedCall}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        initialTab={initialTab}
      />
    </div>
  );
};

export default Dashboard;
