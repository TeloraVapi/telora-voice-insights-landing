import React from "react";

interface AssistantStatusBadgeProps {
  status: "active" | "inactive" | "draft";
}

const AssistantStatusBadge: React.FC<AssistantStatusBadgeProps> = ({
  status,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          text: "Active",
          className: "bg-green-50 text-green-700 border-green-200",
          dotColor: "bg-green-500",
        };
      case "inactive":
      case "draft": // Treat draft as inactive
        return {
          text: "Inactive",
          className: "bg-gray-50 text-gray-700 border-gray-200",
          dotColor: "bg-gray-400",
        };
      default:
        return {
          text: "Inactive",
          className: "bg-gray-50 text-gray-700 border-gray-200",
          dotColor: "bg-gray-400",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dotColor}`} />
      {config.text}
    </span>
  );
};

export default AssistantStatusBadge;
