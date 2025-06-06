import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';
import { format } from 'date-fns';
import type { Order } from '@/types/orders';

interface OrdersTableProps {
  orders: Order[];
  onScheduleCall: (order: Order) => void;
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd MMM yyyy');
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onScheduleCall }) => {
  return (
    <Card className="min-h-[600px]">
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="text-left font-semibold text-gray-900 py-4">Customer Name</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Phone Number</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Product(s) Purchased</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Delivery Date</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Call Status</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Total</TableHead>
              <TableHead className="text-left font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <TableCell className="py-4">
                  <div className="font-medium text-gray-900">{order.customerName}</div>
                  <div className="text-sm text-gray-500">#{order.id}</div>
                </TableCell>
                <TableCell className="text-gray-700">{order.phone}</TableCell>
                <TableCell>
                  <div className="text-gray-900">{order.products}</div>
                </TableCell>
                <TableCell className="text-gray-700">{formatDate(order.deliveryDate)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.callStatus} />
                </TableCell>
                <TableCell className="font-medium text-gray-900">{order.total}</TableCell>
                <TableCell>
                  <ActionButton order={order} onScheduleCall={onScheduleCall} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default OrdersTable; 