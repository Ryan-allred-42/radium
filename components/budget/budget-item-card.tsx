import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { BudgetItem } from "@/app/budget/page";

interface BudgetItemCardProps {
  item: BudgetItem;
  onEdit: (item: BudgetItem) => void;
  onDelete: () => void;
}

export function BudgetItemCard({ item, onEdit, onDelete }: BudgetItemCardProps) {
  // Get the first title and value since they're stored as key-value pairs
  const title = Object.values(item.title)[0];
  const value = Object.values(item.value)[0];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize">{item.category}</span>
            <span>•</span>
            <span className="capitalize">{item.transaction_type}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-lg font-semibold ${item.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {item.transaction_type === 'income' ? '+' : '-'}${value.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
            >
              <IconEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 