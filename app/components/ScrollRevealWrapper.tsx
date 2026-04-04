"use client";

import React, { useEffect } from "react";
import { useScrollReveal } from "../lib/use-scroll-reveal";

export function ScrollRevealWrapper({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  
  return <>{children}</>;
}
