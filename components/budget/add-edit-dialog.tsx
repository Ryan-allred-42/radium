import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface CustomCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

const defaultExpenseCategories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Savings",
  "Personal",
  "Entertainment",
  "Other",
];

const defaultIncomeCategories = [
  "Salary",
  "Other",
];

interface AddEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    value: number;
    category: string;
    transaction_type: "income" | "expense";
  }) => void;
  type: "planned" | "transaction";
  defaultValues?: {
    title: string;
    value: number;
    category: string;
    transaction_type: "income" | "expense";
  };
}

export function AddEditDialog({
  open,
  onOpenChange,
  onSubmit,
  type,
  defaultValues,
}: AddEditDialogProps) {
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [value, setValue] = useState(defaultValues?.value?.toString() || "");
  const [category, setCategory] = useState(defaultValues?.category || "");
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    defaultValues?.transaction_type || "expense"
  );
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCustomCategories = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: customCategoriesData } = await supabase
        .from("custom_categories")
        .select("*")
        .eq("userid", user.id)
        .is("deleted_at", null);

      if (customCategoriesData) {
        setCustomCategories(customCategoriesData as CustomCategory[]);
      }
    };

    if (open) {
      fetchCustomCategories();
    }
  }, [open]);

  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title);
      setValue(defaultValues.value.toString());
      setCategory(defaultValues.category);
      setTransactionType(defaultValues.transaction_type);
    } else {
      setTitle("");
      setValue("");
      setCategory("");
      setTransactionType("expense");
    }
  }, [defaultValues, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      value: parseFloat(value),
      category,
      transaction_type: transactionType,
    });
    onOpenChange(false);
    // Reset form
    setTitle("");
    setValue("");
    setCategory("");
    setTransactionType("expense");
  };

  const categories = transactionType === "income"
    ? [...defaultIncomeCategories, ...customCategories.filter(cat => cat.type === 'income').map(cat => cat.name)]
    : [...defaultExpenseCategories, ...customCategories.filter(cat => cat.type === 'expense').map(cat => cat.name)];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-neutral-800">
        <DialogHeader>
          <DialogTitle>
            Add {type === "planned" ? "Planned Budget Item" : "Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Rent, Groceries, Salary"
              required
              className="bg-white dark:bg-neutral-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Amount</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              required
              className="bg-white dark:bg-neutral-800"
            />
          </div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select
              value={transactionType}
              onValueChange={(value: "income" | "expense") => setTransactionType(value)}
            >
              <SelectTrigger className="bg-white dark:bg-neutral-800">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-800">
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              required
            >
              <SelectTrigger className="bg-white dark:bg-neutral-800">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-neutral-800">
                {categories.map((cat) => (
                  <SelectItem 
                    key={cat} 
                    value={cat.toLowerCase()}
                    className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">
            {type === "planned" ? "Add to Budget" : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 