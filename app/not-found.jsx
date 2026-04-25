'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Mail, LayoutGrid, Sparkles } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { PublicHeader } from './components/layout/PublicHeader';

const FloatingIcon = ({ icon: Icon, delay, x, y, size = 24 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.2, 0.5, 0.2], 
      scale: [1, 1.2, 1],
      x: [x, x + 20, x],
      y: [y, y - 20, y]
    }}
    transition={{ 
      duration: 5, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className="absolute hidden md:block text-blue-500/30 dark:text-blue-400/20"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Icon size={size} />
  </motion.div>
);

/**
 * @component NotFoundPage
 * @description A modern, branded 404 error page with animations and responsive design.
 * 
 * @theming
 * - Uses Tailwind CSS for styling.
 * - Primary colors are driven by 'theme-text' and 'theme-bg' utility classes.
 * - Supports dark mode via 'dark:' prefix.
 * 
 * @animations
 * - Framer Motion is used for staggered entry of elements.
 * - Floating background icons use infinite loop animations.
 * 
 * @accessibility
 * - Semantic HTML tags (<main>, <h1>, <h2>, <p>, <nav>).
 * - Keyboard navigable links and buttons.
 * - WCAG compliant color contrast for text.
 */
export default function NotFoundPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <PublicHeader />
      
      <main className="flex-grow relative flex items-center justify-center overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          <FloatingIcon icon={Sparkles} delay={0} x={15} y={20} size={32} />
          <FloatingIcon icon={Search} delay={1} x={80} y={15} size={28} />
          <FloatingIcon icon={LayoutGrid} delay={2} x={10} y={70} size={40} />
          <FloatingIcon icon={Mail} delay={1.5} x={85} y={75} size={24} />
        </div>

        <motion.div 
          className="relative z-10 max-w-4xl w-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Badge className="px-4 py-1.5 rounded-full theme-bg text-white border-none text-sm font-bold tracking-wider shadow-lg shadow-blue-500/20">
              404 ERROR
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants} className="relative mb-8">
            <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter theme-text opacity-10 dark:opacity-20 absolute inset-0 flex items-center justify-center select-none pointer-events-none">
              404
            </h1>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight relative z-10">
              Oops! Page <span className="theme-text">Vanished.</span>
            </h2>
          </motion.div>

          <motion.p 
            variants={itemVariants} 
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            We couldn’t find the page you’re looking for. It might have been moved, 
            deleted, or perhaps it never existed in this dimension.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <Link href="/">
              <Button size="lg" className="theme-btn rounded-2xl px-8 h-14 font-bold shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <Home size={20} /> Back to Home
              </Button>
            </Link>
            
            <Link href="/services">
              <Button size="lg" variant="outline" className="rounded-2xl px-8 h-14 font-bold border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all flex items-center gap-2">
                <LayoutGrid size={20} /> Our Services
              </Button>
            </Link>

            <button 
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Go Back
            </button>
          </motion.div>

          {/* Branded Element */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-900 flex flex-col items-center"
          >
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-600 mb-4 uppercase tracking-[0.2em]">
              Darbar Technology
            </p>
            <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
              <Link href="/about" className="text-xs font-bold hover:theme-text">About</Link>
              <Link href="/blog" className="text-xs font-bold hover:theme-text">Blog</Link>
              <Link href="/contact" className="text-xs font-bold hover:theme-text">Support</Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
