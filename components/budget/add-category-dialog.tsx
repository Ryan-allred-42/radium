import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'income' | 'expense';
  onSuccess: () => void;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  type,
  onSuccess,
}: AddCategoryDialogProps) {
  const [name, setName] = useState("");
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("custom_categories")
      .insert([
        {
          userid: user.id,
          name: name,
          type: type,
        },
      ]);

    if (!error) {
      onSuccess();
      onOpenChange(false);
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-neutral-800">
        <DialogHeader>
          <DialogTitle>
            Add {type === "income" ? "Income" : "Expense"} Category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
              className="bg-white dark:bg-neutral-800"
            />
          </div>
          <Button type="submit">Add Category</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 