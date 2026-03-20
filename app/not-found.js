'use client'

import React from 'react';
import { Link } from 'react-router';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { PublicHeader } from './components/layout/PublicHeader';

export default function NotFoundPage() {
  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="blob blob-primary w-96 h-96 top-[-120px] left-[-100px]" />
        <div className="blob blob-secondary w-72 h-72 bottom-[-80px] right-[-60px]" />
        <div className="mx-auto max-w-4xl px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="mb-6">
            <Badge className="theme-badge">Error 404</Badge>
          </div>
          <div className="text-7xl sm:text-8xl font-extrabold leading-none mb-4 theme-gradient-text">
            404
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed">
            The page you’re looking for doesn’t exist or may have been moved. Try returning to the homepage or explore one of our key sections.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/">
              <Button size="lg" className="theme-btn rounded-xl px-8 h-12 font-bold">
                Go Home
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="theme-btn-outline rounded-xl px-8 h-12 font-bold">
                View Services
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="ghost" className="rounded-xl px-8 h-12 font-bold theme-text">
                Contact Support
              </Button>
            </Link>
          </div>
          <div className="mt-10 opacity-90">
            <svg width="260" height="12" viewBox="0 0 260 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <ellipse cx="130" cy="6" rx="130" ry="6" fill="url(#g)" />
              <defs>
                <linearGradient id="g" x1="0" y1="6" x2="260" y2="6" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--theme-gradient-from)" />
                  <stop offset="1" stopColor="var(--theme-gradient-to)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
