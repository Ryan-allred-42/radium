"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconWallet, IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonthRangePicker } from "@/components/ui/month-range-picker";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import React from "react";

interface CustomCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

interface Transaction {
  id: string;
  date: string;
  title: { [key: string]: string };
  value: { [key: string]: number };
  transaction_type: 'income' | 'expense';
  category: string;
}

interface NetWorthLog {
  id: string;
  date: string;
  title: { [key: string]: string };
  value: { [key: string]: number };
}

type ChartType = 'income' | 'expenses' | 'income-vs-expenses' | 'net-worth';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [netWorthLogs, setNetWorthLogs] = useState<NetWorthLog[]>([]);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('income');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIncomeCategories, setSelectedIncomeCategories] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(subMonths(new Date(), 11)),
    to: endOfMonth(new Date()),
  });
  
  const supabase = createClientComponentClient();

  // Create a memoized color mapping for categories
  const categoryColors = React.useMemo(() => {
    const modernColors = [
      '#94A3B8', // slate-400
      '#64748B', // slate-500
      '#475569', // slate-600
      '#0EA5E9', // sky-500
      '#0284C7', // sky-600
      '#0369A1', // sky-700
      '#8B5CF6', // violet-500
      '#7C3AED', // violet-600
      '#6D28D9', // violet-700
      '#EC4899', // pink-500
      '#DB2777', // pink-600
      '#BE185D', // pink-700
    ];

    const categories = Array.from(
      new Set(
        transactions
          .filter(t => t.transaction_type === 'expense')
          .map(t => t.category)
      )
    ).sort();

    return Object.fromEntries(
      categories.map((category, index) => [
        category,
        modernColors[index % modernColors.length]
      ])
    );
  }, [transactions]);

  // Create a memoized color mapping for income categories
  const incomeCategoryColors = React.useMemo(() => {
    const modernColors = [
      '#10B981', // emerald-500
      '#059669', // emerald-600
      '#047857', // emerald-700
      '#34D399', // emerald-400
      '#6EE7B7', // emerald-300
      '#A7F3D0', // emerald-200
    ];

    const categories = Array.from(
      new Set(
        transactions
          .filter(t => t.transaction_type === 'income')
          .map(t => t.category)
      )
    ).sort();

    return Object.fromEntries(
      categories.map((category, index) => [
        category,
        modernColors[index % modernColors.length]
      ])
    );
  }, [transactions]);

  useEffect(() => {
    const fetchData = async () => {
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

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from("transactions")
        .select("*")
        .eq("userid", user.id)
        .gte("date", format(dateRange.from, "yyyy-MM-dd"))
        .lte("date", format(endOfMonth(dateRange.to), "yyyy-MM-dd"))
        .is("deleted_at", null)
        .order("date", { ascending: false });

      if (transactionsData) {
        setTransactions(transactionsData as Transaction[]);
      }

      // Fetch net worth logs
      const { data: netWorthData } = await supabase
        .from("net_worth_log")
        .select("*")
        .eq("userid", user.id)
        .gte("date", format(dateRange.from, "yyyy-MM-dd"))
        .lte("date", format(endOfMonth(dateRange.to), "yyyy-MM-dd"))
        .is("deleted_at", null)
        .order("date", { ascending: false });

      if (netWorthData) {
        setNetWorthLogs(netWorthData as NetWorthLog[]);
      }
    };

    fetchData();
  }, [dateRange]);

  // Calculate metrics
  const totalIncome = transactions
    .filter(t => {
      if (selectedChartType === 'income' && selectedIncomeCategories.length > 0) {
        return t.transaction_type === 'income' && selectedIncomeCategories.includes(t.category);
      }
      return t.transaction_type === 'income';
    })
    .reduce((sum, t) => sum + Object.values(t.value).reduce((a, b) => a + b, 0), 0);

  const totalExpenses = transactions
    .filter(t => {
      if (selectedChartType === 'expenses' && selectedCategories.length > 0) {
        return t.transaction_type === 'expense' && selectedCategories.includes(t.category);
      }
      return t.transaction_type === 'expense';
    })
    .reduce((sum, t) => sum + Object.values(t.value).reduce((a, b) => a + b, 0), 0);

  const netAmount = totalIncome - totalExpenses;

  // Calculate monthly averages
  const monthDiff = Math.max(1, Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24 * 30)));
  const averageMonthlyIncome = totalIncome / monthDiff;
  const averageMonthlyExpenses = totalExpenses / monthDiff;
  const averageMonthlyNet = netAmount / monthDiff;

  // Calculate growth trends
  const calculateGrowthTrend = (data: { month: string; value: number }[]) => {
    if (data.length < 2) return 0;
    const sortedData = [...data].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    const firstValue = sortedData[0].value;
    const lastValue = sortedData[sortedData.length - 1].value;
    return firstValue !== 0 ? ((lastValue - firstValue) / Math.abs(firstValue)) * 100 : 0;
  };

  const getMonthlyData = () => {
    const incomeData = transactions
      .filter(t => t.transaction_type === 'income')
      .reduce((acc, t) => {
        const month = format(new Date(t.date), 'MMM yyyy');
        const value = Object.values(t.value).reduce((sum, v) => sum + v, 0);
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.value += value;
        } else {
          acc.push({ month, value });
        }
        return acc;
      }, [] as { month: string; value: number }[]);

    const expenseData = transactions
      .filter(t => {
        if (selectedChartType === 'expenses' && selectedCategories.length > 0) {
          return t.transaction_type === 'expense' && selectedCategories.includes(t.category);
        }
        return t.transaction_type === 'expense';
      })
      .reduce((acc, t) => {
        const month = format(new Date(t.date), 'MMM yyyy');
        const value = Object.values(t.value).reduce((sum, v) => sum + v, 0);
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.value += value;
        } else {
          acc.push({ month, value });
        }
        return acc;
      }, [] as { month: string; value: number }[]);

    const netData = transactions
      .filter(t => {
        if (t.transaction_type === 'expense' && selectedChartType === 'expenses' && selectedCategories.length > 0) {
          return selectedCategories.includes(t.category);
        }
        return true;
      })
      .reduce((acc, t) => {
        const month = format(new Date(t.date), 'MMM yyyy');
        const value = Object.values(t.value).reduce((sum, v) => sum + v, 0) * (t.transaction_type === 'income' ? 1 : -1);
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.value += value;
        } else {
          acc.push({ month, value });
        }
        return acc;
      }, [] as { month: string; value: number }[]);

    return { incomeData, expenseData, netData };
  };

  const { incomeData, expenseData, netData } = getMonthlyData();
  const incomeTrend = calculateGrowthTrend(incomeData);
  const expenseTrend = calculateGrowthTrend(expenseData);
  const netTrend = calculateGrowthTrend(netData);

  const calculateTotalNetWorth = (entry: NetWorthLog) => {
    return Object.values(entry.value).reduce((sum, value) => sum + value, 0);
  };

  const latestNetWorth = netWorthLogs.length > 0 
    ? calculateTotalNetWorth(netWorthLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0])
    : 0;

  // Prepare chart data based on selected type
  const prepareChartData = () => {
    switch (selectedChartType) {
      case 'income':
        return transactions
          .filter(t => {
            if (selectedIncomeCategories.length > 0) {
              return t.transaction_type === 'income' && selectedIncomeCategories.includes(t.category);
            }
            return t.transaction_type === 'income';
          })
          .reduce((acc, t) => {
            const month = format(new Date(t.date), 'MMM yyyy');
            const value = Object.values(t.value).reduce((sum, v) => sum + v, 0);
            const existing = acc.find(item => item.month === month);
            if (existing) {
              existing.value += value;
            } else {
              acc.push({ month, value });
            }
            return acc;
          }, [] as { month: string; value: number }[])
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      case 'expenses':
        const expensesByCategory = transactions
          .filter(t => t.transaction_type === 'expense')
          .reduce((acc, t) => {
            const month = format(new Date(t.date), 'MMM yyyy');
            const value = Object.values(t.value).reduce((sum, v) => sum + v, 0);
            if (!acc[month]) acc[month] = {};
            if (!acc[month][t.category]) acc[month][t.category] = 0;
            acc[month][t.category] += value;
            return acc;
          }, {} as { [key: string]: { [key: string]: number } });

        return Object.entries(expensesByCategory).map(([month, categories]) => ({
          month,
          ...categories,
        }));

      case 'income-vs-expenses':
        return transactions.reduce((acc, t) => {
          const month = format(new Date(t.date), 'MMM yyyy');
          const value = Object.values(t.value).reduce((sum, v) => sum + v, 0);
          const existing = acc.find(item => item.month === month);

          // Only include transactions that match the selected categories
          const shouldInclude = 
            (t.transaction_type === 'income' && (!selectedIncomeCategories.length || selectedIncomeCategories.includes(t.category))) ||
            (t.transaction_type === 'expense' && (!selectedCategories.length || selectedCategories.includes(t.category)));

          if (!shouldInclude) return acc;

          if (existing) {
            if (t.transaction_type === 'income') {
              existing.income += value;
            } else {
              existing.expenses += value;
            }
            existing.net = existing.income - existing.expenses;
          } else {
            acc.push({
              month,
              income: t.transaction_type === 'income' ? value : 0,
              expenses: t.transaction_type === 'expense' ? value : 0,
              net: t.transaction_type === 'income' ? value : -value,
            });
          }
          return acc;
        }, [] as { month: string; income: number; expenses: number; net: number }[])
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      case 'net-worth':
        return netWorthLogs
          .map(log => ({
            date: format(new Date(log.date), 'MMM yyyy'),
            value: calculateTotalNetWorth(log),
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      default:
        return [];
    }
  };

  const renderChart = () => {
    const data = prepareChartData();

    // Common empty state component
    const EmptyState = ({ message }: { message: string }) => (
      <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
        <p className="text-lg">{message}</p>
        <p className="text-sm mt-2">Add some transactions to see your data here.</p>
      </div>
    );

    if (!data || data.length === 0) {
      switch (selectedChartType) {
        case 'income':
          return <EmptyState message="No income data for the selected period" />;
        case 'expenses':
          return <EmptyState message="No expense data for the selected period" />;
        case 'income-vs-expenses':
          return <EmptyState message="No transaction data for the selected period" />;
        case 'net-worth':
          return <EmptyState message="No net worth data for the selected period" />;
        default:
          return <EmptyState message="No data available" />;
      }
    }

    if (selectedChartType === 'net-worth') {
      const netWorthData = data.filter((item): item is { date: string; value: number } => 
        'date' in item && 'value' in item
      );
      
      const sortedEntries = netWorthData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sortedEntries} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Net Worth"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    switch (selectedChartType) {
      case 'income':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'expenses':
        const categories = Array.from(
          new Set([
            ...transactions
              .filter(t => t.transaction_type === 'expense')
              .map(t => t.category),
            ...customCategories
              .filter(cat => cat.type === 'expense')
              .map(cat => cat.name)
          ])
        ).sort();

        // If no categories are selected, show all categories
        const activeCategories = selectedCategories.length > 0 ? selectedCategories : categories;

        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {activeCategories.map((category) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={categoryColors[category]}
                  maxBarSize={50}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'income-vs-expenses':
        if (selectedCategories.length > 0) {
          const incomeCategories = Array.from(
            new Set([
              ...transactions
                .filter(t => t.transaction_type === 'income')
                .map(t => t.category),
              ...customCategories
                .filter(cat => cat.type === 'income')
                .map(cat => cat.name)
            ])
          ).sort();

          const expenseCategories = Array.from(
            new Set([
              ...transactions
                .filter(t => t.transaction_type === 'expense')
                .map(t => t.category),
              ...customCategories
                .filter(cat => cat.type === 'expense')
                .map(cat => cat.name)
            ])
          ).sort();

          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {incomeCategories.map((category) => (
                  <Bar
                    key={`income-${category}`}
                    dataKey={category}
                    stackId="income"
                    name={`Income - ${category}`}
                    fill={incomeCategoryColors[category]}
                    maxBarSize={50}
                  />
                ))}
                {expenseCategories.map((category) => (
                  <Bar
                    key={`expense-${category}`}
                    dataKey={category}
                    stackId="expense"
                    name={`Expense - ${category}`}
                    fill={categoryColors[category]}
                    maxBarSize={50}
                  />
                ))}
                <Bar dataKey="net" fill="#171717" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          );
        } else {
          return (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="#10B981" maxBarSize={50} />
                <Bar dataKey="expenses" fill="#EF4444" maxBarSize={50} />
                <Bar dataKey="net" fill="#171717" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          );
        }
    }
  };

  const renderDetailedData = () => {
    // Common empty state component for details
    const EmptyState = ({ message }: { message: string }) => (
      <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
        <p className="text-sm">{message}</p>
      </div>
    );

    switch (selectedChartType) {
      case 'income':
        const incomeTransactions = transactions.filter(t => t.transaction_type === 'income');
        if (incomeTransactions.length === 0) {
          return <EmptyState message="No income transactions to display" />;
        }
        return (
          <div className="space-y-4 h-[400px] overflow-y-auto">
            {incomeTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(transaction => {
                const title = Object.values(transaction.title)[0];
                const value = Object.values(transaction.value)[0];
                return (
                  <Card key={transaction.id} className="bg-white dark:bg-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-emerald-500 font-semibold">
                        +${value.toLocaleString()}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
          </div>
        );

      case 'expenses':
        const expenseTransactions = transactions.filter(t => t.transaction_type === 'expense');
        if (expenseTransactions.length === 0) {
          return <EmptyState message="No expense transactions to display" />;
        }
        return (
          <div className="space-y-4 h-[400px] overflow-y-auto">
            {expenseTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(transaction => {
                const title = Object.values(transaction.title)[0];
                const value = Object.values(transaction.value)[0];
                return (
                  <Card key={transaction.id} className="bg-white dark:bg-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                          <span>•</span>
                          <span className="capitalize">{transaction.category}</span>
                        </div>
                      </div>
                      <div className="text-red-500 font-semibold">
                        -${value.toLocaleString()}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
          </div>
        );

      case 'income-vs-expenses':
        if (transactions.length === 0) {
          return <EmptyState message="No transactions to display" />;
        }
        return (
          <div className="space-y-4 h-[400px] overflow-y-auto">
            {transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(transaction => {
                const title = Object.values(transaction.title)[0];
                const value = Object.values(transaction.value)[0];
                const isIncome = transaction.transaction_type === 'income';
                return (
                  <Card key={transaction.id} className="bg-white dark:bg-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                          {!isIncome && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{transaction.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={`font-semibold ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isIncome ? '+' : '-'}${value.toLocaleString()}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
          </div>
        );

      case 'net-worth':
        if (netWorthLogs.length === 0) {
          return <EmptyState message="No net worth entries to display" />;
        }
        return (
          <div className="space-y-4 h-[400px] overflow-y-auto">
            {netWorthLogs
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(log => {
                const totalNetWorth = calculateTotalNetWorth(log);
                return (
                  <Card key={log.id} className="bg-white dark:bg-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-sm font-medium">Net Worth Log</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(log.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className={`font-semibold ${totalNetWorth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        ${totalNetWorth.toLocaleString()}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
          </div>
        );
    }
  };

  const renderNetWorthMetrics = () => {
    if (selectedChartType !== 'net-worth') return null;

    const sortedEntries = netWorthLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let monthlyChange = 0;
    let monthsDiff = 0;
    let isPositive = false;
    let percentageChange = 0;

    if (sortedEntries.length >= 2) {
      const firstEntry = sortedEntries[0];
      const lastEntry = sortedEntries[sortedEntries.length - 1];
      
      const firstDate = new Date(firstEntry.date);
      const lastDate = new Date(lastEntry.date);
      monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                  (lastDate.getMonth() - firstDate.getMonth());
      
      const firstNetWorth = calculateTotalNetWorth(firstEntry);
      const lastNetWorth = calculateTotalNetWorth(lastEntry);
      const totalChange = lastNetWorth - firstNetWorth;
      monthlyChange = monthsDiff > 0 ? totalChange / monthsDiff : totalChange;
      percentageChange = (totalChange / firstNetWorth) * 100;
      isPositive = monthlyChange >= 0;
    }

    return (
      <>
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <IconWallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${sortedEntries.length > 0 ? calculateTotalNetWorth(sortedEntries[sortedEntries.length - 1]).toLocaleString() : '0'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Change</CardTitle>
            <IconArrowUpRight className={`h-4 w-4 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {monthlyChange !== 0 ? (
                <>
                  {isPositive ? '+' : '-'}${Math.abs(monthlyChange).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </>
              ) : (
                '$0.00'
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth Growth</CardTitle>
            <IconArrowUpRight className={`h-4 w-4 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {percentageChange !== 0 ? (
                <>
                  {isPositive ? '+' : '-'}{Math.abs(percentageChange).toFixed(2)}%
                </>
              ) : (
                '0.00%'
              )}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="container py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Financial overview
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex h-8 items-center rounded-md border bg-white dark:bg-neutral-800">
              <Button
                variant={selectedChartType === 'income' ? 'default' : 'ghost'}
                onClick={() => setSelectedChartType('income')}
                className="h-8 rounded-none first:rounded-l-md px-6"
                size="sm"
              >
                Income
              </Button>
              <Button
                variant={selectedChartType === 'expenses' ? 'default' : 'ghost'}
                onClick={() => setSelectedChartType('expenses')}
                className="h-8 rounded-none border-l px-6"
                size="sm"
              >
                Expenses
              </Button>
              <Button
                variant={selectedChartType === 'income-vs-expenses' ? 'default' : 'ghost'}
                onClick={() => setSelectedChartType('income-vs-expenses')}
                className="h-8 rounded-none border-l px-6"
                size="sm"
              >
                Income vs Expenses
              </Button>
              <Button
                variant={selectedChartType === 'net-worth' ? 'default' : 'ghost'}
                onClick={() => setSelectedChartType('net-worth')}
                className="h-8 rounded-none border-l last:rounded-r-md px-6"
                size="sm"
              >
                Net Worth
              </Button>
            </div>
            <MonthRangePicker
              onChange={setDateRange}
              defaultValue={dateRange}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="grid gap-4 md:grid-cols-4">
          {selectedChartType === 'income' ? (
            <>
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Monthly Income</CardTitle>
                  <IconWallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-500">
                    ${averageMonthlyIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <IconArrowUpRight className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-500">
                    ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Income Growth</CardTitle>
                  <IconArrowUpRight className={`h-4 w-4 ${incomeTrend >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${incomeTrend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {incomeTrend >= 0 ? '+' : '-'}${Math.abs(incomeTrend).toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </>
          ) : selectedChartType === 'expenses' ? (
            <>
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Monthly Expenses</CardTitle>
                  <IconWallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    ${averageMonthlyExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <IconArrowDownRight className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expense Growth</CardTitle>
                  <IconArrowDownRight className={`h-4 w-4 ${expenseTrend >= 0 ? 'text-red-500' : 'text-emerald-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${expenseTrend >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {expenseTrend >= 0 ? '+' : '-'}${Math.abs(expenseTrend).toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </>
          ) : selectedChartType === 'income-vs-expenses' ? (
            <>
              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Monthly Net</CardTitle>
                  <IconWallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${averageMonthlyNet >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {averageMonthlyNet >= 0 ? '+' : '-'}${Math.abs(averageMonthlyNet).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Net</CardTitle>
                  <IconArrowUpRight className={`h-4 w-4 ${netAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {netAmount >= 0 ? '+' : '-'}${Math.abs(netAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Growth</CardTitle>
                  <IconArrowUpRight className={`h-4 w-4 ${netTrend >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${netTrend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {netTrend >= 0 ? '+' : '-'}${Math.abs(netTrend).toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {renderNetWorthMetrics()}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {selectedChartType === 'income' && "Income Overview"}
                  {selectedChartType === 'expenses' && "Expenses Overview"}
                  {selectedChartType === 'income-vs-expenses' && "Income vs Expenses Overview"}
                  {selectedChartType === 'net-worth' && "Net Worth Overview"}
                </CardTitle>
                {selectedChartType === 'expenses' && (
                  <div className="inline-flex h-10 items-center rounded-md border bg-white dark:bg-neutral-800">
                    {Array.from(
                      new Set([
                        ...transactions
                          .filter(t => t.transaction_type === 'expense')
                          .map(t => t.category),
                        ...customCategories
                          .filter(cat => cat.type === 'expense')
                          .map(cat => cat.name)
                      ])
                    ).sort().map((category, index, array) => (
                      <Button
                        key={category}
                        variant={selectedCategories.includes(category) ? "default" : "ghost"}
                        onClick={() => {
                          if (selectedCategories.includes(category)) {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          } else {
                            setSelectedCategories([...selectedCategories, category]);
                          }
                        }}
                        className={`h-9 rounded-none capitalize px-3 ${
                          index === 0 ? 'first:rounded-l-md' : 'border-l'
                        } ${
                          index === array.length - 1 ? 'last:rounded-r-md' : ''
                        }`}
                        size="sm"
                        style={{
                          '--selected-color': categoryColors[category],
                          '--hover-color': `${categoryColors[category]}33`,
                          backgroundColor: selectedCategories.includes(category) ? categoryColors[category] : undefined,
                          color: selectedCategories.includes(category) ? 'white' : undefined,
                          borderColor: selectedCategories.includes(category) ? categoryColors[category] : undefined,
                        } as React.CSSProperties}
                      >
                        {category}
                      </Button>
                    ))}
                    {selectedCategories.length > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedCategories([])}
                        className="h-9 rounded-none border-l last:rounded-r-md px-3"
                        size="sm"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}
                {selectedChartType === 'income' && (
                  <div className="inline-flex h-10 items-center rounded-md border bg-white dark:bg-neutral-800">
                    {Array.from(
                      new Set([
                        ...transactions
                          .filter(t => t.transaction_type === 'income')
                          .map(t => t.category),
                        ...customCategories
                          .filter(cat => cat.type === 'income')
                          .map(cat => cat.name)
                      ])
                    ).sort().map((category, index, array) => (
                      <Button
                        key={category}
                        variant={selectedIncomeCategories.includes(category) ? "default" : "ghost"}
                        onClick={() => {
                          if (selectedIncomeCategories.includes(category)) {
                            setSelectedIncomeCategories(selectedIncomeCategories.filter(c => c !== category));
                          } else {
                            setSelectedIncomeCategories([...selectedIncomeCategories, category]);
                          }
                        }}
                        className={`h-9 rounded-none capitalize px-3 ${
                          index === 0 ? 'first:rounded-l-md' : 'border-l'
                        } ${
                          index === array.length - 1 ? 'last:rounded-r-md' : ''
                        }`}
                        size="sm"
                        style={{
                          '--selected-color': incomeCategoryColors[category],
                          '--hover-color': `${incomeCategoryColors[category]}33`,
                          backgroundColor: selectedIncomeCategories.includes(category) ? incomeCategoryColors[category] : undefined,
                          color: selectedIncomeCategories.includes(category) ? 'white' : undefined,
                          borderColor: selectedIncomeCategories.includes(category) ? incomeCategoryColors[category] : undefined,
                        } as React.CSSProperties}
                      >
                        {category}
                      </Button>
                    ))}
                    {selectedIncomeCategories.length > 0 && (
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedIncomeCategories([])}
                        className="h-9 rounded-none border-l last:rounded-r-md px-3"
                        size="sm"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {renderChart()}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                {renderDetailedData()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 