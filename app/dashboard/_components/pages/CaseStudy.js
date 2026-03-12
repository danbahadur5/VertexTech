import React, { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Plus, Edit, Trash2, Star, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';

export default function CaseStudyPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [current, setCurrent] = useState(null);
  const [originalSlug, setOriginalSlug] = useState('');
  const fileRefCreate = useRef(null);
  const fileRefEdit = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    client: '',
    description: '',
    technologies: '',
    gallery: '',
    liveUrl: '',
    status: 'in-progress',
    featured: false,
    completedAt: '',
    testimonialQuote: '',
    testimonialAuthor: '',
    testimonialPosition: '',
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
      liveUrl: '',
      status: 'in-progress',
      featured: false,
      completedAt: '',
      testimonialQuote: '',
      testimonialAuthor: '',
      testimonialPosition: '',
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
        liveUrl: form.liveUrl?.trim() || undefined,
        status: form.status || 'in-progress',
        featured: !!form.featured,
        completedAt: form.completedAt ? form.completedAt : undefined,
        testimonial: (form.testimonialQuote?.trim() || form.testimonialAuthor?.trim() || form.testimonialPosition?.trim())
          ? {
              quote: form.testimonialQuote?.trim() || undefined,
              author: form.testimonialAuthor?.trim() || undefined,
              position: form.testimonialPosition?.trim() || undefined,
            }
          : undefined,
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
      liveUrl: p.liveUrl || '',
      status: p.status || 'in-progress',
      featured: !!p.featured,
      completedAt: p.completedAt ? String(p.completedAt).slice(0, 10) : '',
      testimonialQuote: p.testimonial?.quote || '',
      testimonialAuthor: p.testimonial?.author || '',
      testimonialPosition: p.testimonial?.position || '',
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
        liveUrl: form.liveUrl?.trim() || undefined,
        status: form.status || 'in-progress',
        featured: !!form.featured,
        completedAt: form.completedAt ? form.completedAt : undefined,
        testimonial: (form.testimonialQuote?.trim() || form.testimonialAuthor?.trim() || form.testimonialPosition?.trim())
          ? {
              quote: form.testimonialQuote?.trim() || undefined,
              author: form.testimonialAuthor?.trim() || undefined,
              position: form.testimonialPosition?.trim() || undefined,
            }
          : undefined,
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Case Study Manager</h1>
            <p className="text-gray-600 mt-2 ">Manage your Case Study projects</p>
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
                  <div>
                    <Label className="mb-1 block">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 space-y-3">
                    <input
                      ref={fileRefCreate}
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        setUploading(true);
                        try {
                          for (const file of files) {
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
                            if (!res.ok) throw new Error('Upload failed');
                            const js = await res.json();
                            const url = js?.item?.url;
                            if (url) {
                              const arr = form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
                              arr.push(url);
                              setForm({ ...form, gallery: arr.join(', ') });
                            }
                          }
                          toast.success('Images uploaded');
                        } catch (err) {
                          toast.error(err.message || 'Upload failed');
                        } finally {
                          setUploading(false);
                          if (fileRefCreate.current) fileRefCreate.current.value = '';
                        }
                      }}
                    />
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800'}`}
                      onClick={() => fileRefCreate.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files || []);
                        if (!files.length) {
                          setDragActive(false);
                          return;
                        }
                        setUploading(true);
                        try {
                          for (const file of files) {
                            if (!file.type.startsWith('image/')) continue;
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
                            if (!res.ok) throw new Error('Upload failed');
                            const js = await res.json();
                            const url = js?.item?.url;
                            if (url) {
                              const arr = form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
                              arr.push(url);
                              setForm({ ...form, gallery: arr.join(', ') });
                            }
                          }
                          toast.success('Images uploaded');
                        } catch (err) {
                          toast.error(err.message || 'Upload failed');
                        } finally {
                          setUploading(false);
                          setDragActive(false);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm border">
                          <Upload className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {uploading ? 'Uploading…' : 'Click to upload or drag & drop'}
                        </div>
                        <div className="text-xs text-slate-500">PNG, JPG up to 5MB each</div>
                        <div>
                          <Button type="button" variant="outline" disabled={uploading}>
                            Browse files
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : []).map((url, idx) => (
                        <div key={idx} className="relative">
                          <img src={url} alt="Gallery" className="h-20 w-20 object-cover rounded-lg border" />
                          <Button
                            type="button"
                            variant="secondary"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => {
                              const filtered = (form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : []).filter(u => u !== url);
                              setForm({ ...form, gallery: filtered.join(', ') });
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Input className="sm:col-span-2" placeholder="Live URL (https://…)" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Testimonial Quote" value={form.testimonialQuote} onChange={(e) => setForm({ ...form, testimonialQuote: e.target.value })} />
                  <Input placeholder="Testimonial Author" value={form.testimonialAuthor} onChange={(e) => setForm({ ...form, testimonialAuthor: e.target.value })} />
                  <Input placeholder="Author Position" value={form.testimonialPosition} onChange={(e) => setForm({ ...form, testimonialPosition: e.target.value })} />
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
                  <div>
                    <Label className="mb-1 block">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <input ref={fileRefEdit} type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
                        if (!res.ok) throw new Error('Upload failed');
                        const js = await res.json();
                        const url = js?.item?.url;
                        if (url) {
                          const arr = form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
                          arr.push(url);
                          setForm({ ...form, gallery: arr.join(', ') });
                        }
                        toast.success('Image uploaded');
                      } catch (err) {
                        toast.error(err.message || 'Upload failed');
                      } finally {
                        setUploading(false);
                        if (fileRefEdit.current) fileRefEdit.current.value = '';
                      }
                    }} />
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" onClick={() => fileRefEdit.current?.click()} disabled={uploading}>
                        {uploading ? 'Uploading…' : 'Upload Image'}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : []).map((url, idx) => (
                        <div key={idx} className="relative">
                          <img src={url} alt="Gallery" className="h-16 w-16 object-cover rounded border" />
                          <Button
                            type="button"
                            variant="secondary"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => {
                              const filtered = (form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : []).filter(u => u !== url);
                              setForm({ ...form, gallery: filtered.join(', ') });
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Input className="sm:col-span-2" placeholder="Live URL (https://…)" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
                  <Input className="sm:col-span-2" placeholder="Testimonial Quote" value={form.testimonialQuote} onChange={(e) => setForm({ ...form, testimonialQuote: e.target.value })} />
                  <Input placeholder="Testimonial Author" value={form.testimonialAuthor} onChange={(e) => setForm({ ...form, testimonialAuthor: e.target.value })} />
                  <Input placeholder="Author Position" value={form.testimonialPosition} onChange={(e) => setForm({ ...form, testimonialPosition: e.target.value })} />
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
