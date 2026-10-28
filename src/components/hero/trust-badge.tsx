"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function TrustBadge({ trust }: { trust: string }) {
  return (
    <div
      className={cn(
        "fixed z-[6] bottom-6 left-6 md:bottom-8 md:left-10",
        "flex flex-col items-start gap-3"
      )}
      aria-hidden="false"
    >
      <Separator className="w-[24px] border-border" />
      <p className="text-sm text-muted-foreground max-w-[200px]">
        {trust}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-3">
          {["A", "B", "C", "D", "E"].map((initial, idx) => (
            <Avatar
              key={idx}
             className="h-8 w-8 border-2 border-[var(--color-background)]"
              style={{ zIndex: 5 - idx }}
            >
              <AvatarFallback
                className="text-xs font-medium"
                style={{
                  backgroundColor:
                    idx % 3 === 0
                    ? "var(--color-sky)"
                    : idx % 3 === 1
                    ? "var(--color-lime)"
                    : "var(--color-rose)",
                }}
              >
                {initial}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-[var(--color-glass)] text-foreground backdrop-blur"
        >
          <Plus className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}