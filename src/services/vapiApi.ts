// Audio API Service for getting audio URLs from backend
import API_CONFIG from "@/config/api";

// Use the same JWT token as other APIs
const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzUwMzU2MjY3fQ.uaCcPJG5ZDwGrOjsFzuLNVkpT73n6mwlsxVWyBcx5jw";

const getHeaders = () => ({
  Authorization: `Bearer ${JWT_TOKEN}`,
  "Content-Type": "application/json",
});

export interface AudioUrlResponse {
  audioUrl: string;
  expiresAt?: string;
}

class AudioApiService {
  /**
   * Get audio URL for a call from the backend
   * The backend handles VAPI integration and returns a playable audio URL
   */
  async getAudioUrl(callId: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/calls/${callId}/audio`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio URL: ${response.status} ${response.statusText}`
        );
      }

      const data: AudioUrlResponse = await response.json();

      if (!data.audioUrl) {
        throw new Error("No audio URL returned from server");
      }

      return data.audioUrl;
    } catch (error) {
      console.error("Error fetching audio URL from backend:", error);
      throw error;
    }
  }

  /**
   * Check if the service is available (always true since we're using our own backend)
   */
  isConfigured(): boolean {
    return true;
  }
}

export const audioApi = new AudioApiService();
