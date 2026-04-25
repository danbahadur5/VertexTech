import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  FileText, 
  Briefcase, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Image as ImageIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/badge';

export default function EditorDashboardPage() {
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
      name: 'Published Pages',
      value: String(statsData?.pages ?? 0),
      change: '+5',
      trend: 'up',
      icon: FileText,
      href: '/dashboard/editor/pages',
    },
    {
      name: 'Blog Posts',
      value: String(statsData?.posts ?? 0),
      change: '+18',
      trend: 'up',
      icon: FileText,
      href: '/dashboard/editor/blog',
    },
    {
      name: 'Case Study Projects',
      value: String(statsData?.projects ?? 0),
      change: '+3',
      trend: 'up',
      icon: Briefcase,
      href: '/dashboard/editor/caseStudy',
    },
    {
      name: 'Media Files',
      value: '256',
      change: '+21',
      trend: 'up',
      icon: ImageIcon,
      href: '/dashboard/editor/media',
    },  
  ];

  const quickActions = [
    { name: 'Create Page', href: '/dashboard/editor/pages', icon: FileText },
    { name: 'Write Blog Post', href: '/dashboard/editor/blog', icon: FileText },
    { name: 'Add Case Study', href: '/dashboard/editor/caseStudy', icon: Briefcase },
    { name: 'Upload Media', href: '/dashboard/editor/media', icon: ImageIcon },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300">Editor Dashboard</h1>
          <p className="text-gray-600 mt-2 dark:text-gray-400">Manage content across pages, blog, case studies, and media.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === 'up';
            return (
              <Card key={stat.name} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400 dark:text-gray-400" />
                </CardHeader>
                <CardContent className="dark:text-gray-300">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-300">{stat.value}</div>
                  <div className="flex items-center mt-2 dark:text-gray-400">
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2 dark:text-gray-400">from last month</span>
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
          <Card>
            <CardHeader>
              <CardTitle className="dark:text-gray-300">Quick Actions</CardTitle>
              <CardDescription className="dark:text-gray-400">Frequently used editor tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.name} href={action.href} className="dark:text-gray-300">
                      <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                        <CardContent className="pt-6 text-center">
                          <div className="dark:bg-gradient-to-br from-blue-950 dark:bg-gray-900 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Icon className="h-6 w-6 text-blue-600 dark:text-gray-300" />
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

          <Card className="dark:bg-gray-800 dark:hover:shadow-md">
            <CardHeader>
              <CardTitle className="dark:text-gray-300">Content Summary</CardTitle>
              <CardDescription className="dark:text-gray-400">Overview of your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Published Pages</span>
                <Badge variant="secondary" className="dark:bg-gray-800 dark:text-gray-300">{statsData?.pagesByStatus?.published ?? statsData?.pages ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Published Posts</span>
                <Badge className="dark:bg-gray-800 dark:text-gray-300">{statsData?.postsByStatus?.published ?? 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Case Studies</span>
                <Badge variant="secondary" className="dark:bg-gray-800 dark:text-gray-300">{statsData?.projects ?? 0}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
