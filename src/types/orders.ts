// API Response Types
export interface ApiOrderResponse {
  synced_new: number;
  orders: ApiOrder[];
}

export interface ApiOrder {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  customerState: string;
  productsPurchased: string;
  fulfillmentDate: string;
  totalPrice: {
    amount: string;
    currency: string;
  };
  callStatus: "Unscheduled" | "Scheduled" | "Completed";
}

// UI Types (what the components expect)
export interface Order {
  id: string;
  customerName: string;
  phone: string;
  products: string;
  orderDate: string;
  deliveryDate: string;
  callStatus: "completed" | "scheduled" | "not_scheduled";
  total: string;
  shippingState?: string;
}

// Utility function to clean product names by removing quantity indicators
export const cleanProductNames = (products: string): string => {
  if (!products || products === "N/A") return products;

  // Remove quantity indicators like x1, x2, x3, etc. and clean up
  return products
    .split(/[,;|&+]/) // Split by common separators
    .map((product) =>
      product
        .trim()
        .replace(/\s*x\d+\s*$/i, "") // Remove quantity indicators like "x1", "x2", etc.
        .replace(/\s*\(\d+\)\s*$/i, "") // Remove quantity in parentheses like "(1)", "(2)", etc.
        .trim()
    )
    .filter((product) => product.length > 0) // Remove empty strings
    .join(", "); // Join back with clean separators
};

// Transform function to convert API data to UI format
export const transformApiOrderToOrder = (apiOrder: ApiOrder): Order => {
  const statusMap: Record<string, "completed" | "scheduled" | "not_scheduled"> =
    {
      Completed: "completed",
      Scheduled: "scheduled",
      Unscheduled: "not_scheduled",
    };

  // Clean order ID - remove # if it exists to avoid double ##
  const cleanOrderId = apiOrder.orderId?.replace(/^#+/, "") || "N/A";

  // Format total price properly
  const formatTotal = () => {
    if (!apiOrder.totalPrice?.amount) return "N/A";
    const currency =
      apiOrder.totalPrice.currency === "USD"
        ? "$"
        : apiOrder.totalPrice.currency;
    return `${currency}${apiOrder.totalPrice.amount}`;
  };

  return {
    id: cleanOrderId,
    customerName: apiOrder.customerName || "N/A",
    phone: apiOrder.phoneNumber || "N/A",
    products: cleanProductNames(apiOrder.productsPurchased || "N/A"),
    orderDate: apiOrder.fulfillmentDate || "N/A",
    deliveryDate: apiOrder.fulfillmentDate || "N/A",
    callStatus: statusMap[apiOrder.callStatus] || "not_scheduled",
    total: formatTotal(),
    shippingState: apiOrder.customerState || "N/A",
  };
};
