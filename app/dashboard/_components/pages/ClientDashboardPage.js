import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Skeleton } from '../../../components/ui/skeleton';
import { 
  FolderOpen, 
  MessageSquare, 
  CreditCard, 
  UserCircle, 
  ArrowUpRight,
  Image as ImageIcon
} from 'lucide-react';

export default function ClientDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/client/stats', { cache: 'no-store' });
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (err) {
        console.error("Failed to fetch client stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { name: 'Active Projects', value: data?.projects ?? 0, change: data?.trends?.projects ?? '+0', icon: FolderOpen, href: '/dashboard/client/projects' },
    { name: 'Open Tickets', value: data?.tickets ?? 0, change: data?.trends?.tickets ?? '+0', icon: MessageSquare, href: '/dashboard/client/support' },
    { name: 'Invoices Due', value: data?.invoices ?? 0, change: data?.trends?.invoices ?? '0', icon: CreditCard, href: '/dashboard/client/billing' },
    { name: 'Media Shared', value: data?.media ?? 0, change: data?.trends?.media ?? '+0', icon: ImageIcon, href: '/dashboard/client/projects' },
  ];

  const quickLinks = [
    { name: 'View Projects', href: '/dashboard/client/projects', icon: FolderOpen },
    { name: 'Open Support Ticket', href: '/dashboard/client/support', icon: MessageSquare },
    { name: 'Update Profile', href: '/dashboard/client/profile', icon: UserCircle },
    { name: 'Billing & Invoices', href: '/dashboard/client/billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300">Client Dashboard</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">Track your projects, support, and billing in one place.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.name} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-950 dark:hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{s.name}</CardTitle>
                  <Icon className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                </CardHeader>
                <CardContent className="dark:text-gray-300">
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-300">{s.value}</div>
                  )}
                  <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {loading ? <Skeleton className="h-4 w-20" /> : `${s.change} from last period`}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
                    <Link to={s.href}>View Details →</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-white dark:bg-gray-950">
          <CardHeader>
            <CardTitle className="dark:text-gray-300">Quick Links</CardTitle>
            <CardDescription className="dark:text-gray-400">Frequently used client actions</CardDescription>
          </CardHeader>
          <CardContent className="dark:text-gray-300">
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((q) => {
                const Icon = q.icon;
                return (
                  <Link to={q.href} key={q.name}>
                    <Card className="hover:border-blue-300 dark:bg-gray-950 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="pt-6 text-center dark:text-gray-300">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900 dark:to-green-900 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{q.name}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
