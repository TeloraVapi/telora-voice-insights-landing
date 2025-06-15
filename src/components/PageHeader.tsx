import React, { useState, useEffect, useRef } from "react";
import { Filter, Calendar, Search } from "lucide-react";

interface PageHeaderProps {
  title: string;
  showDatePicker?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  onDatePickerClick?: () => void;
}

interface DateRange {
  from: Date;
  to: Date;
}

const PageHeader = ({
  title,
  showDatePicker = true,
  showSearch = true,
  showFilter = true,
  searchPlaceholder = "Search by product name...",
  onSearch,
  onFilterClick,
  onDatePickerClick,
}: PageHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date("2025-06-07"),
    to: new Date("2025-06-13"),
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const formatDateRange = (from: Date, to: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const fromStr = from.toLocaleDateString("en-US", options);
    const toStr = to.toLocaleDateString("en-US", options);
    return `${fromStr} - ${toStr}`;
  };

  const handleDateRangeChange = (days: number) => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - days);
    setDateRange({ from, to: today });
    setShowDateDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between mb-8 pt-2">
      {/* Left side - Title only */}
      <div className="flex items-center">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right side - Filter, Date picker, and Search */}
      <div className="flex items-center space-x-2">
        {showFilter && (
          <button
            onClick={onFilterClick}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-150 border border-gray-200"
          >
            <Filter className="w-4 h-4 opacity-70" />
          </button>
        )}

        {showDatePicker && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <Calendar className="w-4 h-4 mr-2 text-gray-500 opacity-70" />
              <span className="font-medium text-gray-600 opacity-70">
                {formatDateRange(dateRange.from, dateRange.to)}
              </span>
            </button>

            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => handleDateRangeChange(7)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => handleDateRangeChange(14)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Last 14 days
                </button>
                <button
                  onClick={() => handleDateRangeChange(30)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => handleDateRangeChange(90)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Last 90 days
                </button>
              </div>
            )}
          </div>
        )}

        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
