import React from 'react';
import { Link } from 'react-router';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Users, 
  FileText, 
  Briefcase, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/badge';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({ users: 0, pages: 0, posts: 0, projects: 0, tickets: 0 });
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch {}
    };
    load();
  }, []);
  const stats = [
    {
      name: 'Total Users',
      value: (statsData.users || 0).toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      href: '/dashboard/admin/users',
    },
    {
      name: 'Published Pages',
      value: String(statsData.pages || 0),
      change: '+5',
      trend: 'up',
      icon: FileText,
      href: '/dashboard/admin/pages',
    },
    {
      name: 'Blog Posts',
      value: String(statsData.posts || 0),
      change: '+18',
      trend: 'up',
      icon: FileText,
      href: '/dashboard/admin/blog',
    },
    {
      name: 'Active Projects',
      value: String(statsData.projects || 0),
      change: '+8',
      trend: 'up',
      icon: Briefcase,
      href: '/dashboard/admin/caseStudy',
    },  
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'John Smith', time: '2 hours ago', type: 'user' },
    { action: 'Blog post published', user: 'Sarah Johnson', time: '5 hours ago', type: 'content' },
    { action: 'Service page updated', user: 'Michael Chen', time: '1 day ago', type: 'content' },
    { action: 'Support ticket resolved', user: 'Admin User', time: '1 day ago', type: 'support' },
    { action: 'New Case Study added', user: 'Sarah Johnson', time: '2 days ago', type: 'content' },
  ];

  const quickActions = [
    { name: 'Create New Page', href: '/dashboard/admin/pages', icon: FileText },
    { name: 'Add Blog Post', href: '/dashboard/admin/blog', icon: FileText },
    { name: 'Add Case Study', href: '/dashboard/admin/caseStudy', icon: Briefcase },
    { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Card className="border shadow-sm rounded-2xl">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-800">
                  Admin
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-gray-900">
                  Manage Your Site Content With Clarity
                </h1>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  Review key metrics and jump straight into editing hero content, pages, and media. Designed for accessibility and focus.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    <Link to="/dashboard/admin/appearance/hero">Edit Hero Content</Link>
                  </Button>
                  <Link
                    to="/dashboard/admin/media"
                    className="text-blue-700 font-semibold underline underline-offset-4 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 rounded"
                  >
                    Manage Media
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-auto md:min-w-[320px]">
                <div className="rounded-xl border bg-white shadow-sm p-6">
                  <div className="text-sm font-semibold text-gray-700 mb-2">At a Glance</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{String(statsData.pages || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">Pages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{String(statsData.posts || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{String(statsData.projects || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === 'up';
            return (
              <Card key={stat.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4 w-full" asChild>
                    <Link to={stat.href}>
                      View Details →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used admin tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.name} to={action.href}>
                      <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="pt-6 text-center">
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">{action.name}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Content Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Published Pages</span>
                <Badge variant="secondary">{statsData?.pagesByStatus?.published ?? statsData.pages ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Draft Posts</span>
                <Badge>{statsData?.postsByStatus?.draft ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Case Study Projects</span>
                <Badge variant="secondary">{statsData?.projects ?? 0}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Open</span>
                <Badge variant="destructive">{statsData?.ticketsByStatus?.open ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <Badge className="bg-yellow-100 text-yellow-800">{statsData?.ticketsByStatus?.inProgress ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved</span>
                <Badge className="bg-green-100 text-green-800">{statsData?.ticketsByStatus?.resolved ?? 0}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link to="/dashboard/admin/support">View All Tickets</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admin Users</span>
                <Badge>{statsData?.usersByRole?.admin ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Editors</span>
                <Badge>{statsData?.usersByRole?.editor ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Clients</span>
                <Badge variant="secondary">{statsData?.usersByRole?.client ?? 0}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link to="/dashboard/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
