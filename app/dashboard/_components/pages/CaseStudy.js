import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { toast } from 'sonner';

export default function CaseStudyPage() {
  const [items, setItems] = useState([]);
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
    client: '',
    description: '',
    technologies: '',
    gallery: '',
    featured: false,
    completedAt: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/case-studies', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setItems(data.items || []);
      } catch {
        setError('Unable to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      client: '',
      description: '',
      technologies: '',
      gallery: '',
      featured: false,
      completedAt: '',
    });
    setCurrent(null);
    setOriginalSlug('');
  };

  const handleNew = () => {
    resetForm();
    setOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.client.trim() || !form.description.trim()) {
      toast.error('Please fill Title, Slug, Client and Description');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim().replace(/^\//, ''),
        client: form.client.trim(),
        description: form.description.trim(),
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        gallery: form.gallery.split(',').map(g => g.trim()).filter(Boolean),
        featured: !!form.featured,
        completedAt: form.completedAt ? form.completedAt : undefined,
      };
      const res = await fetch('/api/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create project');
      toast.success('Project created');
      setOpen(false);
      const reload = await fetch('/api/case-studies', { cache: 'no-store' });
      const data = await reload.json();
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setCurrent(p);
    setOriginalSlug(p.slug);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      client: p.client || '',
      description: p.description || '',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
      gallery: Array.isArray(p.gallery) ? p.gallery.join(', ') : '',
      featured: !!p.featured,
      completedAt: p.completedAt ? String(p.completedAt).slice(0, 10) : '',
    });
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.client.trim() || !form.description.trim()) {
      toast.error('Please fill Title, Slug, Client and Description');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        client: form.client.trim(),
        description: form.description.trim(),
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        gallery: form.gallery.split(',').map(g => g.trim()).filter(Boolean),
        featured: !!form.featured,
        completedAt: form.completedAt ? form.completedAt : undefined,
      };
      const newSlug = form.slug.trim().replace(/^\//, '');
      if (newSlug && newSlug !== originalSlug) payload.slug = newSlug;
      const res = await fetch(`/api/case-studies/${encodeURIComponent(originalSlug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update project');
      toast.success('Project updated');
      setEditOpen(false);
      const reload = await fetch('/api/case-studies', { cache: 'no-store' });
      const data = await reload.json();
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const startDelete = (p) => {
    setCurrent(p);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!current) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/case-studies/${encodeURIComponent(current.slug)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      toast.success('Project deleted');
      setDeleteOpen(false);
      setItems(prev => prev.filter(x => x.slug !== current.slug));
      setCurrent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Case Study Manager</h1>
            <p className="text-gray-600 mt-2">Manage your Case Study projects</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                  <Input placeholder="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                  <Input placeholder="Completed At (YYYY-MM-DD)" value={form.completedAt} onChange={(e) => setForm({ ...form, completedAt: e.target.value })} />
                  <Textarea className="sm:col-span-2" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Gallery URLs (comma separated)" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <Switch id="featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? 'Creating...' : 'Create Project'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmitEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                  <Input placeholder="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
                  <Input placeholder="Completed At (YYYY-MM-DD)" value={form.completedAt} onChange={(e) => setForm({ ...form, completedAt: e.target.value })} />
                  <Textarea className="sm:col-span-2" rows={4} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Gallery URLs (comma separated)" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} />
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
                <DialogTitle>Delete Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Are you sure you want to delete <span className="font-semibold">{current?.title}</span>? This action cannot be undone.
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                <Button type="button" onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>Manage your Case Study showcase</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-sm text-gray-500">Loading projects…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((project) => (
                  <TableRow key={project._id || project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>
                      {project.featured && <Badge className="bg-yellow-100 text-yellow-800"><Star className="h-3 w-3 mr-1" /> Featured</Badge>}
                    </TableCell>
                    <TableCell>{project.completedAt ? new Date(project.completedAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50" onClick={() => startEdit(project)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => startDelete(project)}>
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
