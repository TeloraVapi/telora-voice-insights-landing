// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://0.0.0.0:8000",
  ENDPOINTS: {
    ORDERS: "/api/orders/sync",
    CALLS: "/calls",
    CALL_ANALYTICS: "/calls/analytics",
    ASSISTANTS: "/api/assistants",
    CREATE_ASSISTANT: "/api/assistants/create",
    DELETE_ASSISTANT: "/api/assistants",
    SCHEDULE_CALL: "/calls/schedule",
    DELETE_SCHEDULE: "/calls", // Will append /{id} for specific call
  },
};

export default API_CONFIG;
