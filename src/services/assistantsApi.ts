import API_CONFIG from "@/config/api";
import type { Assistant } from "@/types/assistants";

// Use the same JWT token as other APIs
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwMzU2MjY3fQ.uaCcPJG5ZDwGrOjsFzuLNVkpT73n6mwlsxVWyBcx5jw";

const getHeaders = () => ({
  Authorization: `Bearer ${JWT_TOKEN}`,
  "Content-Type": "application/json",
});

// API Response Types (based on actual API response)
export interface ApiAssistant {
  id: string;
  name: string;
  product_name: string;
  questions: string[];
  created_at: string;
}

// UI Types are imported from @/types/assistants

// Create Assistant Request Types
export interface CreateAssistantRequest {
  name: string;
  product_name: string;
  questions: string[];
}

// Create Assistant Response Types
export interface CreateAssistantResponse {
  message: string;
  id?: string;
  name?: string;
  product_name?: string;
  questions?: string[];
  created_at?: string;
}

// Transform function to convert API data to UI format
const transformApiAssistantToAssistant = (
  apiAssistant: ApiAssistant
): Assistant => {
  return {
    id: apiAssistant.id,
    name: apiAssistant.name,
    product: apiAssistant.product_name,
    questionsCount: apiAssistant.questions?.length || 0,
    questions: apiAssistant.questions || [],
    createdAt: apiAssistant.created_at,
    isActive: true,
    totalCalls: 0, // Default value since API doesn't provide this yet
    successRate: 0, // Default value since API doesn't provide this yet
    lastUsed: "Never", // Default value since API doesn't provide this yet
    status: "active" as const,
  };
};

class AssistantsApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  async fetchAssistants(): Promise<Assistant[]> {
    try {
      console.log(
        "Fetching assistants from:",
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.ASSISTANTS}`
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.ASSISTANTS}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      console.log("Assistants API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiAssistant[] = await response.json();
      console.log("Assistants API response data:", data);

      // Transform API data to UI format
      const transformedAssistants = data.map(transformApiAssistantToAssistant);

      // Sort by creation date (newest first)
      const sortedAssistants = transformedAssistants.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Newest first
      });

      return sortedAssistants;
    } catch (error) {
      console.error("Failed to fetch assistants:", error);
      // Return mock data as fallback
      return this.getMockAssistants();
    }
  }

  async createAssistant(assistantData: {
    name: string;
    product: string;
    questions: string[];
  }): Promise<Assistant> {
    try {
      const requestBody: CreateAssistantRequest = {
        name: assistantData.name,
        product_name: assistantData.product,
        questions: assistantData.questions,
      };

      console.log("Creating assistant with data:", requestBody);
      console.log(
        "API endpoint:",
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.CREATE_ASSISTANT}`
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.CREATE_ASSISTANT}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Create assistant API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create assistant API error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data: CreateAssistantResponse = await response.json();
      console.log("Create assistant API response data:", data);

      // Since the API only returns a success message, we'll create a UI representation
      // with the data we sent, plus a generated ID
      const transformedAssistant: Assistant = {
        id: data.id || `assistant-${Date.now()}`, // Use API ID if available, otherwise generate one
        name: data.name || assistantData.name,
        product: data.product_name || assistantData.product,
        questionsCount: assistantData.questions.length,
        questions: assistantData.questions,
        createdAt: new Date().toISOString(),
        isActive: true,
        totalCalls: 0,
        successRate: 0,
        lastUsed: "Never",
        status: "active" as const,
      };

      return transformedAssistant;
    } catch (error) {
      console.error("Failed to create assistant:", error);
      throw error;
    }
  }

  async fetchAssistantDetails(assistantId: string): Promise<Assistant> {
    try {
      // For now, just return the assistant from the list
      // In the future, this could be a separate API endpoint
      const assistants = await this.fetchAssistants();
      const assistant = assistants.find((a) => a.id === assistantId);
      if (!assistant) {
        throw new Error(`Assistant with ID ${assistantId} not found`);
      }
      return assistant;
    } catch (error) {
      console.error("Failed to fetch assistant details:", error);
      throw error;
    }
  }

  async updateAssistantStatus(
    assistantId: string,
    isActive: boolean
  ): Promise<void> {
    try {
      console.log(`Updating assistant ${assistantId} status to ${isActive}`);
      // TODO: Implement real API call when endpoint is available
      // For now, just log the action
    } catch (error) {
      console.error("Failed to update assistant status:", error);
      throw error;
    }
  }

  async deleteAssistant(assistantId: string): Promise<void> {
    try {
      console.log(`Deleting assistant ${assistantId}`);
      console.log(
        "API endpoint:",
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.DELETE_ASSISTANT}/${assistantId}`
      );

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.DELETE_ASSISTANT}/${assistantId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      console.log("Delete assistant API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete assistant API error:", errorText);

        // Parse error response if it's JSON
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // If not JSON, use the raw text
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Check if there's a response body
      const responseText = await response.text();
      if (responseText) {
        try {
          const data = JSON.parse(responseText);
          console.log("Delete assistant API response data:", data);
        } catch {
          console.log("Delete assistant API response:", responseText);
        }
      }

      console.log(`Assistant ${assistantId} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete assistant:", error);
      throw error;
    }
  }

  private getMockAssistants(): Assistant[] {
    const mockData = [
      {
        id: "post-purchase-feedback",
        name: "Post-Purchase Feedback",
        product: "General Products",
        questionsCount: 3,
        questions: [
          "How was your experience?",
          "Any issues?",
          "Would you recommend?",
        ],
        createdAt: "2024-01-15T10:00:00Z",
        isActive: true,
        totalCalls: 0,
        successRate: 0,
        lastUsed: "Never",
        status: "active" as const,
      },
      {
        id: "product-review",
        name: "Product Review Assistant",
        product: "Electronics",
        questionsCount: 2,
        questions: ["Rate the product", "Leave a review"],
        createdAt: "2024-01-10T10:00:00Z",
        isActive: true,
        totalCalls: 0,
        successRate: 0,
        lastUsed: "Never",
        status: "active" as const,
      },
      {
        id: "customer-satisfaction",
        name: "Customer Satisfaction Survey",
        product: "Services",
        questionsCount: 4,
        questions: [
          "Overall satisfaction?",
          "Service quality?",
          "Response time?",
          "Improvements?",
        ],
        createdAt: "2024-01-05T10:00:00Z",
        isActive: true,
        totalCalls: 0,
        successRate: 0,
        lastUsed: "Never",
        status: "active" as const,
      },
      {
        id: "follow-up",
        name: "Follow-up Assistant",
        product: "All Products",
        questionsCount: 2,
        questions: ["How are things going?", "Any concerns?"],
        createdAt: "2024-01-01T10:00:00Z",
        isActive: true,
        totalCalls: 0,
        successRate: 0,
        lastUsed: "Never",
        status: "active" as const,
      },
    ];

    // Sort mock data by creation date (newest first)
    return mockData.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });
  }
}

export const assistantsApi = new AssistantsApiService();
export default assistantsApi;
