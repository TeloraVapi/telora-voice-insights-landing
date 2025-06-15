import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// Sample data for charts - current week
const callsScheduledData = [
  { value: 42, pastWeek: 35 },
  { value: 38, pastWeek: 42 },
  { value: 45, pastWeek: 38 },
  { value: 40, pastWeek: 45 },
  { value: 48, pastWeek: 40 },
  { value: 35, pastWeek: 48 },
  { value: 52, pastWeek: 35 },
  { value: 46, pastWeek: 52 },
  { value: 41, pastWeek: 46 },
  { value: 55, pastWeek: 41 },
  { value: 49, pastWeek: 55 },
  { value: 43, pastWeek: 49 },
  { value: 58, pastWeek: 43 },
  { value: 51, pastWeek: 58 },
  { value: 47, pastWeek: 51 },
];

const callsCompletedData = [
  { value: 38, pastWeek: 32 },
  { value: 42, pastWeek: 35 },
  { value: 35, pastWeek: 39 },
  { value: 48, pastWeek: 42 },
  { value: 33, pastWeek: 36 },
  { value: 45, pastWeek: 40 },
  { value: 28, pastWeek: 44 },
  { value: 52, pastWeek: 48 },
  { value: 39, pastWeek: 35 },
  { value: 31, pastWeek: 38 },
  { value: 46, pastWeek: 42 },
  { value: 25, pastWeek: 29 },
  { value: 41, pastWeek: 37 },
  { value: 38, pastWeek: 41 },
  { value: 35, pastWeek: 33 },
];

const callMinutesData = [
  { value: 35, pastWeek: 42 },
  { value: 42, pastWeek: 38 },
  { value: 38, pastWeek: 45 },
  { value: 48, pastWeek: 40 },
  { value: 45, pastWeek: 48 },
  { value: 52, pastWeek: 35 },
  { value: 41, pastWeek: 52 },
  { value: 38, pastWeek: 46 },
  { value: 55, pastWeek: 41 },
  { value: 49, pastWeek: 55 },
  { value: 43, pastWeek: 49 },
  { value: 58, pastWeek: 43 },
  { value: 51, pastWeek: 58 },
  { value: 47, pastWeek: 51 },
  { value: 62, pastWeek: 47 },
];

const SummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Calls Scheduled Card */}
      <Card className="bg-white border border-gray-200 rounded-xl">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-black opacity-80">
              Calls scheduled
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-baseline gap-2 mb-4">
            <div className="text-3xl font-bold text-gray-900">12</div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +80%
            </span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callsScheduledData}>
                <Area
                  type="monotone"
                  dataKey="pastWeek"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  fill="transparent"
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#gradient1)"
                  fillOpacity={0.3}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Calls Completed Card */}
      <Card className="bg-white border border-gray-200 rounded-xl">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-black opacity-80">
              Calls completed
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-baseline gap-2 mb-4">
            <div className="text-3xl font-bold text-gray-900">2</div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +70%
            </span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callsCompletedData}>
                <Area
                  type="monotone"
                  dataKey="pastWeek"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  fill="transparent"
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#gradient2)"
                  fillOpacity={0.3}
                />
                <defs>
                  <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Call Minutes Used Card */}
      <Card className="bg-white border border-gray-200 rounded-xl">
        <CardHeader className="pb-2">
          <div>
            <CardTitle className="text-base font-semibold text-black opacity-80">
              Call minutes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-baseline gap-2 mb-4">
            <div className="text-3xl font-bold text-gray-900">86/100</div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +29%
            </span>
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callMinutesData}>
                <Area
                  type="monotone"
                  dataKey="pastWeek"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  fill="transparent"
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#gradient3)"
                  fillOpacity={0.3}
                />
                <defs>
                  <linearGradient id="gradient3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
