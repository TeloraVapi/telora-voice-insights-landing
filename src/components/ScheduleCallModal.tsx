import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, isAfter, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { assistantsApi } from "@/services/assistantsApi";
import type { Assistant } from "@/types/assistants";
import { scheduleCallApi } from "@/services/scheduleCallApi";
import toast from "react-hot-toast";

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
  onCallScheduled?: (orderId: string) => void;
  onCallDeleted?: (orderId: string) => void;
}

const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({
  open,
  onOpenChange,
  order,
  onCallScheduled,
  onCallDeleted,
}) => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantsLoading, setAssistantsLoading] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [isEditing, setIsEditing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  // Fetch assistants when modal opens
  useEffect(() => {
    if (open) {
      const fetchAssistants = async () => {
        try {
          setAssistantsLoading(true);
          const fetchedAssistants = await assistantsApi.fetchAssistants();
          setAssistants(fetchedAssistants);

          // Set default assistant if none selected and assistants are available
          if (!selectedAssistant && fetchedAssistants.length > 0) {
            setSelectedAssistant(fetchedAssistants[0].id);
          }
        } catch (error) {
          console.error("Failed to fetch assistants:", error);
        } finally {
          setAssistantsLoading(false);
        }
      };

      fetchAssistants();
    }
  }, [open, selectedAssistant]);

  useEffect(() => {
    if (order) {
      setIsEditing(order.callStatus === "scheduled");
      // Reset form when modal opens for new scheduling
      if (order.callStatus === "not_scheduled") {
        setSelectedDate(undefined);
        setSelectedTime("14:00");
        // selectedAssistant will be set when assistants are loaded
      }
    }
  }, [order, open]);

  if (!order) return null;

  const handleSave = async () => {
    if (!selectedDate || !selectedAssistant) {
      toast.error("Please select both date and assistant");
      return;
    }

    // Validate that the selected date and time is in the future
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    // Add 5 minutes buffer to ensure it's actually in the future
    const minimumTime = new Date(now.getTime() + 5 * 60 * 1000);

    if (selectedDateTime <= minimumTime) {
      toast.error("Please select a time at least 5 minutes in the future");
      return;
    }

    try {
      setIsScheduling(true);

      // Format the data for the API
      const scheduledTimeUtc = scheduleCallApi.formatScheduledTime(
        selectedDate,
        selectedTime
      );
      const formattedOrderId = scheduleCallApi.formatOrderId(order.id);

      const scheduleRequest = {
        orderId: formattedOrderId,
        scheduledTimeUtc,
        assistantId: selectedAssistant,
      };

      console.log("Scheduling call with data:", scheduleRequest);

      // Call the real API
      const response = await scheduleCallApi.scheduleCall(scheduleRequest);

      if (response.success) {
        console.log("Call scheduled successfully:", response);

        // Show success toast
        const assistantName =
          assistants.find((a) => a.id === selectedAssistant)?.name ||
          "Assistant";
        const formattedDate = format(selectedDate, "MMM dd, yyyy");
        const formattedTime = format(selectedDateTime, "h:mm a");

        toast.success("Call scheduled successfully!");

        // Update the local state
        if (order.callStatus === "not_scheduled" && onCallScheduled) {
          onCallScheduled(order.id);
        }

        // Close the modal with a small delay to ensure toast is shown
        setTimeout(() => {
          onOpenChange(false);
        }, 100);
      } else {
        console.error("Failed to schedule call:", response.message);
        toast.error(
          response.message || "Failed to schedule call. Please try again."
        );
      }
    } catch (error) {
      console.error("Error scheduling call:", error);
      toast.error(
        "Failed to schedule call. Please check your connection and try again."
      );
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDelete = async () => {
    console.log("Deleting call schedule for order:", order.id);

    try {
      setIsScheduling(true); // Reuse the loading state for delete operation

      // For now, we'll use the order ID as the call ID
      // In a real implementation, you might need to store the actual call ID
      const callId = order.id.replace("#", ""); // Remove # prefix for API call

      const response = await scheduleCallApi.deleteSchedule(callId);

      if (response.success) {
        console.log("Schedule deleted successfully:", response);

        // Show success toast
        toast.success("Call schedule deleted successfully!");

        // Update the local state
        if (onCallDeleted) {
          onCallDeleted(order.id);
        }

        // Close the modal with a small delay to ensure toast is shown
        setTimeout(() => {
          onOpenChange(false);
        }, 100);
      } else {
        console.error("Failed to delete schedule:", response.message);
        toast.error(
          response.message || "Failed to delete schedule. Please try again."
        );
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error(
        "Failed to delete schedule. Please check your connection and try again."
      );
    } finally {
      setIsScheduling(false);
    }
  };

  const formatDeliveryDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 rounded-xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-violet-25 flex-shrink-0">
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            {isEditing ? "Edit Call Schedule" : "Schedule Call"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-6 space-y-8 overflow-y-auto flex-1 pr-2">
          {/* Customer & Order Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-25 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
              Customer & Order Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Customer
                  </Label>
                  <Input
                    value={order.customerName}
                    readOnly
                    className="bg-white border-gray-200 text-gray-900 font-medium cursor-default focus:ring-0 focus:border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Phone
                  </Label>
                  <Input
                    value={order.phone}
                    readOnly
                    className="bg-white border-gray-200 text-gray-800 cursor-default focus:ring-0 focus:border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Product(s)
                  </Label>
                  <Input
                    value={order.products}
                    readOnly
                    className="bg-white border-gray-200 text-gray-800 cursor-default focus:ring-0 focus:border-gray-200"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Delivered
                  </Label>
                  <Input
                    value={formatDeliveryDate(order.deliveryDate)}
                    readOnly
                    className="bg-white border-gray-200 text-gray-800 cursor-default focus:ring-0 focus:border-gray-200"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Shipping State
                  </Label>
                  <Input
                    value={order.shippingState || "CA"}
                    readOnly
                    className="bg-white border-gray-200 text-gray-800 cursor-default focus:ring-0 focus:border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Call Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
              Call Configuration
            </h3>

            {/* Assistant Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">
                Select Assistant
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal h-12 px-4 border-violet-200 hover:border-violet-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white hover:bg-violet-50"
                    disabled={assistantsLoading}
                  >
                    <span className="text-gray-900">
                      {assistantsLoading
                        ? "Loading assistants..."
                        : assistants.find((a) => a.id === selectedAssistant)
                            ?.name || "Select Assistant"}
                    </span>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 bg-white border border-violet-200 shadow-lg rounded-lg"
                  style={{ width: "var(--radix-popover-trigger-width)" }}
                  align="start"
                  sideOffset={4}
                >
                  <div className="py-1">
                    {assistantsLoading ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Loading assistants...
                      </div>
                    ) : assistants.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No assistants available
                      </div>
                    ) : (
                      assistants.map((assistant) => (
                        <button
                          key={assistant.id}
                          onClick={() => setSelectedAssistant(assistant.id)}
                          className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 hover:bg-violet-50 hover:text-violet-700 ${
                            selectedAssistant === assistant.id
                              ? "bg-violet-50 text-violet-700 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          <div>
                            <div className="font-medium">{assistant.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {assistant.product} • {assistant.questionsCount}{" "}
                              questions
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 px-4 border-violet-200 hover:border-violet-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
                        !selectedDate && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-4 w-4 text-violet-500" />
                      {selectedDate
                        ? format(selectedDate, "MMM dd, yyyy")
                        : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-violet-200 shadow-xl z-50 rounded-xl"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < startOfDay(new Date())}
                      initialFocus
                      className="pointer-events-auto rounded-xl"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-semibold text-gray-900",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-violet-100 rounded-md transition-colors",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-violet-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-violet-50 rounded-md transition-colors",
                        day_selected:
                          "bg-violet-600 text-white hover:bg-violet-600 hover:text-white focus:bg-violet-600 focus:text-white",
                        day_today:
                          "bg-violet-100 text-violet-900 font-semibold",
                        day_outside: "text-gray-400 opacity-50",
                        day_disabled:
                          "text-gray-400 opacity-50 cursor-not-allowed",
                        day_range_middle:
                          "aria-selected:bg-violet-100 aria-selected:text-violet-900",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Time
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {/* Hour Dropdown */}
                  <select
                    value={
                      parseInt(selectedTime.split(":")[0]) > 12
                        ? parseInt(selectedTime.split(":")[0]) - 12
                        : parseInt(selectedTime.split(":")[0]) === 0
                        ? 12
                        : parseInt(selectedTime.split(":")[0])
                    }
                    onChange={(e) => {
                      const hour = parseInt(e.target.value);
                      const currentMinute = selectedTime.split(":")[1];
                      const isPM = parseInt(selectedTime.split(":")[0]) >= 12;
                      const newHour = isPM
                        ? hour === 12
                          ? 12
                          : hour + 12
                        : hour === 12
                        ? 0
                        : hour;
                      setSelectedTime(
                        `${newHour
                          .toString()
                          .padStart(2, "0")}:${currentMinute}`
                      );
                    }}
                    className="h-12 px-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-violet-300 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>

                  {/* Minute Dropdown */}
                  <select
                    value={selectedTime.split(":")[1]}
                    onChange={(e) => {
                      const currentHour = selectedTime.split(":")[0];
                      setSelectedTime(`${currentHour}:${e.target.value}`);
                    }}
                    className="h-12 px-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-violet-300 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    {Array.from({ length: 60 }, (_, i) =>
                      i.toString().padStart(2, "0")
                    ).map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>

                  {/* AM/PM Dropdown */}
                  <select
                    value={
                      parseInt(selectedTime.split(":")[0]) >= 12 ? "PM" : "AM"
                    }
                    onChange={(e) => {
                      const currentHour = parseInt(selectedTime.split(":")[0]);
                      const currentMinute = selectedTime.split(":")[1];
                      const newHour =
                        e.target.value === "PM"
                          ? currentHour < 12
                            ? currentHour + 12
                            : currentHour
                          : currentHour >= 12
                          ? currentHour - 12
                          : currentHour;
                      setSelectedTime(
                        `${newHour
                          .toString()
                          .padStart(2, "0")}:${currentMinute}`
                      );
                    }}
                    className="h-12 px-3 border border-violet-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white text-gray-900 font-medium appearance-none cursor-pointer hover:border-violet-300 transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
              <p className="text-sm text-violet-700 flex items-start">
                <div className="w-1 h-1 bg-violet-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                Time will be adjusted to customer's local timezone based on
                shipping state.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            {isEditing && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                disabled={isScheduling}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScheduling ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete Schedule"
                )}
              </Button>
            )}

            <div className="flex gap-3 ml-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !selectedDate ||
                  !selectedAssistant ||
                  assistantsLoading ||
                  isScheduling
                }
                className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScheduling ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Scheduling...</span>
                  </div>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Schedule Call"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCallModal;
