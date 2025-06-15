import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import AssistantsTable from "@/components/assistants/AssistantsTable";
import AssistantsSummaryCards from "@/components/assistants/AssistantsSummaryCards";
import AssistantDetailsModal from "@/components/assistants/AssistantDetailsModal";
import QuestionDetailsModal from "@/components/assistants/QuestionDetailsModal";
import CreateAssistantModal from "@/components/assistants/CreateAssistantModal";
import { assistantsApi } from "@/services/assistantsApi";
import { mockAssistants } from "@/data/mockAssistants";
import type { Assistant } from "@/types/assistants";
import { Plus, Search } from "lucide-react";

interface Question {
  id: number;
  text: string;
  completed: boolean;
  assistantName?: string;
}

interface CreateAssistantData {
  name: string;
  product: string;
  questions: string[];
}

const Assistants = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch assistants on component mount
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedAssistants = await assistantsApi.fetchAssistants();
        setAssistants(fetchedAssistants);
      } catch (err) {
        console.error("Error fetching assistants:", err);
        // Fallback to mock data for development
        setAssistants(mockAssistants);
        // Don't show error message for mock data
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  // Filter assistants based on search term
  const filteredAssistants = assistants.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assistant.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (assistant: Assistant) => {
    try {
      // Fetch detailed assistant data from API
      const detailedAssistant = await assistantsApi.fetchAssistantDetails(
        assistant.id
      );
      setSelectedAssistant(detailedAssistant);
      setIsAssistantModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch assistant details:", error);
      // Fallback to the assistant data we already have
      setSelectedAssistant(assistant);
      setIsAssistantModalOpen(true);
    }
  };

  const handleEdit = (assistant: Assistant) => {
    console.log("Edit assistant:", assistant);
    // TODO: Implement edit modal/page
  };

  const handleToggleStatus = async (assistant: Assistant) => {
    try {
      await assistantsApi.updateAssistantStatus(
        assistant.id,
        !assistant.isActive
      );
      setAssistants((prevAssistants) =>
        prevAssistants.map((a) =>
          a.id === assistant.id
            ? {
                ...a,
                isActive: !a.isActive,
                status: !a.isActive
                  ? a.totalCalls > 0
                    ? "active"
                    : "draft"
                  : "inactive",
              }
            : a
        )
      );
    } catch (err) {
      console.error("Failed to update assistant status:", err);
      // For mock data, still update the UI
      setAssistants((prevAssistants) =>
        prevAssistants.map((a) =>
          a.id === assistant.id
            ? {
                ...a,
                isActive: !a.isActive,
                status: !a.isActive
                  ? a.totalCalls > 0
                    ? "active"
                    : "draft"
                  : "inactive",
              }
            : a
        )
      );
    }
  };

  const handleDelete = async (assistant: Assistant) => {
    try {
      await assistantsApi.deleteAssistant(assistant.id);
      setAssistants((prevAssistants) =>
        prevAssistants.filter((a) => a.id !== assistant.id)
      );
      console.log(`Assistant "${assistant.name}" deleted successfully`);
    } catch (err) {
      console.error("Failed to delete assistant:", err);
      // For mock data, still update the UI
      setAssistants((prevAssistants) =>
        prevAssistants.filter((a) => a.id !== assistant.id)
      );
    }
  };

  const handleDeleteFromModal = async (assistantId: string) => {
    try {
      await assistantsApi.deleteAssistant(assistantId);
      setAssistants((prevAssistants) =>
        prevAssistants.filter((a) => a.id !== assistantId)
      );
      console.log(`Assistant deleted successfully`);
      // Close the modal after successful deletion
      closeAssistantModal();
    } catch (err) {
      console.error("Failed to delete assistant:", err);
      // For mock data, still update the UI
      setAssistants((prevAssistants) =>
        prevAssistants.filter((a) => a.id !== assistantId)
      );
      // Close the modal even if there's an error (for mock data)
      closeAssistantModal();
    }
  };

  const handleQuestionClick = (question: Question, assistantName: string) => {
    setSelectedQuestion({ ...question, assistantName });
    setIsQuestionModalOpen(true);
  };

  const handleCreateAssistant = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (assistantData: CreateAssistantData) => {
    try {
      // Call the real API to create the assistant
      const newAssistant = await assistantsApi.createAssistant(assistantData);

      // Add to assistants list at the top
      setAssistants((prevAssistants) => [newAssistant, ...prevAssistants]);

      console.log("Created assistant:", newAssistant);
    } catch (error) {
      console.error("Failed to create assistant:", error);
      throw error;
    }
  };

  const closeAssistantModal = () => {
    setIsAssistantModalOpen(false);
    setSelectedAssistant(null);
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
    setSelectedQuestion(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Assistants</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assistants..."
                disabled
                className="w-64 pl-10 pr-4 py-2 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg"
              />
            </div>
            <Button disabled className="bg-gray-400">
              <Plus className="w-4 h-4 mr-2" />
              Create Assistant
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assistants...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Assistants</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assistants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-150 shadow-sm"
            />
          </div>
          <Button
            onClick={handleCreateAssistant}
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Assistant
          </Button>
        </div>
      </div>

      <AssistantsSummaryCards />

      <div className="space-y-6">
        {assistants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-12 h-12 text-violet-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No assistants created yet
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Get started by creating your first assistant to help collect
              feedback from your customers.
            </p>
            <Button
              onClick={handleCreateAssistant}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Assistant
            </Button>
          </div>
        ) : (
          <AssistantsTable
            assistants={filteredAssistants}
            onView={handleView}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onQuestionClick={handleQuestionClick}
          />
        )}
      </div>

      {/* Modals */}
      <AssistantDetailsModal
        assistant={selectedAssistant}
        isOpen={isAssistantModalOpen}
        onClose={closeAssistantModal}
        onDelete={handleDeleteFromModal}
        onQuestionClick={handleQuestionClick}
      />

      <QuestionDetailsModal
        question={selectedQuestion}
        isOpen={isQuestionModalOpen}
        onClose={closeQuestionModal}
        assistantName={selectedQuestion?.assistantName}
      />

      <CreateAssistantModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default Assistants;
