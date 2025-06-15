import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Calendar, CheckCircle, Trash2 } from "lucide-react";
import { Assistant } from "@/types/assistants";

interface Question {
  id: number;
  text: string;
  completed: boolean;
}

interface AssistantDetailsModalProps {
  assistant: Assistant | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onQuestionClick?: (question: Question, assistantName: string) => void;
}

const AssistantDetailsModal: React.FC<AssistantDetailsModalProps> = ({
  assistant,
  isOpen,
  onClose,
  onDelete,
  onQuestionClick,
}) => {
  if (!assistant) return null;

  const handleDelete = () => {
    onDelete(assistant.id);
    onClose();
  };

  const handleQuestionClick = (question: Question) => {
    if (onQuestionClick) {
      onQuestionClick(question, assistant.name);
    }
  };

  // Convert assistant questions to the expected format
  const questions: Question[] = assistant.questions.map(
    (questionText, index) => ({
      id: index + 1,
      text: questionText,
      completed: true, // Assuming all questions are completed/active
    })
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <span className="text-violet-600 font-semibold text-lg">
                {assistant.name.charAt(0)}
              </span>
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {assistant.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Assigned Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Product Assigned
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">
                {assistant.product || "Voice Assistant Pro"}
              </p>
              <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Created{" "}
                  {new Date(assistant.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
            <Badge
              variant={assistant.status === "active" ? "default" : "secondary"}
              className={
                assistant.status === "active"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
              }
            >
              {assistant.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Questions Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Questions ({questions.length})
            </h3>
            <div className="space-y-3">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleQuestionClick(question)}
                >
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Question {question.id}
                    </p>
                    <p className="text-gray-900">{question.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="px-6 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Assistant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssistantDetailsModal;
