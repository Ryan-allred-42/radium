"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "glow";
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  const { resolvedTheme } = useTheme();

  return (
    <section className={cn("bg-background text-foreground", "py-12 sm:py-24 md:py-32 px-4")}>
      <div className="mx-auto flex max-w-7xl flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge && (
            <Badge variant="secondary" className="px-4 py-1">
              {badge.text}{" "}
              <a href={badge.action.href} className="font-medium text-primary hover:underline">
                {badge.action.text}
              </a>
            </Badge>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>

          {/* Description */}
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            {actions.map((action) => (
              <Button
                key={action.text}
                variant={action.variant as "default" | "link" | "destructive" | "outline" | "secondary" | "ghost"}
                asChild
                className="h-12 px-8"
              >
                <a href={action.href}>
                  {action.text}
                  {action.icon && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 