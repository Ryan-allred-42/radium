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
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isAddingIncomeCategory, setIsAddingIncomeCategory] = useState(false);
  const [isAddingExpenseCategory, setIsAddingExpenseCategory] = useState(false);

  const supabase = createClientComponentClient();

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

      const { data: plannedData } = await supabase
        .from("planned_budget")
        .select("*")
        .eq("userid", user.id)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .is("deleted_at", null);

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
          title: { [data.category]: data.category },
          value: { [data.category]: data.value },
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
        <div className="flex gap-2 ml-auto">
          <Button onClick={() => setIsAddingPlanned(true)}>Add Planned Item</Button>
          <Button onClick={() => setIsAddingTransaction(true)}>Add Transaction</Button>
        </div>
      </div>

      {/* Combined Summary Card */}
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg">Financial Summary</CardTitle>
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
                  <tr key={summary.category} className="border-b">
                    <td className="py-2 capitalize w-1/4">{summary.category}</td>
                    <td className="text-right py-2 w-1/4">
                      <div className="flex justify-end">
                        <span className="mr-1">$</span>
                        <input
                          type="number"
                          value={summary.planned || 0}
                          onChange={(e) => handlePlannedValueChange(
                            summary.category,
                            parseFloat(e.target.value) || 0,
                            "income"
                          )}
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
                  <tr key={summary.category} className="border-b">
                    <td className="py-2 capitalize w-1/4">{summary.category}</td>
                    <td className="text-right py-2 w-1/4">
                      <div className="flex justify-end">
                        <span className="mr-1">$</span>
                        <input
                          type="number"
                          value={summary.planned || 0}
                          onChange={(e) => handlePlannedValueChange(
                            summary.category,
                            parseFloat(e.target.value) || 0,
                            "expense"
                          )}
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

      {/* Detailed Lists */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Planned Budget Items */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader>
            <CardTitle>Planned Budget Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {plannedBudget.map((item) => (
              <BudgetItemCard
                key={item.id}
                item={item}
                onEdit={(updatedItem) => handleEdit(updatedItem, "planned")}
                onDelete={() => handleDelete(item.id, "planned")}
              />
            ))}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((item) => (
              <BudgetItemCard
                key={item.id}
                item={item}
                onEdit={(updatedItem) => handleEdit(updatedItem, "transaction")}
                onDelete={() => handleDelete(item.id, "transaction")}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialogs */}
      <AddEditDialog
        open={isAddingPlanned}
        onOpenChange={setIsAddingPlanned}
        onSubmit={(data) => handleAddItem("planned", data)}
        type="planned"
      />
      <AddEditDialog
        open={isAddingTransaction}
        onOpenChange={setIsAddingTransaction}
        onSubmit={(data) => handleAddItem("transaction", data)}
        type="transaction"
      />
      <AddCategoryDialog
        open={isAddingIncomeCategory}
        onOpenChange={setIsAddingIncomeCategory}
        type="income"
        onSuccess={() => {
          // Refresh data
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
          // Refresh data
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
    </div>
  );
} 