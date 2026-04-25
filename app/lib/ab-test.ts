'use client';

/**
 * A/B Testing Utility - "The Human Touch"
 * 
 * I built this hook to handle variant splitting without needing a heavy third-party library.
 * The idea is simple: we want to show different versions of a feature to users and see 
 * what sticks, but we need to make sure a user sees the same version every time they return.
 * 
 * How it works:
 * 1. We look for a 'sticky' assignment in the browser's storage.
 * 2. If it's a new visitor, we flip a coin (Math.random) and save the result.
 * 3. We use the key to keep different tests (like 'hero' vs 'pricing') separate.
 */

import { useState, useEffect } from 'react';

// Using 'A' and 'B' because it's the industry standard, though I personally
// prefer 'Control' and 'Challenger' for clarity.
type ExperimentVariant = 'A' | 'B';

export function useABTest(experimentId: string): ExperimentVariant {
  // Defaulting to 'A' (our baseline) while we figure out who the user is.
  const [assignedVariant, setAssignedVariant] = useState<ExperimentVariant>('A');

  useEffect(() => {
    // We wrap this in useEffect because localStorage isn't available during 
    // server-side rendering. Classic Next.js hurdle.
    const storageKey = `darbar_experiment_${experimentId}`;
    const previousAssignment = localStorage.getItem(storageKey);
    
    // Check if we've already decided what to show this person.
    if (previousAssignment === 'A' || previousAssignment === 'B') {
      setAssignedVariant(previousAssignment as ExperimentVariant);
    } else {
      // New user! Let's pick a path for them. 
      // 50/50 split feels right for most of our initial UI tweaks.
      const rollTheDice = Math.random() < 0.5 ? 'A' : 'B';
      
      try {
        localStorage.setItem(storageKey, rollTheDice);
        setAssignedVariant(rollTheDice);
      } catch (e) {
        // If storage is full or private mode is being tricky, 
        // we just fall back to 'A' gracefully.
        console.warn("Couldn't save A/B test variant. Falling back to baseline.", e);
        setAssignedVariant('A');
      }
    }
  }, [experimentId]);

  return assignedVariant;
}
