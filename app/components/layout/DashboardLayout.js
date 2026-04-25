import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Briefcase, 
  MessageSquare, 
  Image as ImageIcon,
  Palette,
  Layers,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  X,
  Home,
  UserCircle,
  CreditCard,
  HelpCircle,
  Newspaper,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Moon,
  LogOut as LogOutIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../lib/auth-context';
import { Badge } from '../ui/badge';
import { useTheme } from 'next-themes';

import logoDark from "./assets/dark_logo.png";
import logoLight from "./assets/light_logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Image from 'next/image';

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [autoHideEnabled, setAutoHideEnabled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Authorization is now handled by ProtectedRoute wrapper in page.js files
  // We only keep the basic authentication check here as a fallback
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const p = pathname || "";
    const shouldEnable = /^\/dashboard\/(admin|editor)\/services(\/.*)?$/.test(p);
    setAutoHideEnabled(shouldEnable);
    setLastScrollY(0);
  }, [pathname]);

  useEffect(() => {
    const items = getNavigationItems();
    const appearanceChildren = items.find((i) => i.name === 'Appearance')?.children || [];
    const aboutChildren = items.find((i) => i.name === 'About')?.children || [];
    const contactChildren = items.find((i) => i.name === 'Contact')?.children || [];
    const appearanceActive = appearanceChildren.some((c) => isActive(c.href));
    const aboutActive = aboutChildren.some((c) => isActive(c.href));
    const contactActive = contactChildren.some((c) => isActive(c.href));
    setAppearanceOpen(appearanceActive);
    setAboutOpen(aboutActive);
    setContactOpen(contactActive);
  }, [pathname, user?.role]);

  useEffect(() => {
    if (!autoHideEnabled) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastScrollY;
      if (delta > 30 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        if (sidebarOpen) setSidebarOpen(false);
      } else if (delta < -30 && sidebarCollapsed) {
        setSidebarCollapsed(false);
      }
      setLastScrollY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [autoHideEnabled, lastScrollY, sidebarCollapsed, sidebarOpen]);

  const confirmLogout = () => {
    logout();
    router.push('/login');
  };

  const isOverview = (p) => /^\/dashboard\/(admin|editor|client)$/.test(p);
  const isActive = (path) => {
    if (isOverview(path)) {
      return pathname === path;
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const role = user?.role;
    
    if (role === 'admin') {
      return [
        { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Pages', href: '/dashboard/admin/pages', icon: FileText },
        { name: 'Services', href: '/dashboard/admin/services', icon: Briefcase },
        { name: 'Blog', href: '/dashboard/admin/blog', icon: Newspaper },
        { name: 'Case Study', href: '/dashboard/admin/caseStudy', icon: FolderOpen },
        { name: 'SEO', href: '/dashboard/admin/seo', icon: FileText },
        {
          name: 'Appearance',
          icon: Palette,
          children: [
            { name: 'Theme Settings', href: '/dashboard/admin/theme' },
            { name: 'Header', href: '/dashboard/admin/appearance/header' },
            { name: 'Hero Section', href: '/dashboard/admin/appearance/hero' },
            { name: 'Hero Trusted Count', href: '/dashboard/admin/appearance/hero-trusted-count' },
            { name: 'Trusted Company', href: '/dashboard/admin/appearance/trusted-company' },
            { name: 'Trusted Security Leader', href: '/dashboard/admin/appearance/trusted-security-leader' },
            { name: 'FAQ', href: '/dashboard/admin/appearance/faq' },
            { name: 'Security Exports', href: '/dashboard/admin/appearance/security-exports' },
            { name: 'Footer', href: '/dashboard/admin/appearance/footer' },
            { name: 'Pricing', href: '/dashboard/admin/appearance/pricing' },
          ],
        },
        {
          name: 'About',
          icon: Layers,
          children: [
            { name: 'How We Think', href: '/dashboard/admin/about/how-we-think' },
            { name: 'Milestones That Matter', href: '/dashboard/admin/about/milestones' },
            { name: 'Defending the Digital Frontier', href: '/dashboard/admin/about/hero' },
            { name: 'Our Team', href: '/dashboard/admin/about/team' },
          ],
        },
        {
          name: 'Contact',
          icon: HelpCircle,
          children: [
            { name: 'Contact Content', href: '/dashboard/admin/contact' },
            { name: 'Enquiries', href: '/dashboard/admin/contact/enquiries' },
          ],
        },
        { name: 'Media Library', href: '/dashboard/admin/media', icon: ImageIcon },
        { name: 'Users', href: '/dashboard/admin/users', icon: Users },
        { name: 'Support', href: '/dashboard/admin/support', icon: MessageSquare },
        { name: 'Profile', href: '/dashboard/admin/profile', icon: UserCircle },
        { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
      ];
    } else if (role === 'editor') {
      return [
        { name: 'Overview', href: '/dashboard/editor', icon: LayoutDashboard },
        { name: 'Pages', href: '/dashboard/editor/pages', icon: FileText },
        { name: 'Blog', href: '/dashboard/editor/blog', icon: Newspaper },
        { name: 'Case Study', href: '/dashboard/editor/caseStudy', icon: FolderOpen },
        { name: 'SEO', href: '/dashboard/editor/seo', icon: FileText },
        { name: 'Media Library', href: '/dashboard/editor/media', icon: ImageIcon },
        { name: 'Profile', href: '/dashboard/editor/profile', icon: UserCircle },
      ];
    } else {
      return [
        { name: 'Overview', href: '/dashboard/client', icon: LayoutDashboard },
        { name: 'My Projects', href: '/dashboard/client/projects', icon: FolderOpen },
        { name: 'Support', href: '/dashboard/client/support', icon: MessageSquare },
        { name: 'Profile', href: '/dashboard/client/profile', icon: UserCircle },
        { name: 'Billing', href: '/dashboard/client/billing', icon: CreditCard },
      ];
    }
  };

  const navigationItems = getNavigationItems();


  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const role = user?.role;
  const activeBg = role === 'admin' ? 'from-orange-900 to-red-500' : role === 'editor' ? 'from-blue-600 to-purple-600' : 'from-emerald-600 to-green-500';
  const sectionLabel = role === 'admin' ? 'Admin' : role === 'editor' ? 'Editor' : 'Client';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  const path = pathname;
  const isAuthorized = 
    (path.startsWith('/dashboard/admin') && user?.role === 'admin') ||
    (path.startsWith('/dashboard/editor') && ['admin', 'editor'].includes(user?.role)) ||
    (path.startsWith('/dashboard/client') && ['admin', 'client'].includes(user?.role));

  if (!isAuthorized && path !== '/dashboard') {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <div className={`flex grow flex-col gap-y-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-r border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 ${sidebarCollapsed ? 'px-3' : 'px-6'}`}>
          <div className={`flex h-16 shrink-0 items-center justify-between border-b sticky top-0 z-60 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${sidebarCollapsed ? '-mx-3 px-3' : '-mx-6 px-6'}`}>
            <Link href="/" className="flex items-center gap-2">
              {!sidebarCollapsed && mounted && (
               theme === "dark" ? 
               (
                <Image src={logoLight} alt="DarbarTech" className="h-10 w-auto object-contain" height={40} width={160} priority />
               ) : (
                <Image src={logoDark} alt="DarbarTech" className="h-10 w-auto object-contain" height={40} width={160} priority />
               )
              )}
            </Link>
            <button
              aria-label="Toggle sidebar"
              className="inline-flex items-center justify-center rounded-md border px-2.5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
          {!sidebarCollapsed && (
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">
              {sectionLabel}
            </div>
          )}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigationItems.map((item) => {
                if (item.children && item.children.length) {
                  const open = 
                    item.name === 'Appearance' ? appearanceOpen : 
                    item.name === 'About' ? aboutOpen : 
                    item.name === 'Contact' ? contactOpen : false;
                  const Icon = item.icon;
                  return (
                    <li key={item.name} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (sidebarCollapsed) {
                            setSidebarCollapsed(false);
                            if (item.name === 'Appearance') setAppearanceOpen(true);
                            if (item.name === 'About') setAboutOpen(true);
                            if (item.name === 'Contact') setContactOpen(true);
                          } else {
                            if (item.name === 'Appearance') setAppearanceOpen(!appearanceOpen);
                            if (item.name === 'About') setAboutOpen(!aboutOpen);
                            if (item.name === 'Contact') setContactOpen(!contactOpen);
                          }
                        }}
                        className={`w-full cursor-pointer flex items-center justify-between gap-x-3 rounded-xl p-2 text-sm font-semibold transition-colors ${'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}
                        title={item.name}
                      >
                        <div className="flex items-center gap-x-3">
                          <Icon className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
                          {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                        </div>
                        {!sidebarCollapsed && (open ? <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />)}
                      </button>
                      {open && !sidebarCollapsed && (
                        <ul className="ml-8 space-y-1">
                          {item.children.map((child) => {
                            const active = isActive(child.href);
                            return (
                              <li key={child.name} className ="cursor-pointer">
                                <Link
                                  href={child.href}
                                  className={`flex items-center rounded-lg p-2 text-sm ${active ? `bg-gradient-to-r ${activeBg} text-white` : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}
                                  title={child.name}
                                >
                                  <span className="truncate">{child.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                } else {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.name} className="cursor-pointer">
                      <Link
                        href={item.href}
                        title={item.name}
                        className={`relative group flex items-center gap-x-3 rounded-xl p-2 text-sm font-semibold transition-colors ${active ? `bg-gradient-to-r ${activeBg} text-white` : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-white/90" />
                        )}
                        <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className={`flex items-center gap-x-3 ${sidebarCollapsed ? 'px-1.5 py-3 justify-center' : 'px-2 py-3'}`}>
                <Avatar>
                  <AvatarImage />
                  <AvatarFallback />
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name}</div>
                    <Badge className={`text-xs mt-1 ${getRoleBadgeColor(user?.role || 'client')}`}>{user?.role}</Badge>
                  </div>
                )}
              </div>
              <div className={`${sidebarCollapsed ? 'px-1.5 pb-3' : 'px-2 pb-3'}`}>
                <Button
                  variant="ghost"
                  className={`w-full cursor-pointer ${sidebarCollapsed ? 'justify-center' : 'justify-start'} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20`}
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <LogOutIcon className="h-4 w-4 mr-2 cursor-pointer" />
                  {!sidebarCollapsed && 'Logout'}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              You will be redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLogout}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Yes, Logout   
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white dark:bg-gray-900 px-6 pb-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-700/50">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
               {mounted && (
                 theme === "dark" ? 
                 (
                  <Image src={logoLight} alt="DarbarTech" className="h-10 w-auto object-contain" height={40} width={160} priority />
                 ) : (
                  <Image src={logoDark} alt="DarbarTech" className="h-10 w-auto object-contain" height={40} width={160} priority />
                 )
               )}
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <nav className="mt-6">
              <ul role="list" className="space-y-1">
                {navigationItems.map((item) => {
                  if (item.children && item.children.length) {
                    const open = 
                      item.name === 'Appearance' ? appearanceOpen : 
                      item.name === 'About' ? aboutOpen : 
                      item.name === 'Contact' ? contactOpen : false;
                    const Icon = item.icon;
                    return (
                      <li key={item.name} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.name === 'Appearance') setAppearanceOpen(!appearanceOpen);
                            if (item.name === 'About') setAboutOpen(!aboutOpen);
                            if (item.name === 'Contact') setContactOpen(!contactOpen);
                          }}
                          className="w-full flex items-center justify-between gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600"
                        >
                          <div className="flex items-center gap-x-3">
                            <Icon className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" />
                            {item.name}
                          </div>
                          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                        {open && (
                          <ul className="ml-8 space-y-1">
                            {item.children.map((child) => {
                              const active = isActive(child.href);
                              return (
                                <li key={child.name}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center rounded-md p-2 text-sm font-semibold ${active ? `bg-gradient-to-r ${activeBg} text-white` : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  } else {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${active ? `bg-gradient-to-r ${activeBg} text-white` : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}
                        >
                          <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600'}`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <div className={sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}>
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button
                variant="outline"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="bg-transparent dark:bg-gray-800 border-none cursor-pointer text-gray-900 dark:text-gray-100 h-9 w-9"
              >
                <Sun className="h-4 w-4 hidden dark:block" />
                <Moon className="h-4 w-4 dark:hidden" />
              </Button>
              {role === 'editor' && (
                <Button size="sm" asChild className='dark:text-gray-200 cursor-pointer'>
                  <Link href="/dashboard/editor/pages">
                    <Plus className="h-4 w-4 mr-2" />
                    New Page
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" asChild className='dark:text-gray-200 cursor-pointer'>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 overflow-y-auto max-h-[calc(100vh-4rem)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
