import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
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
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../lib/auth-context";
import { useTheme } from "next-themes";
import { siteSettings } from "../../lib/site-settings";
import logo from "./assets/logo.png";
import logoDark from "./assets/dark_logo.png";
import logoLight from "./assets/light_logo.png";
import Image from "next/image";


const Logo = ({ theme }) => (
  theme === "dark" ? (
    <Link to="/" className="flex items-center gap-2 group">
      <Image src={logoLight} alt={siteSettings.brand.name} className="object-contain" height={160} width={160} />
    </Link>
  ) : (
    <Link to="/" className="flex items-center gap-2 group">
      <Image src={logoDark} alt={siteSettings.brand.name} className="object-contain" height={160} width={160} />
    </Link>
  )
);

const NavLink = ({ item, isActive, onClick }) => {
  return (
    <Link
      to={item.href}
      className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-colors
        after:absolute after:left-3 after:right-3 after:bottom-0 after:h-[2px] 
        after:bg-[var(--theme-primary)] after:rounded-full after:transition-transform after:duration-300
        ${
          isActive
            ? "theme-text after:scale-x-100"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:scale-x-0 hover:after:scale-x-100"
        }`}
      onClick={onClick}
    >
      {item.name}
    </Link>
  );
};

const DropdownNav = ({ item, isActive }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`flex items-center gap-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors
          relative after:absolute after:left-3 after:right-3 after:bottom-0 after:h-[2px] 
          after:bg-[var(--theme-primary)] after:rounded-full after:transition-transform after:duration-300
          ${
            isActive
              ? "theme-text after:scale-x-100"
              : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white after:scale-x-0 hover:after:scale-x-100"
          }`}
      >
        <span>{item.name}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-900/5 dark:ring-gray-700 animate-slide-down">
          <div className="p-2">
            <div className="grid grid-cols-1 gap-1">
              {item.dropdown?.map((sub) => (
                <Link
                  key={sub.name}
                  to={sub.href}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                    <i className={`text-lg ${sub.icon} theme-text`}></i>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{sub.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
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
}) => {
  const navigate = useNavigate();

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
                  to={item.href}
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
                        to={sub.href}
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
              <Button
                className="theme-btn w-full flex items-center gap-2"
                onClick={() => {
                  navigate(`/dashboard/${user?.role}`);
                  onClose();
                }}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    navigate("/login");
                    onClose();
                  }}
                >
                  <LogIn className="h-4 w-4" /> Log in
                </Button>
                <Button
                  className="theme-btn w-full flex items-center gap-2"
                  onClick={() => {
                    navigate("/contact");
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
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isUserActive = () => {
    if (isAuthenticated) return location.pathname.startsWith("/dashboard");
    return location.pathname === "/login" || location.pathname === "/register";
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

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3 items-center">
            {/* <ThemeSwitcher /> */}
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="bg-transparent dark:bg-gray-800 border-none cursor-pointer text-gray-900 dark:text-gray-100 h-9 w-9"
            >
              <Sun className="h-4 w-4 hidden dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </Button>

            {isAuthenticated ? (
              <Button
                className="theme-btn rounded-lg px-5 h-9 cursor-pointer text-sm font-semibold"
                onClick={() => navigate(`/dashboard/${user?.role}`)}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer border px-5 py-2 hover:bg-transparent transition-all duration-300"
                >
                  Log in
                </Button>
                {siteSettings.nav.ctas.map((cta) => (
                  <Button
                    key={cta.name}
                    size="sm"
                    variant={cta.variant}
                    className={`${cta.variant === "default" ? "theme-btn" : "theme-btn-outline cursor-pointer"} rounded-lg px-5 h-9 text-sm font-semibold cursor-pointer`}
                    onClick={() => navigate(cta.href)}
                  >
                    {cta.name}
                  </Button>
                ))}
              </>
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
              to={isAuthenticated ? `/dashboard/${user?.role}` : "/login"}
              className={`flex items-center justify-center h-9 w-9 rounded-full transition-colors
                ${isUserActive() ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
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
            to="/services"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors
              ${isActive("/services") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span className="text-[10px] mt-1 cursor-pointer font-medium">Services</span>
          </Link>
          <Link
            to="/about"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors
              ${isActive("/about") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Info className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">About</span>
          </Link>
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors relative
              ${isActive("/") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <div
              className={`p-2 rounded-full ${isActive("/") ? "theme-gradient" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <Home
                className={`h-6 w-6 ${isActive("/") ? "text-white" : "text-gray-600 dark:text-gray-400"}`}
              />
            </div>
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link
            to="/caseStudy"
            className={`flex flex-col items-center justify-center py-2 px-1 flex-1 transition-colors
              ${isActive("/caseStudy") ? "theme-text" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
          >
            <Images className="h-5 w-5" />
            <span className="text-[10px] mt-1 font-medium">Case Study</span>
          </Link>
          <Link
            to="/contact"
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
      />

      {/* Spacers for fixed elements */}
      <div className="lg:hidden h-14" />
    </>
  );
}
