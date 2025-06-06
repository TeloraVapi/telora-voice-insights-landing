import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, TrendingUp, Clock, CreditCard } from 'lucide-react';

const SummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Calls Scheduled</CardTitle>
          <Phone className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">127</div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% from last week
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Calls Completed</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">94</div>
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +8% from last week
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Pending Calls</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">33</div>
          <div className="flex items-center text-xs text-red-600 mt-1">
            <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
            -3% from last week
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Call Minutes Used</CardTitle>
          <CreditCard className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">350 / 500</div>
          <div className="flex items-center text-xs text-gray-600 mt-1">
            70% of monthly minutes
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards; 