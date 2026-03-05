import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminPagesManager() {
  const pages = [
    { id: '1', title: 'Home', slug: '/', status: 'published', updatedAt: '2026-03-01' },
    { id: '2', title: 'About', slug: '/about', status: 'published', updatedAt: '2026-02-28' },
    { id: '3', title: 'Services', slug: '/services', status: 'published', updatedAt: '2026-02-25' },
    { id: '4', title: 'Contact', slug: '/contact', status: 'published', updatedAt: '2026-02-20' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pages Manager</h1>
            <p className="text-gray-600 mt-2">Create and manage website pages</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
            <CardDescription>Manage your website pages and content</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="font-mono text-sm">{page.slug}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{page.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(page.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
