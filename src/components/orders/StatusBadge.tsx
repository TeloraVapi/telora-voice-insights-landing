import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"> Completed</Badge>;
    case 'scheduled':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"> Scheduled</Badge>;
    case 'not_scheduled':
      return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"> Unscheduled</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export default StatusBadge; 