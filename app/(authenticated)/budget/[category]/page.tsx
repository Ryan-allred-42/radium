"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { BudgetItemCard } from "@/components/budget/budget-item-card";
import { AddEditDialog } from "@/components/budget/add-edit-dialog";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface Transaction {
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

export default function CategoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plannedAmount, setPlannedAmount] = useState(0);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [editingItem, setEditingItem] = useState<Transaction | null>(null);
  
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const category = decodeURIComponent(params.category as string);

  // Initialize date from URL parameter
  useEffect(() => {
    const monthParam = searchParams.get("month");
    if (monthParam) {
      setCurrentDate(new Date(monthParam));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch transactions
      const { data: transactionData } = await supabase
        .from("transactions")
        .select("*")
        .eq("userid", user.id)
        .eq("category", category)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .is("deleted_at", null);

      // Fetch planned budget for this category
      const { data: plannedData } = await supabase
        .from("planned_budget")
        .select("*")
        .eq("userid", user.id)
        .eq("category", category)
        .gte("date", startDate.toISOString())
        .lte("date", endDate.toISOString())
        .is("deleted_at", null);

      setTransactions(transactionData || []);
      setPlannedAmount(plannedData?.[0]?.value?.[category] || 0);
    };

    fetchData();
  }, [currentDate, category]);

  const changeMonth = (increment: number) => {
    const newDate = addMonths(currentDate, increment);
    setCurrentDate(newDate);
    // Update URL with new month
    const params = new URLSearchParams();
    // Copy over existing params
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    params.set("month", newDate.toISOString());
    router.push(`/budget/${category}?${params.toString()}`);
  };

  const totalSpent = transactions.reduce((sum, transaction) => {
    return sum + Object.values(transaction.value)[0];
  }, 0);

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setTransactions(transactions.filter((item) => item.id !== id));
    }
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingItem(transaction);
    setIsEditingTransaction(true);
  };

  const handleEditSubmit = async (data: AddEditData) => {
    if (!editingItem) return;

    const updatedItem = {
      ...editingItem,
      title: { [data.title]: data.title },
      value: { [data.title]: data.value },
      category: data.category,
      transaction_type: data.transaction_type,
    };

    const { error } = await supabase
      .from("transactions")
      .update({
        title: updatedItem.title,
        value: updatedItem.value,
        category: updatedItem.category,
        transaction_type: updatedItem.transaction_type,
      })
      .eq("id", editingItem.id);

    if (!error) {
      setTransactions(transactions.map((t) => 
        t.id === editingItem.id ? updatedItem : t
      ));
    }

    setIsEditingTransaction(false);
    setEditingItem(null);
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

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-center gap-4">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => router.back()}
        >
          <IconArrowLeft className="h-4 w-4 mr-2" />
          Back to Budget
        </Button>
        <h1 className="text-3xl font-bold capitalize">{category}</h1>
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
        <Button onClick={() => setIsAddingTransaction(true)} className="ml-auto">
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${plannedAmount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Monthly allocation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSpent.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Total expenses this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(plannedAmount - totalSpent) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              ${(plannedAmount - totalSpent).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              Available to spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions.length > 0 ? (
            transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <BudgetItemCard
                  key={transaction.id}
                  item={transaction}
                  onEdit={() => handleEditClick(transaction)}
                  onDelete={() => handleDelete(transaction.id)}
                />
              ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found for this category in {format(currentDate, "MMMM yyyy")}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialogs */}
      <AddEditDialog
        open={isAddingTransaction}
        onOpenChange={setIsAddingTransaction}
        onSubmit={handleAddTransaction}
        type="transaction"
        defaultValues={{
          title: "",
          value: 0,
          category: category,
          transaction_type: "expense",
        }}
      />
      {editingItem && (
        <AddEditDialog
          open={isEditingTransaction}
          onOpenChange={setIsEditingTransaction}
          onSubmit={handleEditSubmit}
          type="transaction"
          defaultValues={{
            title: Object.values(editingItem.title)[0],
            value: Object.values(editingItem.value)[0],
            category: editingItem.category,
            transaction_type: editingItem.transaction_type,
          }}
        />
      )}
    </div>
  );
} 