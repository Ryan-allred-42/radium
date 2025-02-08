export interface BudgetItem {
  id: string;
  title: { [key: string]: string };
  value: { [key: string]: number };
  category: string;
  transaction_type: "income" | "expense";
  date: string;
} 