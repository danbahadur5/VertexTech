'use client'
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../../lib/auth-context';

export default function AdminPagesManager() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [pages, setPages] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [current, setCurrent] = useState(null);
  const [originalSlug, setOriginalSlug] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    status: 'draft',
    heroTitle: '',
    summary: '',
    metaTitle: '',
    metaDescription: '',
  });

  const load = async () => {
    const res = await fetch('/api/pages', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setPages(data.items || []);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      status: 'draft',
      heroTitle: '',
      summary: '',
      metaTitle: '',
      metaDescription: '',
    });
    setCurrent(null);
    setOriginalSlug('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Please fill in required fields: Title and Slug');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.startsWith('/') ? form.slug.trim() : `/${form.slug.trim()}`,
        status: form.status,
        blocks: [
          { id: 'hero', type: 'hero', content: { title: form.heroTitle, summary: form.summary }, order: 0 },
        ],
        seo: { metaTitle: form.metaTitle, metaDescription: form.metaDescription, keywords: [] },
      };
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create page');
      await load();
      setOpen(false);
      resetForm();
      toast.success('Page created');
    } catch (err) {
      toast.error(err.message || 'Failed to create page');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (page) => {
    setCurrent(page);
    setOriginalSlug(page.slug);
    const heroBlock = (page.blocks || []).find((b) => b.type === 'hero') || {};
    setForm({
      title: page.title || '',
      slug: page.slug || '',
      status: page.status || 'draft',
      heroTitle: heroBlock?.content?.title || '',
      summary: heroBlock?.content?.summary || '',
      metaTitle: page?.seo?.metaTitle || '',
      metaDescription: page?.seo?.metaDescription || '',
    });
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Please fill in required fields: Title and Slug');
      return;
    }
    setSaving(true);
    try {
      const updatedBlocks = [
        { id: 'hero', type: 'hero', content: { title: form.heroTitle, summary: form.summary }, order: 0 },
      ];
      const payload = {
        title: form.title.trim(),
        status: form.status,
        blocks: updatedBlocks,
        seo: { metaTitle: form.metaTitle, metaDescription: form.metaDescription, keywords: [] },
      };
      const newSlug = form.slug.trim();
      if (newSlug && newSlug !== originalSlug) {
        payload.slug = newSlug.startsWith('/') ? newSlug : `/${newSlug}`;
      }
      const res = await fetch(`/api/pages/${encodeURIComponent(originalSlug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update page');
      toast.success('Page updated');
      setEditOpen(false);
      setCurrent(null);
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed to update page');
    } finally {
      setSaving(false);
    }
  };

  const startDelete = (page) => {
    setCurrent(page);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!current) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pages/${encodeURIComponent(current.slug)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');
      toast.success('Page deleted');
      setDeleteOpen(false);
      setPages((prev) => prev.filter((p) => p.slug !== current.slug));
      setCurrent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete page');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pages Manager</h1>
            <p className="text-gray-600 mt-2">Create and manage website pages</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>Provide required details for each section.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g. Pricing" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" placeholder="/pricing" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input placeholder="Hero section heading" value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Textarea rows={3} placeholder="Short summary for the page" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input placeholder="SEO title" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea rows={3} placeholder="SEO description" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
                  </div>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Page'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Page</DialogTitle>
                <DialogDescription>Update page content and metadata.</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmitEdit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input id="edit-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-slug">Slug</Label>
                    <Input id="edit-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <Textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meta Title</Label>
                    <Input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
                  </div>
                </div>
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Page</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  Are you sure you want to delete <span className="font-semibold">{current?.title}</span>?
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button type="button" onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <TableRow key={page._id || page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell className="font-mono text-sm">{page.slug}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{page.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(page.updatedAt || page.updatedAtISO || page.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(page)} className="hover:bg-blue-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button variant="ghost" size="sm" onClick={() => startDelete(page)} className="hover:bg-red-50">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
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
