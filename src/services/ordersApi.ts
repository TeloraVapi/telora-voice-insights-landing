import API_CONFIG from "@/config/api";
import type { ApiOrderResponse, Order } from "@/types/orders";
import { transformApiOrderToOrder } from "@/types/orders";

// Use the same JWT token as assistants API
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwMzU2MjY3fQ.uaCcPJG5ZDwGrOjsFzuLNVkpT73n6mwlsxVWyBcx5jw";

const getHeaders = () => ({
  Authorization: `Bearer ${JWT_TOKEN}`,
  "Content-Type": "application/json",
});

class OrdersApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async fetchOrders(): Promise<Order[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.ORDERS}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiOrderResponse = await response.json();

      // Transform API data to UI format
      return data.orders.map(transformApiOrderToOrder);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw error;
    }
  }

  async updateOrderCallStatus(
    orderId: string,
    status: "scheduled" | "not_scheduled"
  ): Promise<void> {
    try {
      // This endpoint might need to be implemented on the backend
      const response = await fetch(
        `${this.baseUrl}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            callStatus: status === "scheduled" ? "Scheduled" : "Unscheduled",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      throw error;
    }
  }
}

export const ordersApi = new OrdersApiService();
export default ordersApi;
