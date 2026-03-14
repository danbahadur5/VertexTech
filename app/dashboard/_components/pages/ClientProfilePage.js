import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { useAuth } from '../../../lib/auth-context';
import { toast } from 'sonner';
import { Camera, Loader2, User as UserIcon } from 'lucide-react';

export default function ClientProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
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
    }
  }, [user]);

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
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Profile Settings</h1>
          <p className="text-gray-500 mt-2 dark:text-slate-400">Manage your personal information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Avatar Card */}
          <Card className="lg:col-span-1 border dark:border-slate-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Your Photo</CardTitle>
              <CardDescription>This will be displayed on your profile</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-8">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage src={formData.avatar} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                    {formData.name?.charAt(0) || <UserIcon />}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg cursor-pointer transition-all transform hover:scale-110">
                  <Camera className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-center">
                JPG, GIF or PNG. Max size of 800K
              </p>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="lg:col-span-2 border dark:border-slate-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
              <CardDescription>Update your contact and professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold dark:text-gray-300">Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setForm({...formData, name: e.target.value})}
                    placeholder="Your name" 
                    className="h-11 bg-white dark:bg-gray-950 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold dark:text-gray-300">Email Address</Label>
                  <Input 
                    value={formData.email} 
                    disabled
                    placeholder="you@example.com" 
                    className="h-11 bg-gray-100 dark:bg-gray-800 opacity-70 cursor-not-allowed rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold dark:text-gray-300">Company</Label>
                  <Input 
                    value={formData.company} 
                    onChange={(e) => setForm({...formData, company: e.target.value})}
                    placeholder="Your company" 
                    className="h-11 bg-white dark:bg-gray-950 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold dark:text-gray-300">Phone Number</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setForm({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000" 
                    className="h-11 bg-white dark:bg-gray-950 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <Button 
                  variant="outline" 
                  className="rounded-xl px-6 h-11"
                  onClick={() => setForm({ ...user })}
                >
                  Reset
                </Button>
                <Button 
                  className="rounded-xl px-8 h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={onSave}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
