import React from "react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/orders";

interface ActionButtonProps {
  order: Order;
  onScheduleCall: (order: Order) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  order,
  onScheduleCall,
}) => {
  switch (order.callStatus) {
    case "completed":
      return (
        <Button
          size="sm"
          variant="outline"
          disabled
          className="text-xs h-7 px-3 bg-green-50 text-green-700 border-green-200 cursor-not-allowed rounded-full font-medium"
        >
          Completed
        </Button>
      );
    case "scheduled":
      return (
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-3 border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 hover:border-violet-300 transition-all duration-200 rounded-full font-medium shadow-sm"
          onClick={() => onScheduleCall(order)}
        >
          Edit Schedule
        </Button>
      );
    case "not_scheduled":
      return (
        <Button
          size="sm"
          className="text-xs h-7 px-3 bg-violet-600 text-white hover:bg-violet-700 transition-all duration-200 rounded-full font-medium shadow-sm border-0"
          onClick={() => onScheduleCall(order)}
        >
          Schedule Call
        </Button>
      );
    default:
      return null;
  }
};

export default ActionButton;
