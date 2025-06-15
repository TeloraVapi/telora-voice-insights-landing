import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import type { Assistant } from "@/types/assistants";

interface AssistantActionButtonProps {
  assistant: Assistant;
  onView: (assistant: Assistant) => void;
  onEdit: (assistant: Assistant) => void;
  onToggleStatus: (assistant: Assistant) => void;
  onDelete: (assistant: Assistant) => void;
}

const AssistantActionButton: React.FC<AssistantActionButtonProps> = ({
  assistant,
  onView,
  onDelete,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(assistant)}
        className="h-8 w-8 p-0 hover:bg-blue-50"
      >
        <Eye className="h-4 w-4 text-blue-600 hover:text-blue-700" />
        <span className="sr-only">View assistant</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(assistant)}
        className="h-8 w-8 p-0 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4 text-red-600 hover:text-red-700" />
        <span className="sr-only">Delete assistant</span>
      </Button>
    </div>
  );
};

export default AssistantActionButton;
