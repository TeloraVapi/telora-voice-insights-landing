import React from "react";
import { Calendar } from "lucide-react";

interface StatusFiltersProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const StatusFilters: React.FC<StatusFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const filters = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "scheduled", label: "Scheduled" },
    { value: "not_scheduled", label: "Not Scheduled" },
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <div className="flex rounded-lg bg-gray-100 p-1">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                selectedFilter === filter.value
                  ? "bg-white text-violet-600 shadow-sm font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusFilters;
