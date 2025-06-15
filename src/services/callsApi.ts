import API_CONFIG from "@/config/api";

// Use the same JWT token as orders API
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwMzU2MjY3fQ.uaCcPJG5ZDwGrOjsFzuLNVkpT73n6mwlsxVWyBcx5jw";

const getHeaders = () => ({
  Authorization: `Bearer ${JWT_TOKEN}`,
  "Content-Type": "application/json",
});

// API Response Types (what the backend actually returns)
export interface ApiCall {
  id: number;
  orderId: string;
  assistantId: string;
  assistantName: string;
  customerName: string;
  phoneNumber: string;
  product: string;
  scheduledTime: string;
  status: string;
  transcript: string | null;
  summary: string | null;
  audioUrl: string | null;
  createdAt: string;
}

export interface ApiCallsResponse {
  calls: ApiCall[];
  total: number;
}

// UI Types (what the components expect)
export interface Call {
  id: string;
  customerName: string;
  orderId: string;
  assistantName: string;
  phoneNumber: string;
  productName: string;
  status: "completed" | "in_progress" | "scheduled" | "failed";
  transcript: string;
  summary: string;
  audioUrl: string;
  duration?: string;
  callDate?: string;
  createdAt?: string;
}

export interface CallsResponse {
  calls: Call[];
  totalCalls: number;
  successfulCalls: number;
  successRate: number;
  avgDuration: string;
}

export interface AnalyticsData {
  name: string;
  totalCalls: number;
  successfulCalls: number;
}

// Transform function to convert API data to UI format
const transformApiCallToCall = (apiCall: ApiCall): Call => {
  // Normalize status to lowercase for consistency
  const normalizedStatus = apiCall.status.toLowerCase();
  let uiStatus: "completed" | "in_progress" | "scheduled" | "failed";

  switch (normalizedStatus) {
    case "completed":
      uiStatus = "completed";
      break;
    case "in_progress":
    case "in progress":
      uiStatus = "in_progress";
      break;
    case "scheduled":
      uiStatus = "scheduled";
      break;
    case "failed":
      uiStatus = "failed";
      break;
    default:
      uiStatus = "scheduled"; // Default fallback
  }

  // Clean up product name by removing quantity (e.g., "x1", "x2", etc.)
  const cleanProductName = (product: string) => {
    if (!product) return "N/A";
    // Remove patterns like " x1", " x2", etc. at the end of the string
    return product.replace(/\s+x\d+$/i, "").trim();
  };

  return {
    id: apiCall.id.toString(),
    customerName: apiCall.customerName || "N/A",
    orderId: apiCall.orderId || "N/A",
    assistantName: apiCall.assistantName || "N/A",
    phoneNumber: apiCall.phoneNumber || "N/A",
    productName: cleanProductName(apiCall.product),
    status: uiStatus,
    transcript: apiCall.transcript || "No transcript available",
    summary: apiCall.summary || "No summary available",
    audioUrl: apiCall.audioUrl || "",
    duration: "N/A", // Duration not provided in API response
    callDate: apiCall.scheduledTime || apiCall.createdAt || "N/A",
    createdAt: apiCall.createdAt,
  };
};

class CallsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async fetchCalls(): Promise<CallsResponse> {
    try {
      console.log(
        "Fetching calls from:",
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.CALLS}`
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.CALLS}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      console.log("Calls API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiCallsResponse = await response.json();
      console.log("Calls API response data:", data);

      // Transform API data to UI format
      const transformedCalls = data.calls?.map(transformApiCallToCall) || [];

      // Calculate stats if not provided by API
      const totalCalls = data.total || transformedCalls.length;
      const successfulCalls = transformedCalls.filter(
        (call) => call.status === "completed"
      ).length;
      const successRate =
        totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0;

      return {
        calls: transformedCalls,
        totalCalls,
        successfulCalls,
        successRate,
        avgDuration: "2m 45s",
      };
    } catch (error) {
      console.error("Failed to fetch calls:", error);
      // Return mock data as fallback
      return this.getMockCallsData();
    }
  }

  async fetchCallAnalytics(): Promise<AnalyticsData[]> {
    try {
      console.log(
        "Fetching call analytics from:",
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.CALL_ANALYTICS}`
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.CALL_ANALYTICS}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      console.log("Analytics API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Analytics API response data:", data);

