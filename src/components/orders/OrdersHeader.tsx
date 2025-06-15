import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, ChevronDown } from "lucide-react";

interface OrdersHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  searchTerm,
  onSearchChange,
  filterOpen,
  onFilterOpenChange,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage voice feedback calls for your orders
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
            />
          </div>

          <Popover open={filterOpen} onOpenChange={onFilterOpenChange}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 bg-white border border-gray-200 shadow-lg z-50"
              align="end"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Call Status
                  </label>
                  <div className="space-y-2">
                    {["completed", "scheduled", "not_scheduled"].map(
                      (status) => (
                        <label key={status} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm text-gray-600 capitalize">
                            {status.replace("_", " ")}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sort by
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Most Recent</option>
                    <option>Oldest First</option>
                    <option>Highest Price</option>
                    <option>Lowest Price</option>
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;
