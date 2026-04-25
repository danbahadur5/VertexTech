import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent} from '../components/ui/card';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Github, ShieldCheck, ShieldAlert } from 'lucide-react';

/**
 * SignupPage - Authentically Crafted Registration
 * 
 * I wanted this page to feel encouraging. Signing up shouldn't be a chore.
 * Added a real-time password strength checker because it's better to show 
 * than to tell (via toast messages). 
 * 
 * The background elements are mirrored from the login page for consistency,
 * keeping that 'Vertex' brand feel alive.
 */

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { register, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  // Email validation logic
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

  // Password strength logic
  const passwordStrength = useMemo(() => {
    if (!userPassword) return 0;
    let strength = 0;
    if (userPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(userPassword)) strength += 1;
    if (/[0-9]/.test(userPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(userPassword)) strength += 1;
    return strength;
  }, [userPassword]);

  const strengthColor = [
    'bg-gray-200',
    'bg-red-400',
    'bg-amber-400',
    'bg-blue-400',
    'bg-emerald-400'
  ][passwordStrength];

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (userPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      toast.error("Please choose a stronger password for better security.");
      return;
    }

    setIsCreatingAccount(true);

    try {
      await register(fullName, userEmail, userPassword);
      toast.success("Enterprise account created successfully!");
      navigate('/login');
    } catch (err) {
      toast.error("Registration failed. Please check your details and try again.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex overflow-hidden font-sans">
      {/* Left Side: Branding & Info (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.1),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
              <ShieldCheck className="w-3 h-3" /> Secure Infrastructure
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-6 leading-[1.1]">
              Build the future on <span className="text-blue-500">trusted</span> foundations.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-10">
              Join the elite ecosystem of developers and enterprises. Experience seamless collaboration with enterprise-grade security and scalability.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Global Network', value: 'Edge Ready' },
                { label: 'Compliance', value: 'ISO 27001' },
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

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50/50 dark:bg-gray-950 relative overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.05),transparent_50%)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[480px] py-12"
        >
          <div className="text-center lg:text-left mb-10">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
              Create your <span className="text-blue-600">account</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Join 50,000+ developers building on Vertex.
            </p>
          </div>

          <Card className="border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden">
            <form onSubmit={handleRegistration}>
              <CardContent className="space-y-5 pt-8 px-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="name"
                      placeholder="Alex Rivera"
                      className="pl-11 h-12 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                    {emailError && <span className="text-[10px] font-bold text-red-500 animate-pulse">{emailError}</span>}
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className={`pl-11 h-12 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all ${emailError ? 'border-red-200 focus:ring-red-500/10' : ''}`}
                      value={userEmail}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-11 h-12 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Confirm</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-11 h-12 bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all ${passwordError ? 'border-red-200 focus:ring-red-500/10' : ''}`}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError(e.target.value !== userPassword ? "Passwords do not match" : "");
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {userPassword && (
                  <div className="px-1 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <span>Security Strength</span>
                      <span className={passwordStrength > 2 ? 'text-emerald-500' : 'text-amber-500'}>
                        {passwordStrength === 4 ? 'Vault-Grade' : passwordStrength > 2 ? 'Strong' : 'Improve Security'}
                      </span>
                    </div>
                    <div className="flex gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div 
                          key={step} 
                          className={`flex-1 rounded-full transition-all duration-500 ${step <= passwordStrength ? strengthColor : 'bg-gray-100 dark:bg-gray-800'}`} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 px-1 pt-2">
                  <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" required />
                  <label htmlFor="terms" className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight">
                    I agree to the <Link to="/terms" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/20 transform active:scale-[0.98] transition-all mt-4"
                  disabled={isCreatingAccount || !!emailError}
                >
                  {isCreatingAccount ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : "Create Enterprise Account"}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100 dark:border-gray-800"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="bg-white dark:bg-gray-900 px-4">Continue with SSO</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" onClick={() => signInWithGithub()} className="h-12 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all flex items-center justify-center gap-2">
                    <Github className="w-5 h-5" /> GitHub
                  </Button>
                  <Button variant="outline" type="button" onClick={() => signInWithGoogle()} className="h-12 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          <p className="mt-8 text-center text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
