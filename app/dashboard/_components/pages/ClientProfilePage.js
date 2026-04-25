import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { useAuth } from '../../../lib/auth-context';
import { authClient } from '../../../lib/auth-client';
import { toast } from 'sonner';
import { Camera, Loader2, User as UserIcon, Shield, Smartphone, Monitor, Globe, LogOut } from 'lucide-react';

export default function ClientProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [formData, setForm] = useState({
    name: '',
    email: '',
    avatar: '',
    company: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        company: user.company || '',
        phone: user.phone || ''
      });
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const { data, error } = await authClient.listSessions();
      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const onRevokeSession = async (id) => {
    try {
      const { error } = await authClient.revokeSession({ id });
      if (error) throw error;
      toast.success('Session revoked');
      loadSessions();
    } catch (err) {
      toast.error('Failed to revoke session');
    }
  };

  const onSignOutAll = async () => {
    try {
      const { error } = await authClient.signOutAll();
      if (error) throw error;
      toast.success('Signed out from all devices');
      window.location.href = '/login';
    } catch (err) {
      toast.error('Failed to sign out from all devices');
    }
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          avatar: formData.avatar,
          company: formData.company,
          phone: formData.phone
        })
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      if (setUser) setUser(data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Profile & Security</h1>
            <p className="text-gray-500 mt-2 dark:text-slate-400">Manage your personal information and active sessions</p>
          </div>
          <Button onClick={onSave} disabled={loading} className="theme-btn">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Profile
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Account Details */}
            <Card className="border dark:border-slate-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-slate-800">
                <CardTitle className="text-xl flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={formData.name || ''} onChange={(e) => setForm({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={formData.email || ''} disabled className="bg-gray-50 dark:bg-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={formData.company || ''} onChange={(e) => setForm({ ...formData, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={formData.phone || ''} onChange={(e) => setForm({ ...formData, phone: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="border dark:border-slate-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Security & Active Sessions
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={onSignOutAll} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                    Sign Out All Devices
                  </Button>
                </div>
                <CardDescription>Manage your active login sessions across all your devices</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingSessions ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session, idx) => (
                      <div key={session.id || idx} className="flex items-center justify-between p-4 rounded-xl border dark:border-slate-800 bg-gray-50/50 dark:bg-gray-800/50 group transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white dark:bg-gray-900 rounded-lg border dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                            {session.device?.type === 'mobile' ? <Smartphone className="w-5 h-5 text-blue-600" /> : <Monitor className="w-5 h-5 text-blue-600" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 dark:text-gray-100">
                                {session.device?.browser || 'Unknown Browser'} on {session.device?.os || 'Unknown OS'}
                              </span>
                              {session.id === authClient.getSession()?.id && (
                                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                                  Current Device
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {session.ipAddress || 'Unknown IP'}</span>
                              <span>•</span>
                              <span>Last active: {new Date(session.updatedAt || session.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        {session.id !== authClient.getSession()?.id && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onRevokeSession(session.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full"
                          >
                            <LogOut className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* Avatar Card */}
            <Card className="border dark:border-slate-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
              <CardHeader className="text-center bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-slate-800">
                <CardTitle className="text-lg">Your Profile Photo</CardTitle>
                <CardDescription>JPG, GIF or PNG. Max size 800KB</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-8 pb-8">
                <div className="relative group">
                  <Avatar className="w-40 h-40 border-4 border-white dark:border-gray-800 shadow-2xl transition-transform group-hover:scale-105 duration-300">
                    <AvatarImage src={formData.avatar} className="object-cover" />
                    <AvatarFallback className="bg-blue-600 text-white text-5xl font-bold">
                      {formData.name?.charAt(0) || <UserIcon />}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-2 right-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl cursor-pointer transition-all transform hover:scale-110">
                    <Camera className="w-6 h-6" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div className="mt-8 w-full space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border dark:border-slate-800">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border dark:border-slate-800">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Role</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
