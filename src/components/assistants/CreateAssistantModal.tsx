import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { ordersApi } from "@/services/ordersApi";
import { cleanProductNames } from "@/types/orders";

interface CreateAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assistantData: CreateAssistantData) => void;
}

interface CreateAssistantData {
  name: string;
  product: string;
  questions: string[];
}

const CreateAssistantModal: React.FC<CreateAssistantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [assistantName, setAssistantName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch products from orders API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isOpen) return; // Only fetch when modal is open

      setLoadingProducts(true);
      try {
        const orders = await ordersApi.fetchOrders();

        // Extract unique products from orders
        const allProducts = orders
          .map((order) => order.products)
          .filter((product) => product && product !== "N/A")
          .flatMap((product) =>
            // Split by common separators and clean up
            product
              .split(/[,;|&+]/)
              .map((p) =>
                p
                  .trim()
                  .replace(/\s*x\d+\s*$/i, "") // Extra cleaning: remove quantity indicators like "x1", "x2"
                  .replace(/\s*\(\d+\)\s*$/i, "") // Extra cleaning: remove quantity in parentheses
                  .trim()
              )
              .filter((p) => p.length > 0)
          );

        // Get unique products and sort them
        const uniqueProducts = Array.from(new Set(allProducts)).sort();

        setProductOptions(uniqueProducts);
        console.log("Fetched products:", uniqueProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Fallback to some default products if API fails
        setProductOptions([
          "Voice Assistant Pro",
          "Customer Service Bot",
          "Sales Assistant",
          "Support Helper",
          "Feedback Collector",
        ]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [isOpen]);

  const handleAddQuestion = () => {
    if (questions.length < 3) {
      setQuestions([...questions, ""]);
    }
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = async () => {
    if (
      !assistantName.trim() ||
      !selectedProduct ||
      selectedProduct === "__loading__" ||
      selectedProduct === "__no_products__" ||
      questions.some((q) => !q.trim())
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const assistantData: CreateAssistantData = {
        name: assistantName.trim(),
        product: selectedProduct,
        questions: questions.filter((q) => q.trim()).map((q) => q.trim()),
      };

      await onSubmit(assistantData);
      handleClose();
    } catch (error) {
      console.error("Failed to create assistant:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAssistantName("");
    setSelectedProduct("");
    setQuestions([""]);
    setIsSubmitting(false);
    onClose();
  };

  const isFormValid =
    assistantName.trim() &&
    selectedProduct &&
    selectedProduct !== "__loading__" &&
    selectedProduct !== "__no_products__" &&
    questions.every((q) => q.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Assistant Name */}
          <div className="space-y-2">
            <Label
              htmlFor="assistant-name"
              className="text-sm font-medium text-gray-900"
            >
              Assistant Name
            </Label>
            <Input
              id="assistant-name"
              type="text"
              placeholder="Treadmill Feedback Bot"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Assign Product */}
          <div className="space-y-2">
            <Label
              htmlFor="product-select"
              className="text-sm font-medium text-gray-900"
            >
              Assign Product
            </Label>
            <Select
              value={selectedProduct}
              onValueChange={setSelectedProduct}
              disabled={loadingProducts}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingProducts
                      ? "Loading products..."
                      : productOptions.length === 0
                      ? "No products available"
                      : "Select a product"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {loadingProducts ? (
                  <SelectItem value="__loading__" disabled>
                    Loading products...
                  </SelectItem>
                ) : productOptions.length === 0 ? (
                  <SelectItem value="__no_products__" disabled>
                    No products found
                  </SelectItem>
                ) : (
                  productOptions.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {productOptions.length > 0 && !loadingProducts && (
              <p className="text-xs text-gray-500">
                {productOptions.length} products available from your orders
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">
              Questions
            </Label>

            {questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`question-${index}`}
                    className="text-sm text-gray-600"
                  >
                    Question {index + 1}
                  </Label>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Textarea
                  id={`question-${index}`}
                  placeholder={`Question ${index + 1}`}
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="w-full min-h-[60px] max-h-[100px] resize-y"
                />
              </div>
            ))}

            {questions.length < 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddQuestion}
                className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            )}

            <p className="text-xs text-gray-500">
              You can add up to 3 questions. Current: {questions.length}/3
            </p>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-end pt-4 border-t bg-white flex-shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="px-6 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Assistant"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssistantModal;
