import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AssistantStatusBadge from "./AssistantStatusBadge";
import AssistantActionButton from "./AssistantActionButton";
import { format } from "date-fns";
import { MessageSquare, TrendingUp } from "lucide-react";
import type { Assistant } from "@/types/assistants";

interface Question {
  id: number;
  text: string;
  completed: boolean;
  assistantName?: string;
}

interface AssistantsTableProps {
  assistants: Assistant[];
  onView: (assistant: Assistant) => void;
  onEdit: (assistant: Assistant) => void;
  onToggleStatus: (assistant: Assistant) => void;
  onDelete: (assistant: Assistant) => void;
  onQuestionClick?: (question: Question, assistantName: string) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString || dateString === "N/A") return "N/A";
  try {
    return format(new Date(dateString), "dd MMM yyyy");
  } catch {
    return dateString;
  }
};

const AssistantsTable: React.FC<AssistantsTableProps> = ({
  assistants,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  onQuestionClick,
}) => {
  return (
    <Card className="rounded-xl">
      <div className="overflow-hidden rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="text-left font-semibold text-gray-900 opacity-80 py-4">
                Assistant
              </TableHead>
              <TableHead className="text-left font-semibold text-gray-900 opacity-80">
                Product
              </TableHead>
              <TableHead className="text-left font-semibold text-gray-900 opacity-80">
                Questions
              </TableHead>
              <TableHead className="text-left font-semibold text-gray-900 opacity-80">
                Performance
              </TableHead>
              <TableHead className="text-left font-semibold text-gray-900 opacity-80">
                Status
              </TableHead>
              <TableHead className="text-left font-semibold text-gray-900 opacity-80">
                Created
              </TableHead>
              <TableHead className="text-left font-semibold text-gray-900 opacity-80">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assistants.map((assistant) => (
              <TableRow
                key={assistant.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <TableCell className="py-4">
                  <div className="font-medium text-gray-900">
                    {assistant.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-gray-700 font-medium">
                    {assistant.product}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className="flex items-center space-x-2 cursor-pointer hover:bg-blue-50 rounded-md p-1 -m-1 transition-colors"
                    onClick={() => {
                      if (onQuestionClick && assistant.questions.length > 0) {
                        // Create a mock question object for the first question
                        const firstQuestion: Question = {
                          id: 1,
                          text: assistant.questions[0],
                          completed: false,
                          assistantName: assistant.name,
                        };
                        onQuestionClick(firstQuestion, assistant.name);
                      }
                    }}
                  >
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600 font-medium hover:text-blue-700">
                      {assistant.questionsCount} Questions
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">
                        {assistant.totalCalls} calls
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {assistant.successRate}% success
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <AssistantStatusBadge status={assistant.status} />
                </TableCell>
                <TableCell>
                  <div className="text-gray-700">
                    {formatDate(assistant.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <AssistantActionButton
                    assistant={assistant}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default AssistantsTable;
