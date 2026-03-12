'use client'
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { toast } from 'sonner';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [current, setCurrent] = useState(null);
  const [originalSlug, setOriginalSlug] = useState('');
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: '',
    status: 'draft',
    featured: false,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blog', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data.items || []);
    } catch {
      setError('Unable to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      category: '',
      tags: '',
      status: 'draft',
      featured: false,
    });
    setCurrent(null);
    setOriginalSlug('');
  };

  const handleNewPostClick = () => {
    resetForm();
    setOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast.error('Please fill Title, Slug and Content');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim().replace(/^\//, ''),
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || undefined,
        featuredImage: form.featuredImage.trim() || undefined,
        category: form.category.trim() || undefined,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: form.status,
        featured: !!form.featured,
      };
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create post');
      toast.success('Post created');
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed to create post');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (post) => {
    setCurrent(post);
    setOriginalSlug(post.slug);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featuredImage: post.featuredImage || '',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      status: post.status || 'draft',
      featured: !!post.featured,
    });
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast.error('Please fill Title, Slug and Content');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || undefined,
        featuredImage: form.featuredImage.trim() || undefined,
        category: form.category.trim() || undefined,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: form.status,
        featured: !!form.featured,
      };
      const newSlug = form.slug.trim().replace(/^\//, '');
      if (newSlug && newSlug !== originalSlug) {
        payload.slug = newSlug;
      }
      const res = await fetch(`/api/blog/${encodeURIComponent(originalSlug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update post');
      toast.success('Post updated');
      setEditOpen(false);
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const startDelete = (post) => {
    setCurrent(post);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!current) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(current.slug)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      toast.success('Post deleted');
      setDeleteOpen(false);
      setPosts((prev) => prev.filter((p) => p.slug !== current.slug));
      setCurrent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Blog Manager</h1>
            <p className="text-gray-600 mt-2 ">Create and manage blog posts</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNewPostClick}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>New Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                  <Textarea rows={3} placeholder="Excerpt" className="sm:col-span-2" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                  <Textarea rows={6} placeholder="Content" className="sm:col-span-2" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                  <Input placeholder="Featured image URL" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
                  <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                  <div className="sm:col-span-2">
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? 'Creating...' : 'Create Post'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>Edit Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmitEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                  <Textarea rows={3} placeholder="Excerpt" className="sm:col-span-2" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                  <Textarea rows={6} placeholder="Content" className="sm:col-span-2" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                  <Input placeholder="Featured image URL" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
                  <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                  <div className="sm:col-span-2">
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="featured-edit" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                    <Label htmlFor="featured-edit">Featured</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? 'Saving...' : 'Save Changes'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>Delete Blog Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">Are you sure you want to delete <span className="font-semibold">{current?.title}</span>? This action cannot be undone.</p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button type="button" onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">{deleting ? 'Deleting...' : 'Yes, Delete'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>Manage your blog content</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-sm text-gray-500">Loading posts…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id || post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={post.status === 'published' ? 'bg-green-100 text-green-800' : ''}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.featured ? <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge> : '-'}
                    </TableCell>
                    <TableCell>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(post)} className="hover:bg-blue-50">
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => startDelete(post)} className="hover:bg-red-50">
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
