
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Phone, TrendingUp, Clock, CreditCard, Search, Filter } from 'lucide-react';
import OrdersSidebar from '@/components/OrdersSidebar';

// Mock data for orders
const mockOrders = [
  {
    id: '61391',
    customerName: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    products: 'Wireless Headphones',
    orderDate: '27/06/24',
    deliveryDate: '3 days ago',
    callStatus: 'completed',
    total: '$199'
  },
  {
    id: '61390',
    customerName: 'Mike Chen',
    phone: '+1 (555) 987-6543',
    products: 'Smart Watch Pro, Charging Cable',
    orderDate: '27/06/24',
    deliveryDate: '3 days ago',
    callStatus: 'scheduled',
    total: '$449'
  },
  {
    id: '61389',
    customerName: 'Emily Davis',
    phone: '+1 (555) 456-7890',
    products: 'Bluetooth Speaker',
    orderDate: '26/06/24',
    deliveryDate: '4 days ago',
    callStatus: 'not_scheduled',
    total: '$89'
  },
  {
    id: '61388',
    customerName: 'David Wilson',
    phone: '+1 (555) 321-0987',
    products: 'Laptop Stand',
    orderDate: '24/06/24',
    deliveryDate: '6 days ago',
    callStatus: 'completed',
    total: '$79'
  },
  {
    id: '61387',
    customerName: 'Lisa Thompson',
    phone: '+1 (555) 654-3210',
    products: 'Phone Case, Screen Protector',
    orderDate: '24/06/24',
    deliveryDate: '6 days ago',
    callStatus: 'scheduled',
    total: '$34'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case 'scheduled':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Scheduled</Badge>;
    case 'not_scheduled':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">Not Scheduled</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OrdersSidebar />
      
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
              <p className="text-gray-600 mt-1">Manage voice feedback calls for your orders</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Calls Scheduled</CardTitle>
                <Phone className="h-4 w-4 text-gray-400" />
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
                <TrendingUp className="h-4 w-4 text-gray-400" />
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
                <Clock className="h-4 w-4 text-gray-400" />
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
                <CardTitle className="text-sm font-medium text-gray-600">Call Credits Used</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">127 / 500</div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  25% of monthly limit
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex rounded-lg bg-gray-100 p-1">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'not_scheduled', label: 'Not Scheduled' }
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedFilter === filter.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Last 30 days</span>
            </div>
          </div>

          {/* Orders Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-left font-medium text-gray-900">Customer Name</TableHead>
                  <TableHead className="text-left font-medium text-gray-900">Phone Number</TableHead>
                  <TableHead className="text-left font-medium text-gray-900">Product(s) Purchased</TableHead>
                  <TableHead className="text-left font-medium text-gray-900">Order Date</TableHead>
                  <TableHead className="text-left font-medium text-gray-900">Delivery Date</TableHead>
                  <TableHead className="text-left font-medium text-gray-900">Call Status</TableHead>
                  <TableHead className="text-left font-medium text-gray-900">Total</TableHead>
                  <TableHead className="text-left font-medium text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">#{order.id}</div>
                    </TableCell>
                    <TableCell className="text-gray-700">{order.phone}</TableCell>
                    <TableCell>
                      <div className="text-gray-900">{order.products}</div>
                    </TableCell>
                    <TableCell className="text-gray-700">{order.orderDate}</TableCell>
                    <TableCell className="text-gray-700">{order.deliveryDate}</TableCell>
                    <TableCell>
                      {getStatusBadge(order.callStatus)}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{order.total}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant={order.callStatus === 'not_scheduled' ? 'default' : 'outline'}
                        className="text-sm"
                      >
                        {order.callStatus === 'not_scheduled' ? 'Schedule Call' : 'Edit Call'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing 1 to 5 of 127 orders
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="default" size="sm" className="w-8 h-8 p-0">1</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
                <span className="px-2 text-gray-400">...</span>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">13</Button>
              </div>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
