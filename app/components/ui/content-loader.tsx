import React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "./utils";

type ContentLoaderProps = {
  variant?: "card" | "list";
  count?: number;
  columns?: number;
  aspect?: "video" | "square" | "auto";
  className?: string;
};

export function ContentLoader({
  variant = "card",
  count = 3,
  columns = 3,
  aspect = "video",
  className,
}: ContentLoaderProps) {
  const items = Array.from({ length: count });
  const gridCols =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "square"
      ? "aspect-square"
      : "h-40";
  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-6", gridCols, className)}>
      {items.map((_, i) => (
        <div key={i} className="rounded-xl border overflow-hidden">
          <div className={cn("bg-gray-100", aspectClass)}>
            <Skeleton className="w-full h-full" />
          </div>
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

