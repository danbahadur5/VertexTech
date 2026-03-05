'use client'
import React from "react";
import { ThemeProvider } from "next-themes";
import { ColorThemeProvider } from "./lib/theme-context";
import { AuthProvider } from "./lib/auth-context";
import { Toaster } from "./components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ColorThemeProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  );
}
