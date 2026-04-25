"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  X,
  ChevronDown,
  Sun,
  Moon,
  Shield,
  Home,
  LayoutGrid,
  DollarSign,
  Info,
  FileText,
  Images,
  Mail,
  LogIn,
  LayoutDashboard,
  User,
  Menu,
  ArrowRight,
  ExternalLink,
  Code2,
  Lock,
  Cloud,
  BarChart3,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../lib/auth-context";
import { useTheme } from "next-themes";
import { siteSettings } from "../../lib/site-settings";
import logoDark from "./assets/dark_logo.png";
import logoLight from "./assets/light_logo.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const Logo = ({ theme }) => (
  <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
    {theme === "dark" ? (
      <Image src={logoLight} alt={siteSettings.brand.name} className="h-8 md:h-10 w-auto object-contain" height={40} width={160} priority />
    ) : (
      <Image src={logoDark} alt={siteSettings.brand.name} className="h-8 md:h-10 w-auto object-contain" height={40} width={160} priority />
    )}
  </Link>
);

const NavLink = ({ item, isActive, onClick }) => {
  return (
    <Link
      href={item.href}
      className={`relative px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-200 rounded-lg group cursor-pointer font-sans
        ${
          isActive
            ? "theme-text"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        }`}
      onClick={onClick}
    >
      <span>{item.name}</span>
      <span className={`absolute inset-x-4 bottom-1 h-0.5 bg-[var(--theme-primary)] rounded-full transition-transform duration-300 origin-left
        ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} 
      />
    </Link>
  );
};

const DropdownNav = ({ item, isActive }) => {
  const serviceIcons = {
    "Cloud Solutions": Cloud,
    "Cybersecurity": Lock,
    "Custom Software": Code2,
    "Data Analytics": BarChart3,
  };

  return (
    <div className="relative h-full flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-200 rounded-lg outline-none group cursor-pointer font-sans
              ${
                isActive
                  ? "theme-text"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            <span>{item.name}</span>
            <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-all group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          sideOffset={8}
          collisionPadding={20}
          className="w-[640px] max-w-[calc(100vw-2rem)] p-6 rounded-3xl shadow-2xl border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3">
                Core Services
              </p>
              <div className="grid grid-cols-1 gap-1">
                {item.dropdown?.map((sub) => {
                  const Icon = serviceIcons[sub.name] || LayoutGrid;
                  return (
                    <DropdownMenuItem key={sub.name} asChild className="p-0 focus:bg-transparent">
                      <Link
                        href={sub.href}
                        className="group flex items-start gap-4 rounded-2xl px-3 py-3 transition-all duration-200 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700 shadow-sm transition-all border border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900/30">
                          <Icon className="h-5 w-5 theme-text" />
                        </div>
                        <div className="flex flex-col gap-1">
                  <span className="font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-1.5 tracking-tight">
                    {sub.name}
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all theme-text" />
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 leading-relaxed font-medium">
                    {sub.description || "Expert " + sub.name.toLowerCase() + " for your business growth."}
                  </span>
                </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl p-6 flex flex-col justify-between border border-gray-100/50 dark:border-gray-700/30">
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 dark:text-white">Need custom solution?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  We design and build bespoke software tailored to your specific business requirements and goals.
                </p>
              </div>
              <div className="space-y-3">
                <Button asChild className="w-full theme-btn rounded-xl h-11 shadow-lg shadow-blue-500/10">
                  <Link 
                    href="/contact" 
                    className="flex items-center justify-center gap-2" 
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Link 
                  href="/services" 
                  className="flex items-center justify-center gap-2 text-sm font-bold theme-text hover:underline"
                >
                  Explore all services <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const MobileMenu = ({
  isOpen,
  onClose,
  navigation,
  isActive,
  isAuthenticated,
  user,
  theme,
  onLogout,
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-2xl rounded-t-2xl lg:hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <Logo theme={theme} />
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-6 space-y-1 max-h-[70vh] overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="space-y-1">
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-base font-semibold transition-colors
                    ${isActive(item.href) ? "theme-text" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  onClick={onClose}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {item.name}
                </Link>
                {item.hasDropdown && (
                  <div className="pl-12 space-y-1">
                    {item.dropdown?.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={onClose}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div className="pt-4 border-t dark:border-gray-700 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Button
                  className="theme-btn w-full flex items-center gap-2"
                  onClick={() => {
                    router.push(`/dashboard/${user?.role}`);
                    onClose();
                  }}
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    router.push(user?.role === 'admin' ? '/dashboard/admin/settings' : `/dashboard/${user?.role}/profile`);
                    onClose();
                  }}
                >
                  <Settings className="h-4 w-4" /> Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                >
                  <LogOut className="h-4 w-4" /> Log out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    router.push("/login");
                    onClose();
                  }}
                >
                  <LogIn className="h-4 w-4" /> Log in
                </Button>
                <Button
                  className="theme-btn w-full flex items-center gap-2"
                  onClick={() => {
                    router.push("/contact");
                    onClose();
                  }}
                >
                  Start Project
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// --- Main Component ---

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [services, setServices] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, loading, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync auth state to avoid skeleton flickers
  useEffect(() => {
    if (!loading) {
      setAuthReady(true);
    }
  }, [loading]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setServices(data.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch services for nav:", err);
      }
    };
    fetchServices();
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isUserActive = () => {
    if (isAuthenticated) return pathname.startsWith("/dashboard");
    return pathname === "/login" || pathname === "/register";
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    {
      name: "Services",
      href: "/services",
      icon: LayoutGrid,
      hasDropdown: true,
      dropdown: services.length > 0 
        ? services.map(s => ({ name: s.title, href: `/services/${s.slug}` }))
        : [
            { name: "Cloud Solutions", href: "/services/cloud-solutions" },
            { name: "Cybersecurity", href: "/services/cybersecurity" },
            { name: "Custom Software", href: "/services/custom-software" },
            { name: "Data Analytics", href: "/services/data-analytics" },
          ],
    },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "About", href: "/about", icon: Info },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Case Study", href: "/caseStudy", icon: Images },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 hidden lg:block
          ${
            scrolled
              ? "bg-white/95 dark:bg-gray-950 backdrop-blur-md shadow-md border-b border-gray-100 dark:border-gray-800"
              : "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
          }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Logo theme={mounted ? resolvedTheme : "light"} />
          </div>

          <div className="hidden lg:flex items-center lg:gap-x-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <DropdownNav item={item} isActive={isActive(item.href)} />
                ) : (
                  <NavLink item={item} isActive={isActive(item.href)} />
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="rounded-full bg-gray-50/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 h-10 w-10 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-300"
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 dark:hidden" />
            </Button>

            {/* Auth Actions */}
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1" />

            {authReady && (
              isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative group outline-none cursor-pointer">
                      <div className="h-10 w-10 rounded-full theme-bg p-[2px] transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                        <div className="h-full w-full rounded-full bg-white dark:bg-gray-950 flex items-center justify-center overflow-hidden">
                          {user?.image ? (
                            <Image src={user.image} alt={user.name} width={40} height={40} className="h-full w-full object-cover" />
                          ) : (
                            <span className="theme-text font-bold text-sm">
                              {user?.name?.[0]?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                    <DropdownMenuLabel className="px-3 py-3">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                    <div className="p-1">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/${user?.role}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
                          <LayoutDashboard className="h-4 w-4 theme-text" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          href={user?.role === 'admin' ? '/dashboard/admin/settings' : `/dashboard/${user?.role}/profile`} 
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                        >
                          <Settings className="h-4 w-4 theme-text" /> Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" /> Log out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:theme-text transition-colors"
                  >
                    Log in
                  </Link>
                  <Button
                    onClick={() => router.push("/contact")}
                    className="theme-btn rounded-xl px-6 h-11 text-sm font-bold shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Start Project
                  </Button>
                </div>
              )
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo theme={mounted ? resolvedTheme : "light"} />

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full bg-transparent dark:bg-gray-800 border-none cursor-pointer text-gray-900 dark:text-gray-100"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </Button>

            <Link
              href={isAuthenticated ? `/dashboard/${user?.role}` : "/login"}
              className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300
                ${isUserActive() ? "theme-bg text-white shadow-lg shadow-blue-500/20 scale-110" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md"}`}
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Tab Bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <nav className="flex items-center justify-around px-2 py-1">
          <Link
            href="/services"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors
              ${isActive("/services") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[10px] mt-1 cursor-pointer font-medium">Services</span>
          </Link>
          <Link
            href="/about"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors
              ${isActive("/about") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Info className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">About</span>
          </Link>
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors relative
              ${isActive("/") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <div
              className={`p-2 rounded-full ${isActive("/") ? "theme-bg" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <Home
                className={`h-6 w-6 ${isActive("/") ? "text-white" : "text-gray-600 dark:text-gray-400"}`}
              />
            </div>
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link
            href="/caseStudy"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors
              ${isActive("/caseStudy") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Images className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Case Study</span>
          </Link>
          <Link
            href="/contact"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors
              ${isActive("/contact") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Mail className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Contact</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Slide-up Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
        isActive={isActive}
        isAuthenticated={isAuthenticated}
        user={user}
        toggleTheme={toggleTheme}
        theme={mounted ? resolvedTheme : "light"}
        onLogout={handleLogout}
      />

      {/* Spacers for fixed elements */}
      <div className="lg:hidden h-14" />
    </>
  );
}
