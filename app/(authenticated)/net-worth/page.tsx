"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface NetWorthEntry {
  id: string;
  title: { [key: string]: string };
  value: { [key: string]: number };
  date: string;
  created_at: string;
}

interface EntryItem {
  title: string;
  value: number;
}

export default function NetWorthPage() {
  const [netWorthHistory, setNetWorthHistory] = useState<NetWorthEntry[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<NetWorthEntry | null>(null);
  const [entryDate, setEntryDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [entryItems, setEntryItems] = useState<EntryItem[]>([{ title: "", value: 0 }]);
  const [dateError, setDateError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  // Fetch net worth history
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("net_worth_log")
        .select("*")
        .eq("userid", user.id)
        .is("deleted_at", null)
        .order("date", { ascending: true });

      setNetWorthHistory(data || []);
    };

    fetchData();
  }, []);

  const calculateTotalNetWorth = (entry: NetWorthEntry) => {
    return Object.values(entry.value).reduce((sum, value) => sum + value, 0);
  };

  const getCurrentNetWorth = () => {
    if (netWorthHistory.length === 0) return 0;
    const mostRecent = [...netWorthHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    return calculateTotalNetWorth(mostRecent);
  };

  const getMostRecentEntry = () => {
    if (netWorthHistory.length === 0) return null;
    return [...netWorthHistory].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  };

  const prefillItemsFromMostRecent = () => {
    const mostRecent = getMostRecentEntry();
    if (mostRecent) {
      const items: EntryItem[] = Object.entries(mostRecent.title).map(([key, title]) => ({
        title,
        value: 0,
      }));
      setEntryItems(items);
    } else {
      setEntryItems([{ title: "", value: 0 }]);
    }
  };

  const handleAddItem = () => {
    setEntryItems([...entryItems, { title: "", value: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setEntryItems(entryItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof EntryItem, value: string | number) => {
    const newItems = [...entryItems];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'value' ? parseFloat(value as string) || 0 : value,
    };
    setEntryItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date uniqueness
    const dateExists = netWorthHistory.some(entry => entry.date === entryDate);
    if (dateExists && !editingEntry) {
      setDateError("An entry for this date already exists");
      return;
    }
    setDateError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const title: { [key: string]: string } = {};
    const value: { [key: string]: number } = {};
    
    entryItems.forEach(item => {
      if (item.title.trim()) {
        title[item.title] = item.title;
        value[item.title] = item.value;
      }
    });

    if (editingEntry) {
      const { error } = await supabase
        .from("net_worth_log")
        .update({ title, value, date: entryDate })
        .eq("id", editingEntry.id);

      if (!error) {
        setNetWorthHistory(netWorthHistory.map(entry =>
          entry.id === editingEntry.id
            ? { ...entry, title, value, date: entryDate }
            : entry
        ));
      }
    } else {
      const { data: newEntry, error } = await supabase
        .from("net_worth_log")
        .insert([{
          userid: user.id,
          title,
          value,
          date: entryDate,
        }])
        .select()
        .single();

      if (!error && newEntry) {
        setNetWorthHistory([...netWorthHistory, newEntry]);
      }
    }

    setIsAddingEntry(false);
    setEditingEntry(null);
    setEntryItems([{ title: "", value: 0 }]);
    setEntryDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleEdit = (entry: NetWorthEntry) => {
    setEditingEntry(entry);
    setEntryDate(entry.date);
    const items: EntryItem[] = Object.entries(entry.title).map(([key, title]) => ({
      title,
      value: entry.value[key],
    }));
    setEntryItems(items);
    setIsAddingEntry(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("net_worth_log")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setNetWorthHistory(netWorthHistory.filter((entry) => entry.id !== id));
    }
  };

  const prepareChartData = () => {
    return netWorthHistory
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: format(parseISO(entry.date), "MMM d, yyyy"),
        value: calculateTotalNetWorth(entry),
      }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Net Worth Tracker</h1>
        <Button onClick={() => {
          setIsAddingEntry(true);
          setEditingEntry(null);
          prefillItemsFromMostRecent();
          setEntryDate(format(new Date(), "yyyy-MM-dd"));
        }}>
          Add Entry
        </Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Current Net Worth Card */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getCurrentNetWorth().toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">
              As of {netWorthHistory.length > 0 
                ? format(parseISO(netWorthHistory[netWorthHistory.length - 1].date), "MMMM d, yyyy")
                : "No entries yet"}
            </p>
          </CardContent>
        </Card>

        {/* Net Worth Growth Card */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Worth Growth</CardTitle>
          </CardHeader>
          <CardContent>
            {netWorthHistory.length >= 2 ? (
              (() => {
                const sortedEntries = [...netWorthHistory].sort(
                  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                const firstEntry = sortedEntries[0];
                const lastEntry = sortedEntries[sortedEntries.length - 1];
                
                const firstNetWorth = calculateTotalNetWorth(firstEntry);
                const lastNetWorth = calculateTotalNetWorth(lastEntry);
                const totalChange = lastNetWorth - firstNetWorth;
                const percentageChange = (totalChange / firstNetWorth) * 100;
                const isPositive = percentageChange >= 0;
                
                return (
                  <>
                    <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Since {format(parseISO(firstEntry.date), "MMMM d, yyyy")}
                    </p>
                  </>
                );
              })()
            ) : (
              <p className="text-sm text-muted-foreground">
                Need at least two entries to calculate growth
              </p>
            )}
          </CardContent>
        </Card>

        {/* Average Monthly Change Card */}
        <Card className="bg-white dark:bg-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Change</CardTitle>
          </CardHeader>
          <CardContent>
            {netWorthHistory.length >= 2 ? (
              (() => {
                const sortedEntries = [...netWorthHistory].sort(
                  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                const firstEntry = sortedEntries[0];
                const lastEntry = sortedEntries[sortedEntries.length - 1];
                
                const firstDate = new Date(firstEntry.date);
                const lastDate = new Date(lastEntry.date);
                const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 + 
                                 (lastDate.getMonth() - firstDate.getMonth());
                
                const firstNetWorth = calculateTotalNetWorth(firstEntry);
                const lastNetWorth = calculateTotalNetWorth(lastEntry);
                const totalChange = lastNetWorth - firstNetWorth;
                const monthlyChange = monthsDiff > 0 ? totalChange / monthsDiff : totalChange;

                const isPositive = monthlyChange >= 0;
                
                return (
                  <>
                    <div className={`text-2xl font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{monthlyChange.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {monthsDiff} month{monthsDiff === 1 ? '' : 's'} of data
                    </p>
                  </>
                );
              })()
            ) : (
              <p className="text-sm text-muted-foreground">
                Need at least two entries to calculate average change
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Chart */}
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle>Net Worth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prepareChartData()} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
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
        </CardContent>
      </Card>

      {/* History List */}
      <Card className="bg-white dark:bg-neutral-800">
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-right py-3 px-4">Total</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {netWorthHistory
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="py-4 px-4">
                        {format(parseISO(entry.date), "MMMM d, yyyy")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {Object.entries(entry.title).map(([key, title], index) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{title}</span>
                              <span className="ml-4">${entry.value[key].toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${calculateTotalNetWorth(entry).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(entry)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddingEntry}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingEntry(false);
            setEditingEntry(null);
            setEntryItems([{ title: "", value: 0 }]);
            setEntryDate(format(new Date(), "yyyy-MM-dd"));
            setDateError(null);
          }
        }}
      >
        <DialogContent className="bg-white dark:bg-neutral-800 max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit Entry" : "Add New Entry"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-hidden flex flex-col">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={entryDate}
                onChange={(e) => {
                  setEntryDate(e.target.value);
                  setDateError(null);
                }}
                required
                className="bg-white dark:bg-neutral-800"
              />
              {dateError && (
                <p className="text-sm text-red-500">{dateError}</p>
              )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-x-4 mb-2 px-4">
                <Label>Title</Label>
                <div />
                <Label>Value</Label>
                <div />
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="space-y-2">
                  {entryItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-[1fr,auto,1fr,auto] gap-4 items-center">
                      <Input
                        value={item.title}
                        onChange={(e) => handleItemChange(index, "title", e.target.value)}
                        placeholder="e.g., Savings, Investments"
                        required
                        className="bg-white dark:bg-neutral-800"
                      />
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.value}
                        onChange={(e) => handleItemChange(index, "value", e.target.value)}
                        required
                        className="bg-white dark:bg-neutral-800"
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      )}
                      {index === 0 && <div className="w-8" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddItem}
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Add Item
              </Button>

              <div className="flex justify-between items-center">
                <span className="font-medium">Total Net Worth:</span>
                <span className="text-lg font-bold">
                  ${entryItems.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingEntry(false);
                    setEditingEntry(null);
                    setEntryItems([{ title: "", value: 0 }]);
                    setEntryDate(format(new Date(), "yyyy-MM-dd"));
                    setDateError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEntry ? "Save Changes" : "Add Entry"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 