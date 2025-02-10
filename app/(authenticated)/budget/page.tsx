"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { BudgetItemCard } from "@/components/budget/budget-item-card";
import { AddEditDialog } from "@/components/budget/add-edit-dialog";
import { AddCategoryDialog } from "@/components/budget/add-category-dialog";
import { IconArrowLeft, IconArrowRight, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface BudgetItem {
  id: string;
  title: { [key: string]: string };
  value: { [key: string]: number };
  category: string;
  transaction_type: "income" | "expense";
  date: string;
}

interface AddEditData {
  title: string;
  value: number;
  category: string;
  transaction_type: "income" | "expense";
}

interface CategorySummary {
  category: string;
  planned: number;
  spent: number;
  remaining: number;
}

interface CustomCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export default function BudgetPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [plannedBudget, setPlannedBudget] = useState<BudgetItem[]>([]);
  const [transactions, setTransactions] = useState<BudgetItem[]>([]);
  const [isAddingPlanned, setIsAddingPlanned] = useState(false);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState<"income" | "expense">("expense");
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isAddingIncomeCategory, setIsAddingIncomeCategory] = useState(false);
  const [isAddingExpenseCategory, setIsAddingExpenseCategory] = useState(false);
  const [showBudgetInitModal, setShowBudgetInitModal] = useState(false);
  const [hasPlannedItems, setHasPlannedItems] = useState(false);
  const [mostRecentBudgetMonth, setMostRecentBudgetMonth] = useState<Date | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  // Fetch data for the current month
  useEffect(() => {
    const fetchData = async () => {
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch custom categories
      const { data: customCategoriesData } = await supabase
        .from("custom_categories")
        .select("*")
        .eq("userid", user.id)
        .is("deleted_at", null);

      if (customCategoriesData) {
        setCustomCategories(customCategoriesData as CustomCategory[]);
      }

      // Check for planned items in current month
      const { data: plannedData } = await supabase
        .from("planned_budget")
        .select("*")
        .eq("userid", user.id)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .is("deleted_at", null);

      // If no planned items for current month, check for most recent month with planned items
      if (!plannedData?.length) {
        const { data: mostRecentPlanned } = await supabase
          .from("planned_budget")
          .select("*")
          .eq("userid", user.id)
          .is("deleted_at", null)
          .order("date", { ascending: false })
          .limit(1);

        if (mostRecentPlanned?.length) {
          setMostRecentBudgetMonth(new Date(mostRecentPlanned[0].date));
          setHasPlannedItems(true);
        }
        setShowBudgetInitModal(true);
      }

      const { data: transactionData } = await supabase
        .from("transactions")
        .select("*")
        .eq("userid", user.id)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .is("deleted_at", null);

      setPlannedBudget(plannedData || []);
      setTransactions(transactionData || []);
    };

    fetchData();
  }, [currentDate]);

  const handleAddItem = async (
    type: "planned" | "transaction",
    data: AddEditData
  ) => {
    const table = type === "planned" ? "planned_budget" : "transactions";
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newItem, error } = await supabase
      .from(table)
      .insert([
        {
          userid: user.id,
          title: { [data.title]: data.title },
          value: { [data.title]: data.value },
          category: data.category,
          transaction_type: data.transaction_type,
          date: format(currentDate, "yyyy-MM-dd"),
        },
      ])
      .select()
      .single();

    if (!error && newItem) {
      if (type === "planned") {
        setPlannedBudget([...plannedBudget, newItem]);
      } else {
        setTransactions([...transactions, newItem]);
      }
    }
  };

  const handleEdit = async (item: BudgetItem, type: "planned" | "transaction") => {
    const table = type === "planned" ? "planned_budget" : "transactions";
    const { error } = await supabase
      .from(table)
      .update({
        title: item.title,
        value: item.value,
        category: item.category,
        transaction_type: item.transaction_type,
      })
      .eq("id", item.id);

    if (!error) {
      const updatedItems = type === "planned" ? plannedBudget : transactions;
      const newItems = updatedItems.map((i) => (i.id === item.id ? item : i));
      if (type === "planned") {
        setPlannedBudget(newItems);
      } else {
        setTransactions(newItems);
      }
    }
  };

  const handleDelete = async (id: string, type: "planned" | "transaction") => {
    const table = type === "planned" ? "planned_budget" : "transactions";
    const { error } = await supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      if (type === "planned") {
        setPlannedBudget(plannedBudget.filter((item) => item.id !== id));
      } else {
        setTransactions(transactions.filter((item) => item.id !== id));
      }
    }
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(addMonths(currentDate, increment));
  };

  // Define all possible categories including custom ones
  const allCategories = [
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
    ...customCategories
      .filter(cat => cat.type === 'expense')
      .map(cat => cat.name)
  ];

  const incomeCategories = [
    "Salary",
    "Other",
    ...customCategories
      .filter(cat => cat.type === 'income')
      .map(cat => cat.name)
  ];

  // Calculate summaries for each category
  const calculateCategorySummaries = (type: "income" | "expense"): CategorySummary[] => {
    const categories = type === "income" ? incomeCategories : allCategories;
    return categories.map((category) => {
      const planned = plannedBudget
        .filter(
          (item) =>
            item.transaction_type === type && item.category.toLowerCase() === category.toLowerCase()
        )
        .reduce((sum, item) => sum + Object.values(item.value)[0], 0);

      const spent = transactions
        .filter(
          (item) =>
            item.transaction_type === type && item.category.toLowerCase() === category.toLowerCase()
        )
        .reduce((sum, item) => sum + Object.values(item.value)[0], 0);

      return {
        category,
        planned,
        spent,
        remaining: planned - spent,
      };
    });
  };

  const incomeSummaries = calculateCategorySummaries("income");
  const expenseSummaries = calculateCategorySummaries("expense");

  const totalPlannedIncome = incomeSummaries.reduce((sum, item) => sum + item.planned, 0);
  const totalActualIncome = incomeSummaries.reduce((sum, item) => sum + item.spent, 0);
  const totalPlannedExpenses = expenseSummaries.reduce((sum, item) => sum + item.planned, 0);
  const totalActualExpenses = expenseSummaries.reduce((sum, item) => sum + item.spent, 0);

  const handlePlannedValueChange = async (category: string, value: number, type: "income" | "expense") => {
    // Find existing planned item for this category and type for the current month
    const existingItem = plannedBudget.find(
      item => 
        item.category.toLowerCase() === category.toLowerCase() && 
        item.transaction_type === type &&
        format(new Date(item.date), "yyyy-MM") === format(currentDate, "yyyy-MM")
    );

    if (existingItem) {
      // Update existing item
      const updatedItem = {
        ...existingItem,
        title: { [category]: category },
        value: { [category]: value }
      };
      await handleEdit(updatedItem, "planned");
    } else {
      // Create new planned item
      const newItemData: AddEditData = {
        title: category,
        value: value,
        category: category,
        transaction_type: type
      };
      await handleAddItem("planned", newItemData);
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/budget/${encodeURIComponent(category.toLowerCase())}?month=${currentDate.toISOString()}`);
  };

  const handleQuickAddTransaction = (category: string, type: "income" | "expense", e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking the button
    setSelectedCategory(category);
    setSelectedTransactionType(type);
    setIsAddingTransaction(true);
  };

  const handleAddTransaction = async (data: AddEditData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newItem, error } = await supabase
      .from("transactions")
      .insert([
        {
          userid: user.id,
          title: { [data.title]: data.title },
          value: { [data.title]: data.value },
          category: data.category,
          transaction_type: data.transaction_type,
          date: format(currentDate, "yyyy-MM-dd"),
        },
      ])
      .select()
      .single();

    if (!error && newItem) {
      setTransactions([...transactions, newItem]);
    }
  };

  const copyBudgetFromTemplate = async () => {
    if (!mostRecentBudgetMonth) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch template month's planned items
    const { data: templateItems } = await supabase
      .from("planned_budget")
      .select("*")
      .eq("userid", user.id)
      .gte("date", startOfMonth(mostRecentBudgetMonth).toISOString())
      .lte("date", endOfMonth(mostRecentBudgetMonth).toISOString())
      .is("deleted_at", null);

    if (templateItems) {
      // Create new planned items for current month
      const newItems = templateItems.map(item => ({
        userid: user.id,
        title: item.title,
        value: item.value,
        category: item.category,
        transaction_type: item.transaction_type,
        date: format(currentDate, "yyyy-MM-dd"),
      }));

      const { data: insertedItems } = await supabase
        .from("planned_budget")
        .insert(newItems)
        .select();

      if (insertedItems) {
        setPlannedBudget(insertedItems);
      }
    }

    setShowBudgetInitModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-3xl font-bold">Budget</h1>
        <Card className="inline-flex bg-white dark:bg-neutral-800">
          <CardContent className="flex items-center gap-4 p-2">
            <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[140px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <div className="flex gap-2 items-center ml-auto">
          <Button onClick={() => {
            setSelectedCategory(null);
            setSelectedTransactionType("expense");
            setIsAddingTransaction(true);
          }}>Add Transaction</Button>
        </div>
      </div>

      {/* Combined Summary Card */}
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-8">
            {/* Income Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">Income</h3>
              <div className="flex justify-between">
                <span>Planned:</span>
                <span className="font-medium">${totalPlannedIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual:</span>
                <span className="font-medium">${totalActualIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Difference:</span>
                <span className={`font-medium ${totalActualIncome >= totalPlannedIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${(totalActualIncome - totalPlannedIncome).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Expense Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">Expenses</h3>
              <div className="flex justify-between">
                <span>Planned:</span>
                <span className="font-medium">${totalPlannedExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual:</span>
                <span className="font-medium">${totalActualExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className={`font-medium ${totalPlannedExpenses >= totalActualExpenses ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${(totalPlannedExpenses - totalActualExpenses).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Net Summary */}
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">Net</h3>
              <div className="flex justify-between">
                <span>Planned:</span>
                <span className="font-medium">${(totalPlannedIncome - totalPlannedExpenses).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Actual:</span>
                <span className="font-medium">${(totalActualIncome - totalActualExpenses).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Difference:</span>
                <span className={`font-medium ${(totalActualIncome - totalActualExpenses) >= (totalPlannedIncome - totalPlannedExpenses) ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${((totalActualIncome - totalActualExpenses) - (totalPlannedIncome - totalPlannedExpenses)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Categories */}
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle>Income Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 w-1/4">Category</th>
                  <th className="text-right py-2 w-1/4">Planned</th>
                  <th className="text-right py-2 w-1/4">Actual</th>
                  <th className="text-right py-2 w-1/4">Difference</th>
                </tr>
              </thead>
              <tbody>
                {incomeSummaries.map((summary) => (
                  <tr 
                    key={summary.category} 
                    className="border-b cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    onClick={() => handleCategoryClick(summary.category)}
                  >
                    <td className="py-2 capitalize w-1/4">
                      <div className="flex items-center gap-2">
                        {summary.category}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleQuickAddTransaction(summary.category, "income", e)}
                        >
                          <IconPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="text-right py-2 w-1/4">
                      <div className="flex justify-end">
                        <span className="mr-1">$</span>
                        <input
                          type="number"
                          value={summary.planned || 0}
                          onChange={(e) => {
                            e.stopPropagation();
                            handlePlannedValueChange(
                              summary.category,
                              parseFloat(e.target.value) || 0,
                              "income"
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-24 text-right bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary py-1"
                        />
                      </div>
                    </td>
                    <td className="text-right py-2 w-1/4">${summary.spent.toLocaleString()}</td>
                    <td className={`text-right py-2 w-1/4 ${summary.spent >= summary.planned ? 'text-emerald-500' : 'text-red-500'}`}>
                      ${(summary.spent - summary.planned).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="py-2">
                    <Button
                      variant="ghost"
                      className="w-auto flex items-center justify-start gap-2 text-blue-500 hover:text-blue-600 px-0"
                      onClick={() => setIsAddingIncomeCategory(true)}
                    >
                      <IconPlus className="h-4 w-4" />
                      Add category
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 w-1/4">Category</th>
                  <th className="text-right py-2 w-1/4">Planned</th>
                  <th className="text-right py-2 w-1/4">Spent</th>
                  <th className="text-right py-2 w-1/4">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {expenseSummaries.map((summary) => (
                  <tr 
                    key={summary.category} 
                    className="border-b cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    onClick={() => handleCategoryClick(summary.category)}
                  >
                    <td className="py-2 capitalize w-1/4">
                      <div className="flex items-center gap-2">
                        {summary.category}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleQuickAddTransaction(summary.category, "expense", e)}
                        >
                          <IconPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="text-right py-2 w-1/4">
                      <div className="flex justify-end">
                        <span className="mr-1">$</span>
                        <input
                          type="number"
                          value={summary.planned || 0}
                          onChange={(e) => {
                            e.stopPropagation();
                            handlePlannedValueChange(
                              summary.category,
                              parseFloat(e.target.value) || 0,
                              "expense"
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-24 text-right bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary py-1"
                        />
                      </div>
                    </td>
                    <td className="text-right py-2 w-1/4">${summary.spent.toLocaleString()}</td>
                    <td className={`text-right py-2 w-1/4 ${summary.remaining >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      ${summary.remaining.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="py-2">
                    <Button
                      variant="ghost"
                      className="w-auto flex items-center justify-start gap-2 text-blue-500 hover:text-blue-600 px-0"
                      onClick={() => setIsAddingExpenseCategory(true)}
                    >
                      <IconPlus className="h-4 w-4" />
                      Add category
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialogs */}
      <AddEditDialog
        open={isAddingTransaction}
        onOpenChange={(open) => {
          setIsAddingTransaction(open);
          if (!open) {
            setSelectedCategory(null);
            setSelectedTransactionType("expense");
          }
        }}
        onSubmit={handleAddTransaction}
        type="transaction"
        defaultValues={{
          title: "",
          value: 0,
          category: selectedCategory || "",
          transaction_type: selectedTransactionType,
        }}
      />
      <AddEditDialog
        open={isAddingPlanned}
        onOpenChange={setIsAddingPlanned}
        onSubmit={(data) => handleAddItem("planned", data)}
        type="planned"
        defaultValues={{
          title: "",
          value: 0,
          category: "",
          transaction_type: "expense",
        }}
      />
      <AddCategoryDialog
        open={isAddingIncomeCategory}
        onOpenChange={setIsAddingIncomeCategory}
        type="income"
        onSuccess={() => {
          const fetchData = async () => {
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
          fetchData();
        }}
      />
      <AddCategoryDialog
        open={isAddingExpenseCategory}
        onOpenChange={setIsAddingExpenseCategory}
        type="expense"
        onSuccess={() => {
          const fetchData = async () => {
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
          fetchData();
        }}
      />

      {/* Add Budget Init Modal */}
      <Dialog open={showBudgetInitModal} onOpenChange={setShowBudgetInitModal}>
        <DialogContent className="bg-white dark:bg-neutral-800">
          <DialogHeader>
            <DialogTitle>
              {hasPlannedItems 
                ? `Create budget for ${format(currentDate, "MMMM yyyy")}`
                : "Welcome to your budgets!"}
            </DialogTitle>
            <DialogDescription>
              {hasPlannedItems ? (
                <div className="space-y-4 pt-2">
                  <p>Would you like to:</p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      onClick={copyBudgetFromTemplate}
                    >
                      1. Start with a template from {format(mostRecentBudgetMonth!, "MMMM yyyy")} (recommended)
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => setShowBudgetInitModal(false)}
                    >
                      2. Start from scratch
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <p>
                    Add planned category expenses to get started. Next month, you can use this month's values as a template so it'll be faster.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => setShowBudgetInitModal(false)}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
} 