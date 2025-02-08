"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar open={open} setOpen={setOpen} children={undefined}>
        {/* Sidebar content is handled internally */}
      </Sidebar>
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8 bg-neutral-50 dark:bg-neutral-900/50 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
} 