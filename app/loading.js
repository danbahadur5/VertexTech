import React from "react";
import { Skeleton } from "./components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-background/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32 md:h-10 md:w-40 rounded-lg" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </header>

      <main className="pt-20 md:pt-24">
        {/* Hero Section Skeleton */}
        <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-10 md:h-14 lg:h-16 w-[90%] rounded-xl" />
                <Skeleton className="h-10 md:h-14 lg:h-16 w-[70%] rounded-xl" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-[85%] rounded-full" />
                <Skeleton className="h-4 w-[60%] rounded-full" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-12 w-36 rounded-lg" />
                <Skeleton className="h-12 w-36 rounded-lg" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
                  <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
                  <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
                  <Skeleton className="h-10 w-10 rounded-full border-2 border-background" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-3 w-32 rounded-full" />
                </div>
              </div>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px]">
              <Skeleton className="w-full h-full rounded-2xl md:rounded-3xl shadow-2xl" />
            </div>
          </div>
        </section>

        {/* Trusted By Section Skeleton */}
        <section className="bg-muted/30 py-12 border-y">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 grayscale opacity-50">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
              <Skeleton className="h-8 w-28 rounded" />
              <Skeleton className="h-8 w-36 rounded" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        </section>

        {/* Services Grid Skeleton */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-4 w-32 mx-auto rounded-full" />
            <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
            <Skeleton className="h-4 w-96 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </section>
      </main>
    </div>
  );
}
