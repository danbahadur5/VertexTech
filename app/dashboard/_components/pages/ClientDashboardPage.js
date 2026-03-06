import React from 'react';
import { Link } from 'react-router';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  FolderOpen, 
  MessageSquare, 
  CreditCard, 
  UserCircle, 
  ArrowUpRight,
  Image as ImageIcon
} from 'lucide-react';
import { mockDashboardStats, mockTickets } from '../../../lib/mock-data';

export default function ClientDashboardPage() {
  const stats = [
    { name: 'Active Projects', value: mockDashboardStats.projects.toString(), change: '+2', icon: FolderOpen, href: '/dashboard/client/projects' },
    { name: 'Open Tickets', value: String(mockTickets.filter(t => t.status !== 'resolved').length), change: '+1', icon: MessageSquare, href: '/dashboard/client/support' },
    { name: 'Invoices Due', value: '1', change: '0', icon: CreditCard, href: '/dashboard/client/billing' },
    { name: 'Media Shared', value: '42', change: '+5', icon: ImageIcon, href: '/dashboard/client/projects' },
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
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your projects, support, and billing in one place.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{s.name}</CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {s.change} from last period
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
                    <Link to={s.href}>View Details →</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Frequently used client actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((q) => {
                const Icon = q.icon;
                return (
                  <Link to={q.href} key={q.name}>
                    <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="pt-6 text-center">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <Icon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{q.name}</p>
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
