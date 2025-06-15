import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, TrendingUp, Users } from "lucide-react";

interface Question {
  id: number;
  text: string;
  completed: boolean;
  responses?: number;
  avgRating?: number;
  category?: string;
}

interface QuestionDetailsModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
  assistantName?: string;
}

const QuestionDetailsModal: React.FC<QuestionDetailsModalProps> = ({
  question,
  isOpen,
  onClose,
  assistantName = "Assistant",
}) => {
  if (!question) return null;

  // Mock response data - in real app this would come from API
  const responseData = {
    totalResponses: 247,
    avgRating: 4.6,
    responseBreakdown: [
      { rating: 5, count: 156, percentage: 63 },
      { rating: 4, count: 67, percentage: 27 },
      { rating: 3, count: 18, percentage: 7 },
      { rating: 2, count: 4, percentage: 2 },
      { rating: 1, count: 2, percentage: 1 },
    ],
    recentResponses: [
      {
        id: 1,
        rating: 5,
        comment: "Excellent service, very satisfied!",
        date: "2025-01-15",
      },
      {
        id: 2,
        rating: 4,
        comment: "Good overall experience",
        date: "2025-01-14",
      },
      {
        id: 3,
        rating: 5,
        comment: "Outstanding quality and support",
        date: "2025-01-14",
      },
    ],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-violet-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Question {question.id} Details
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question Text */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Question</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 text-lg">{question.text}</p>
              <p className="text-sm text-gray-600 mt-2">
                Asked by {assistantName}
              </p>
            </div>
          </div>

          {/* Response Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-violet-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-violet-600" />
                <span className="text-sm font-medium text-violet-900">
                  Total Responses
                </span>
              </div>
              <p className="text-2xl font-bold text-violet-900 mt-1">
                {responseData.totalResponses}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Average Rating
                </span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {responseData.avgRating}/5
              </p>
            </div>

            <div className="bg-violet-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-violet-600" />
                <span className="text-sm font-medium text-violet-900">
                  Response Rate
                </span>
              </div>
              <p className="text-2xl font-bold text-violet-900 mt-1">94%</p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Rating Breakdown
            </h3>
            <div className="space-y-2">
              {responseData.responseBreakdown.map((item) => (
                <div key={item.rating} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {item.rating}★
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {item.count}
                  </span>
                  <span className="text-sm text-gray-500 w-8">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Responses */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Recent Responses
            </h3>
            <div className="space-y-3">
              {responseData.recentResponses.map((response) => (
                <div key={response.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < response.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {response.rating}/5
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {response.date}
                    </span>
                  </div>
                  <p className="text-gray-700">{response.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" className="px-6">
              Export Data
            </Button>
            <Button className="px-6 bg-violet-600 hover:bg-violet-700">
              View All Responses
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDetailsModal;
