// API Response Types
export interface ApiAssistantResponse {
  assistants: ApiAssistant[];
}

export interface ApiAssistant {
  id: string;
  name: string;
  product: string;
  questions: string[];
  createdAt: string;
  isActive: boolean;
  totalCalls?: number;
  successRate?: number;
  lastUsed?: string;
}

// UI Types (what the components expect)
export interface Assistant {
  id: string;
  name: string;
  product: string;
  questionsCount: number;
  questions: string[];
  createdAt: string;
  isActive: boolean;
  totalCalls: number;
  successRate: number;
  lastUsed: string;
  status: "active" | "inactive" | "draft";
}

// Transform function to convert API data to UI format
export const transformApiAssistantToAssistant = (
  apiAssistant: ApiAssistant
): Assistant => {
  const getStatus = (): "active" | "inactive" | "draft" => {
    if (!apiAssistant.isActive) return "inactive";
    if (apiAssistant.totalCalls === 0) return "draft";
    return "active";
  };

  return {
    id: apiAssistant.id || "N/A",
    name: apiAssistant.name || "N/A",
    product: apiAssistant.product || "N/A",
    questionsCount: apiAssistant.questions?.length || 0,
    questions: apiAssistant.questions || [],
    createdAt: apiAssistant.createdAt || "N/A",
    isActive: apiAssistant.isActive || false,
    totalCalls: apiAssistant.totalCalls || 0,
    successRate: apiAssistant.successRate || 0,
    lastUsed: apiAssistant.lastUsed || "Never",
    status: getStatus(),
  };
};
