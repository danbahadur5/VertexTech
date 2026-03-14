import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Shield, User, Mail, Lock, ArrowRight, Github } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error('Failed to sign in with Google');
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      toast.error('Failed to sign in with GitHub');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px] dark:bg-blue-600/10" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[100px] dark:bg-purple-600/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[480px]"
      >
        {/* <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VertexTech
            </span>
          </Link>
        </div> */}

        <Card className="border-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border border-white/20 dark:border-gray-800">
          <CardContent className="p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold dark:text-gray-300 ml-1">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-12 h-13 bg-gray-50/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold dark:text-gray-300 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-12 h-13 bg-gray-50/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" title="Min. 8 chars" className="text-sm font-semibold dark:text-gray-300 ml-1">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 h-13 bg-gray-50/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold dark:text-gray-300 ml-1">Confirm</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-12 h-13 bg-gray-50/50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all text-base"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <input type="checkbox" id="terms" className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" required />
                <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  I agree to the <Link to="/terms" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Terms</Link> and <Link to="/privacy" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 theme-gradient hover:theme-gradient-hover text-white font-bold text-lg rounded-2xl shadow-2xl shadow-blue-500/25 transform active:scale-[0.98] transition-all cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Free Account"}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-gray-800"></span></div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-gray-400"><span className="bg-white dark:bg-gray-900 px-4">OR</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" onClick={handleGithubSignIn} className="h-12 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer font-bold">
                  <Github className="w-5 h-5 mr-2" /> GitHub
                </Button>
                <Button variant="outline" type="button" onClick={handleGoogleSignIn} className="h-12 rounded-2xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer font-bold">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg> Google
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-black hover:underline">Sign In</Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-semibold text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            ← Back to website home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
