
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  products: string;
  deliveryDate: string;
  callStatus: string;
  shippingState?: string;
}

interface ScheduleCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const assistants = [
  { id: 'post-purchase-feedback', name: 'Post-Purchase Feedback' },
  { id: 'product-review', name: 'Product Review Assistant' },
  { id: 'customer-satisfaction', name: 'Customer Satisfaction Survey' },
  { id: 'follow-up', name: 'Follow-up Assistant' },
];

const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({ 
  open, 
  onOpenChange, 
  order 
}) => {
  const [selectedAssistant, setSelectedAssistant] = useState('post-purchase-feedback');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (order) {
      setIsEditing(order.callStatus !== 'not_scheduled');
      // Reset form when modal opens
      if (!isEditing) {
        setSelectedDate(undefined);
        setSelectedTime('14:00');
        setSelectedAssistant('post-purchase-feedback');
      }
    }
  }, [order, open]);

  if (!order) return null;

  const handleSave = () => {
    console.log('Saving call schedule:', {
      orderId: order.id,
      assistant: selectedAssistant,
      date: selectedDate,
      time: selectedTime,
    });
    onOpenChange(false);
  };

  const handleDelete = () => {
    console.log('Deleting call schedule for order:', order.id);
    onOpenChange(false);
  };

  const formatDeliveryDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Call Schedule' : 'Schedule Call'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer & Order Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Customer & Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">{order.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Product(s):</span>
                <span className="font-medium text-gray-900 text-right max-w-[150px]">{order.products}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivered:</span>
                <span className="font-medium text-gray-900">{formatDeliveryDate(order.deliveryDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping State:</span>
                <span className="font-medium text-gray-900">{order.shippingState || 'CA'}</span>
              </div>
            </div>
          </div>

          {/* Call Configuration */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Call Configuration</h3>
            
            {/* Assistant Selection */}
            <div className="space-y-2">
              <Label htmlFor="assistant" className="text-sm font-medium text-gray-700">
                Select Assistant
              </Label>
              <select
                id="assistant"
                value={selectedAssistant}
                onChange={(e) => setSelectedAssistant(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {assistants.map((assistant) => (
                  <option key={assistant.id} value={assistant.id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "MMM dd") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Time will be adjusted to customer's local timezone based on shipping state.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            {isEditing && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm px-0"
              >
                Delete Schedule
              </Button>
            )}
            
            <div className="flex gap-3 ml-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!selectedDate}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {isEditing ? 'Save Changes' : 'Schedule Call'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCallModal;
