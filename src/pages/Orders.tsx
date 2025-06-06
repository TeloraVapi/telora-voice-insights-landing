import React, { useState } from 'react';
import OrdersSidebar from '@/components/OrdersSidebar';
import ScheduleCallModal from '@/components/ScheduleCallModal';
import OrdersHeader from '@/components/orders/OrdersHeader';
import SummaryCards from '@/components/orders/SummaryCards';
import StatusFilters from '@/components/orders/StatusFilters';
import OrdersTable from '@/components/orders/OrdersTable';
import Pagination from '@/components/orders/Pagination';
import { mockOrders } from '@/data/mockOrders';
import type { Order } from '@/types/orders';
import type { DateRange } from 'react-day-picker';

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState(mockOrders);
  
  const ordersPerPage = 10;
  
  // Filter orders based on selected filter and search term
  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.callStatus === selectedFilter;
    const matchesSearch = order.products.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
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
  
  const handleScheduleCall = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCallScheduled = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, callStatus: 'scheduled' as const }
          : order
      )
    );
  };

  const handleCallDeleted = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, callStatus: 'not_scheduled' as const }
          : order
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OrdersSidebar />
      
      <div className="flex-1 ml-64">
        <OrdersHeader 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterOpen={filterOpen}
          onFilterOpenChange={setFilterOpen}
        />

        <div className="p-8">
          <SummaryCards />
          
          <StatusFilters 
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
          />

          <div className="space-y-0">
            <OrdersTable 
              orders={paginatedOrders}
              onScheduleCall={handleScheduleCall}
            />
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredOrders.length}
              itemsPerPage={ordersPerPage}
              onPageChange={handlePageChange}
            />
          </div>
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
