import React, { useState, useEffect } from "react";
import ScheduleCallModal from "@/components/ScheduleCallModal";
import PageHeader from "@/components/PageHeader";
import SummaryCards from "@/components/orders/SummaryCards";
import StatusFilters from "@/components/orders/StatusFilters";
import OrdersTable from "@/components/orders/OrdersTable";
import Pagination from "@/components/orders/Pagination";
import { ordersApi } from "@/services/ordersApi";
import type { Order } from "@/types/orders";
import type { DateRange } from "react-day-picker";

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ordersPerPage = 10;

  // Fetch orders function
  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const fetchedOrders = await ordersApi.fetchOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on selected filter and search term
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      selectedFilter === "all" || order.callStatus === selectedFilter;
    const matchesSearch = order.products
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Paginate filtered orders
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

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

  const handleCallScheduled = async (orderId: string) => {
    try {
      // Update the order status in the backend
      await ordersApi.updateOrderCallStatus(orderId, "scheduled");

      // Refresh orders data from API to get the latest state
      await fetchOrders(false); // Don't show loading spinner for refresh

      console.log("Order status updated and data refreshed");
    } catch (err) {
      console.error("Failed to update order status:", err);
      // Fallback to local state update if API call fails
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, callStatus: "scheduled" as const }
            : order
        )
      );
    }
  };

  const handleCallDeleted = async (orderId: string) => {
    try {
      // Update the order status in the backend
      await ordersApi.updateOrderCallStatus(orderId, "not_scheduled");

      // Refresh orders data from API to get the latest state
      await fetchOrders(false); // Don't show loading spinner for refresh

      console.log("Order status updated and data refreshed");
    } catch (err) {
      console.error("Failed to update order status:", err);
      // Fallback to local state update if API call fails
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, callStatus: "not_scheduled" as const }
            : order
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="Orders"
          searchPlaceholder="Search by product name..."
          onSearch={() => {}} // Disabled while loading
          onFilterClick={() => console.log("Filter clicked")}
          onDatePickerClick={() => console.log("Date picker clicked")}
        />
        <div className="mt-6 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="Orders"
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
              Failed to load orders
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
    <div className="p-6">
      <PageHeader
        title="Orders"
        searchPlaceholder="Search by product name..."
        onSearch={setSearchTerm}
        onFilterClick={() => console.log("Filter clicked")}
        onDatePickerClick={() => console.log("Date picker clicked")}
      />

      <div className="mt-6">
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
