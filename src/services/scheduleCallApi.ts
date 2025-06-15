import API_CONFIG from "@/config/api";

// Use the same JWT token as other APIs
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwMzU2MjY3fQ.uaCcPJG5ZDwGrOjsFzuLNVkpT73n6mwlsxVWyBcx5jw";

const getHeaders = () => ({
  Authorization: `Bearer ${JWT_TOKEN}`,
  "Content-Type": "application/json",
});

// API Request Types
export interface ScheduleCallRequest {
  orderId: string;
  scheduledTimeUtc: string; // ISO 8601 format: "2025-06-13T05:35:00Z"
  assistantId: string;
}

// API Response Types
export interface ScheduleCallResponse {
  success: boolean;
  callId?: string;
  message?: string;
  scheduledTime?: string;
}

class ScheduleCallApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async scheduleCall(
    request: ScheduleCallRequest
  ): Promise<ScheduleCallResponse> {
    try {
      console.log("Scheduling call with data:", request);
      console.log(
        "API endpoint:",
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.SCHEDULE_CALL}`
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.SCHEDULE_CALL}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(request),
        }
      );

      console.log("Schedule call API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Schedule call API error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      // Try to parse the response
      const responseText = await response.text();
      console.log("Schedule call API response text:", responseText);

      let data: Record<string, unknown> = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("Schedule call API response data:", data);
        } catch (parseError) {
          console.log("Response is not JSON, treating as success");
        }
      }

      // Since we got a 200 OK, treat it as success regardless of response format
      return {
        success: true,
        callId: (data.callId as string) || (data.id as string) || "scheduled",
        message: (data.message as string) || "Call scheduled successfully",
        scheduledTime:
          (data.scheduledTime as string) || (data.scheduledAt as string),
      };
    } catch (error) {
      console.error("Failed to schedule call:", error);
      throw error;
    }
  }

  // Helper function to convert Date and time to UTC ISO string
  formatScheduledTime(date: Date, time: string): string {
    // Parse the time (format: "14:00")
    const [hours, minutes] = time.split(":").map(Number);

    // Create a new date with the selected date and time
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);

    // Ensure the scheduled time is in the future
    const now = new Date();
    if (scheduledDate <= now) {
      // If the selected time is in the past, schedule for tomorrow at the same time
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    // Convert to UTC ISO string
    return scheduledDate.toISOString();
  }

  async deleteSchedule(
    callId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      console.log("Deleting schedule for call ID:", callId);
      console.log(
        "API endpoint:",
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.DELETE_SCHEDULE}/${callId}`
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.DELETE_SCHEDULE}/${callId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      console.log("Delete schedule API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete schedule API error:", errorText);

        // Parse error response if it's JSON
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If not JSON, use the raw text
          errorMessage = errorText || errorMessage;
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      // Check if there's a response body
      const responseText = await response.text();
      let responseData = { success: true };

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
          console.log("Delete schedule API response data:", responseData);
        } catch {
          console.log("Delete schedule API response:", responseText);
        }
      }

      console.log(`Schedule for call ${callId} deleted successfully`);
      return {
        success: true,
        message: "Schedule deleted successfully",
      };
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      return {
        success: false,
        message:
          "Failed to delete schedule. Please check your connection and try again.",
      };
    }
  }

  // Helper function to format order ID (ensure it has # prefix)
  formatOrderId(orderId: string): string {
    return orderId.startsWith("#") ? orderId : `#${orderId}`;
  }
}

export const scheduleCallApi = new ScheduleCallApiService();
export default scheduleCallApi;
