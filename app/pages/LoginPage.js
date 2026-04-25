import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Github, Eye, EyeOff } from 'lucide-react';

/**
 * LoginPage - Human-Crafted Authentication
 * 
 * I've designed this page to be more than just a form. It's the gateway to the platform.
 * I've added a password visibility toggle (Eye/EyeOff) because it's a huge UX win.
 * The background decorations are subtle but add that "premium" feel we're aiming for.
 */

export default function LoginPage() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const { login, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();

  // Simple email validation for real-time feedback
  const validateEmail = (email) => {
    if (!email) return '';
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? '' : 'Please enter a valid email address';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUserEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;
    
    setIsAuthenticating(true);
    try {
      const userData = await login(userEmail, userPassword);
      toast.success(`Welcome back, ${userData.name || 'friend'}!`);
      router.push(`/dashboard/${userData.role}`);
    } catch (err) {
      if (err.message?.includes('inactive')) {
        toast.error('Your account is currently inactive. Drop a line to support@darbartech.com.');
      } else if (err.message?.includes('password')) {
        toast.error("That password doesn't seem right. Give it another shot?");
      } else {
        toast.error("We couldn't sign you in. Check your credentials and try again.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex overflow-hidden font-sans">
      {/* Left Side: Branding & Info (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.1),transparent_50%)]" />
          {/* Decorative Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Lock className="w-3 h-3" /> Secure Enterprise Access
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-6 leading-[1.1]">
              The nexus of <span className="text-blue-500">innovation</span> and security.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-10">
              Access your workspace with enterprise-grade protection. Join thousands of teams building the next generation of digital experiences.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Enterprise Uptime', value: '99.99%' },
                { label: 'Security Standard', value: 'SOC2 Type II' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50/50 dark:bg-gray-950 relative">
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.05),transparent_50%)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[440px]"
        >
          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
              Sign in to <span className="text-blue-600">Darbar</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              New to the platform? <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-bold hover:underline underline-offset-4">Create an account</Link>
            </p>
          </div>

          <Card className="border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-6 pt-8 px-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Email Address
                    </Label>
                    {emailError && (
                      <span className="text-[10px] font-bold text-red-500 animate-pulse">{emailError}</span>
                    )}
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className={`pl-11 h-14 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all ${emailError ? 'border-red-200 focus:ring-red-500/10' : ''}`}
                      value={userEmail}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Password
                    </Label>
                    <Link href="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-11 pr-12 h-14 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <label htmlFor="remember" className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer select-none">Stay signed in for 30 days</label>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-6 p-8">
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/20 transform active:scale-[0.98] transition-all" 
                  disabled={isAuthenticating || !!emailError}
                >
                  {isAuthenticating ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : "Sign In to Dashboard"}
                </Button>

                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100 dark:border-gray-800"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="bg-white dark:bg-gray-900 px-4 text-gray-400">Secure SSO Options</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="h-12 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all flex items-center justify-center gap-2"
                    onClick={() => signInWithGithub()}
                  >
                    <Github className="w-5 h-5" /> GitHub
                  </Button>
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="h-12 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all flex items-center justify-center gap-2"
                    onClick={() => signInWithGoogle()}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Don't have an enterprise account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Request access
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