      return data.analytics || data || [];
    } catch (error) {
      console.error("Failed to fetch call analytics:", error);
      return this.getMockAnalyticsData();
    }
  }

  private getMockCallsData(): CallsResponse {
    const calls: Call[] = [
      {
        id: "CALL-001",
        customerName: "Sarah Johnson",
        orderId: "61391",
        assistantName: "Alex Thompson",
        phoneNumber: "+1 (555) 123-4567",
        productName: "Wireless Headphones Pro",
        status: "completed",
        transcript:
          "Customer was very satisfied with the product quality and delivery speed. Mentioned the sound quality exceeded expectations. Asked about warranty coverage and was provided with detailed information. Customer expressed interest in purchasing additional accessories.",
        summary:
          "Positive feedback on product quality and delivery experience. Customer likely to recommend. Interested in accessories.",
        audioUrl: "https://example.com/audio/call-001.mp3",
        duration: "3m 24s",
        callDate: "2024-01-15T10:30:00Z",
      },
      {
        id: "CALL-002",
        customerName: "Mike Chen",
        orderId: "61390",
        assistantName: "Emma Rodriguez",
        phoneNumber: "+1 (555) 987-6543",
        productName: "Smart Watch Pro",
        status: "in_progress",
        transcript:
          "Call currently in progress. Customer discussing setup issues with the watch connectivity. Troubleshooting Bluetooth pairing problems. Assistant providing step-by-step guidance.",
        summary: "Technical support call in progress regarding device setup.",
        audioUrl: "https://example.com/audio/call-002.mp3",
        duration: "2m 15s",
        callDate: "2024-01-15T14:45:00Z",
      },
      {
        id: "CALL-003",
        customerName: "Emily Davis",
        orderId: "61389",
        assistantName: "James Wilson",
        phoneNumber: "+1 (555) 456-7890",
        productName: "Bluetooth Speaker",
        status: "scheduled",
        transcript:
          "Call scheduled for tomorrow at 2:00 PM EST. Customer requested feedback call to discuss product experience.",
        summary: "Follow-up call scheduled to gather product feedback.",
        audioUrl: "https://example.com/audio/call-003.mp3",
        duration: "N/A",
        callDate: "2024-01-16T14:00:00Z",
      },
      {
        id: "CALL-004",
        customerName: "David Wilson",
        orderId: "61388",
        assistantName: "Sophie Martinez",
        phoneNumber: "+1 (555) 321-0987",
        productName: "Laptop Stand Deluxe",
        status: "failed",
        transcript:
          "Customer was not available. Left voicemail requesting callback. Attempted contact at scheduled time but no response. Will retry tomorrow.",
        summary:
          "Unsuccessful contact attempt. Customer unavailable for feedback call. Retry scheduled.",
        audioUrl: "https://example.com/audio/call-004.mp3",
        duration: "0m 45s",
        callDate: "2024-01-15T16:20:00Z",
      },
      {
        id: "CALL-005",
        customerName: "Lisa Thompson",
        orderId: "61387",
        assistantName: "Marcus Johnson",
        phoneNumber: "+1 (555) 654-3210",
        productName: "Phone Case Bundle",
        status: "completed",
        transcript:
          "Customer reported minor issue with case fit but overall satisfied. Requested information about warranty coverage. Provided detailed warranty terms and return policy. Customer appreciated the quick resolution.",
        summary:
          "Minor product concern addressed. Customer satisfied with resolution and warranty information.",
        audioUrl: "https://example.com/audio/call-005.mp3",
        duration: "4m 12s",
        callDate: "2024-01-15T11:15:00Z",
      },
    ];

    return {
      calls,
      totalCalls: 728,
      successfulCalls: 612,
      successRate: 84,
      avgDuration: "2m 45s",
    };
  }

  private getMockAnalyticsData(): AnalyticsData[] {
    return [
      { name: "Jan 1", totalCalls: 7, successfulCalls: 5 },
      { name: "Jan 8", totalCalls: 34, successfulCalls: 31 },
      { name: "Jan 15", totalCalls: 12, successfulCalls: 8 },
      { name: "Jan 22", totalCalls: 45, successfulCalls: 37 },
      { name: "Jan 29", totalCalls: 8, successfulCalls: 7 },
      { name: "Feb 5", totalCalls: 22, successfulCalls: 14 },
      { name: "Feb 12", totalCalls: 56, successfulCalls: 52 },
      { name: "Feb 19", totalCalls: 13, successfulCalls: 11 },
      { name: "Feb 26", totalCalls: 67, successfulCalls: 49 },
      { name: "Mar 5", totalCalls: 19, successfulCalls: 18 },
      { name: "Mar 12", totalCalls: 3, successfulCalls: 2 },
      { name: "Mar 19", totalCalls: 41, successfulCalls: 38 },
      { name: "Mar 26", totalCalls: 28, successfulCalls: 19 },
      { name: "Apr 2", totalCalls: 59, successfulCalls: 44 },
      { name: "Apr 9", totalCalls: 15, successfulCalls: 15 },
      { name: "Apr 16", totalCalls: 71, successfulCalls: 67 },
      { name: "Apr 23", totalCalls: 24, successfulCalls: 16 },
      { name: "Apr 30", totalCalls: 9, successfulCalls: 8 },
      { name: "May 7", totalCalls: 38, successfulCalls: 35 },
      { name: "May 14", totalCalls: 52, successfulCalls: 31 },
      { name: "May 21", totalCalls: 16, successfulCalls: 14 },
      { name: "May 28", totalCalls: 43, successfulCalls: 41 },
      { name: "Jun 4", totalCalls: 29, successfulCalls: 22 },
      { name: "Jun 11", totalCalls: 11, successfulCalls: 9 },
      { name: "Jun 18", totalCalls: 65, successfulCalls: 58 },
    ];
  }
}

export const callsApi = new CallsApiService();
export default callsApi;
