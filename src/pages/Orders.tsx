import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Phone, TrendingUp, Clock, CreditCard, Search, Filter, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrdersSidebar from '@/components/OrdersSidebar';
import ScheduleCallModal from '@/components/ScheduleCallModal';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

// Extended mock data for 35 orders
const mockOrders = [
  {
    id: '61391',
    customerName: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    products: 'Wireless Headphones',
    orderDate: '2024-03-27',
    deliveryDate: '2024-03-24',
    callStatus: 'completed',
    total: '$199'
  },
  {
    id: '61390',
    customerName: 'Mike Chen',
    phone: '+1 (555) 987-6543',
    products: 'Smart Watch Pro, Charging Cable',
    orderDate: '2024-03-27',
    deliveryDate: '2024-03-24',
    callStatus: 'scheduled',
    total: '$449'
  },
  {
    id: '61389',
    customerName: 'Emily Davis',
    phone: '+1 (555) 456-7890',
    products: 'Bluetooth Speaker',
    orderDate: '2024-03-26',
    deliveryDate: '2024-03-23',
    callStatus: 'not_scheduled',
    total: '$89'
  },
  {
    id: '61388',
    customerName: 'David Wilson',
    phone: '+1 (555) 321-0987',
    products: 'Laptop Stand',
    orderDate: '2024-03-24',
    deliveryDate: '2024-03-21',
    callStatus: 'completed',
    total: '$79'
  },
  {
    id: '61387',
    customerName: 'Lisa Thompson',
    phone: '+1 (555) 654-3210',
    products: 'Phone Case, Screen Protector',
    orderDate: '2024-03-24',
    deliveryDate: '2024-03-21',
    callStatus: 'scheduled',
    total: '$34'
  },
  // Adding more mock data for pagination
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `${61360 + i}`,
    customerName: ['Alex Rodriguez', 'Jessica Brown', 'Michael Smith', 'Ashley Garcia', 'Daniel Lee', 'Amanda Martinez', 'Ryan Taylor', 'Nicole Anderson', 'Kevin White', 'Rachel Green'][i % 10],
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    products: ['Wireless Mouse', 'Gaming Keyboard', 'Monitor Stand', 'USB Cable', 'Wireless Charger', 'Phone Holder', 'Desk Lamp', 'Webcam', 'Microphone', 'Tablet Case'][i % 10],
    orderDate: new Date(2024, 2, Math.floor(Math.random() * 25) + 1).toISOString().split('T')[0],
    deliveryDate: new Date(2024, 2, Math.floor(Math.random() * 20) + 1).toISOString().split('T')[0],
    callStatus: ['completed', 'scheduled', 'not_scheduled'][Math.floor(Math.random() * 3)],
    total: `$${Math.floor(Math.random() * 300) + 20}`
  }))
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">✅ Completed</Badge>;
    case 'scheduled':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">🟡 Scheduled</Badge>;
    case 'not_scheduled':
      return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200">⚪ Not Scheduled</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getActionButton = (order: any, onScheduleCall: (order: any) => void) => {
  switch (order.callStatus) {
    case 'completed':
      return (
        <Button 
          size="sm" 
          variant="outline"
          disabled
          className="text-sm h-8 px-3 bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
        >
          Call Completed
        </Button>
      );
    case 'scheduled':
      return (
        <Button 
          size="sm" 
          variant="outline"
          className="text-sm h-8 px-3 border-blue-300 text-blue-700 hover:bg-blue-50"
          onClick={() => onScheduleCall(order)}
        >
          Edit Schedule
        </Button>
      );
    case 'not_scheduled':
      return (
        <Button 
          size="sm" 
          variant="default"
          className="text-sm h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onScheduleCall(order)}
        >
          Schedule Call
        </Button>
      );
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy');
};

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState(mockOrders);
  
  const ordersPerPage = 10;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  // Filter orders based on selected filter and search term
  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.callStatus === selectedFilter;
    const matchesSearch = order.products.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Paginate filtered orders
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleScheduleCall = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCallScheduled = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, callStatus: 'scheduled' }
          : order
      )
    );
  };

  const handleCallDeleted = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, callStatus: 'not_scheduled' }
          : order
      )
    );
  };
  
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
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                />
              </div>
              
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-white border border-gray-200 shadow-lg z-50" align="end">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Call Status</label>
                      <div className="space-y-2">
                        {['completed', 'scheduled', 'not_scheduled'].map((status) => (
                          <label key={status} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-600 capitalize">
                              {status.replace('_', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Sort by</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option>Most Recent</option>
                        <option>Oldest First</option>
                        <option>Highest Price</option>
                        <option>Lowest Price</option>
                      </select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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

          {/* Status Filters */}
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
                    onClick={() => handleFilterChange(filter.value)}
                    className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                      selectedFilter === filter.value
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
          <Card className="min-h-[600px]">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50">
                    <TableHead className="text-left font-semibold text-gray-900 py-4">Customer Name</TableHead>
                    <TableHead className="text-left font-semibold text-gray-900">Phone Number</TableHead>
                    <TableHead className="text-left font-semibold text-gray-900">Product(s) Purchased</TableHead>
                    <TableHead className="text-left font-semibold text-gray-900">Delivery Date</TableHead>
                    <TableHead className="text-left font-semibold text-gray-900">Call Status</TableHead>
                    <TableHead className="text-left font-semibold text-gray-900">Total</TableHead>
                    <TableHead className="text-left font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => (
                    <TableRow 
                      key={order.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="py-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">#{order.id}</div>
                      </TableCell>
                      <TableCell className="text-gray-700">{order.phone}</TableCell>
                      <TableCell>
                        <div className="text-gray-900">{order.products}</div>
                      </TableCell>
                      <TableCell className="text-gray-700">{formatDate(order.deliveryDate)}</TableCell>
                      <TableCell>
                        {getStatusBadge(order.callStatus)}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{order.total}</TableCell>
                      <TableCell>
                        {getActionButton(order, handleScheduleCall)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="h-8"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2 text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ScheduleCallModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        order={selectedOrder}
        onCallScheduled={handleCallScheduled}
        onCallDeleted={handleCallDeleted}
      />
    </div>
  );
};

export default Orders;
