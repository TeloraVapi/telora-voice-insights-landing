import React from 'react';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types/orders';

interface ActionButtonProps {
  order: Order;
  onScheduleCall: (order: Order) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ order, onScheduleCall }) => {
  switch (order.callStatus) {
    case 'completed':
      return (
        <Button 
          size="sm" 
          variant="outline"
          disabled
          className="text-sm h-8 px-3 bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
        >
          Call Completed
        </Button>
      );
    case 'scheduled':
      return (
        <Button 
          size="sm" 
          variant="outline"
          className="text-sm h-8 px-3 border-blue-300 text-blue-700 hover:bg-blue-50"
          onClick={() => onScheduleCall(order)}
        >
          Edit Schedule
        </Button>
      );
    case 'not_scheduled':
      return (
        <Button 
          size="sm" 
          variant="default"
          className="text-sm h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
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