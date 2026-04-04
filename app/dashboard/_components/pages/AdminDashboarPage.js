import React from 'react';
import Link from 'next/link';
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
import { Skeleton } from '../../../components/ui/skeleton';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({ users: 0, pages: 0, posts: 0, projects: 0, tickets: 0 });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('/api/admin/stats', { cache: 'no-store' }),
          fetch('/api/admin/activities?limit=5', { cache: 'no-store' })
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStatsData(data);
        }

        if (activitiesRes.ok) {
          const data = await activitiesRes.json();
          setActivities(data.data?.activities || []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };
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
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-gray-300">
                  Admin
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-gray-900 dark:text-gray-300">
                  Manage Your Site Content With Clarity
                </h1>
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-400 leading-relaxed">
                  Review key metrics and jump straight into editing hero content, pages, and media. Designed for accessibility and focus.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="bg-blue-600 hover:bg-blue-700 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    <Link href="/dashboard/admin/appearance/hero">Edit Hero Content</Link>
                  </Button>
                  <Link
                    href="/dashboard/admin/media"
                    className="text-blue-700 font-semibold underline underline-offset-4 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 rounded"
                  >
                    Manage Media
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-auto md:min-w-[320px] dark:bg-gray-800 rounded-xl">
                <div className="rounded-xl bg-white shadow-sm p-6 dark:bg-black">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">At a Glance</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">{String(statsData.pages || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">Pages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">{String(statsData.posts || 0)}</div>
                      <div className="text-xs text-gray-600 mt-1">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-300">{String(statsData.projects || 0)}</div>
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
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-300">{stat.value}</div>
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
                    <Link href={stat.href}>
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
                    <Link key={action.name} href={action.href}>
                      <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="pt-6 text-center">
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 dark:from-gray-800 dark:to-gray-700">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{action.name}</p>
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
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-4 pb-4">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))
                ) : activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={activity._id || index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'content' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'user' ? 'bg-green-100 text-green-600' :
                        activity.type === 'support' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-300 line-clamp-1">{activity.action}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{activity.userName}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap dark:text-gray-500 mt-1">
                        {formatTime(activity.createdAt)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">No recent activity found</p>
                  </div>
                )}
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
              <Button variant="outline" size="sm" className="w-full mt-4 dark:text-gray-300 dark:border-gray-600" asChild>
                <Link href="/dashboard/admin/support">View All Tickets</Link>
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
              <Button variant="outline" size="sm" className="w-full mt-4 dark:text-gray-300 dark:border-gray-600" asChild>
                <Link href="/dashboard/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
