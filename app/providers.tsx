'use client'
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { ColorThemeProvider } from "./lib/theme-context";
import { AuthProvider } from "./lib/auth-context";
import { Toaster } from "./components/ui/sonner";
import { LoadingScreen } from "./components/ui/LoadingScreen";

// Workaround for React 19 / Next.js 16 script tag warning in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalError(...args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ColorThemeProvider>
        <AuthProvider>
          <LoadingScreen />
          {children}
          <Toaster />
        </AuthProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  );
}
