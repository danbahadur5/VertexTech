'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import logoLight from '../layout/assets/light_logo.png';
import logoDark from '../layout/assets/dark_logo.png';
import { useTheme } from 'next-themes';
import { useColorTheme } from '../../lib/theme-context';

export const LoadingScreen = () => {
  const { loading: themeLoading } = useColorTheme();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {themeLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#030712]"
        >
          <div className="relative flex flex-col items-center gap-12">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                filter: 'blur(0px)',
                transition: { duration: 1.2, ease: "easeOut" }
              }}
              className="relative w-48 h-16 md:w-64 md:h-20"
            >
              <Image
                src={theme === 'dark' ? logoLight : logoDark}
                alt="DarbarTech Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Content Container */}
            <div className="flex flex-col items-center gap-6">
              {/* Animated Text */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.6, duration: 0.8 }
                }}
                className="text-center"
              >
                <div className="flex items-center gap-[0.2em] md:gap-[0.3em] overflow-hidden">
                  {"INNOVATING FUTURES".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ y: 40 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.8 + index * 0.03, duration: 0.5 }}
                      className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Sophisticated Progress Bar */}
              <div className="relative w-48 md:w-64 h-[2px] bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ 
                    x: "100%",
                    transition: { duration: 2.2, repeat: Infinity, ease: "linear" }
                  }}
                  className="absolute inset-0 bg-blue-600 dark:bg-blue-500 opacity-50"
                />
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: "100%",
                    transition: { duration: 2.5, ease: "easeInOut" }
                  }}
                  className="h-full bg-blue-600 dark:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Ambient Background Effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
