'use client'
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Plus, Edit, Trash2, Cloud, Shield, Code, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { SEOFields } from '../SEOFields';

export default function ServicesPage() {

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
    description: '',
    tagline: '',
    icon: 'Code',
    basic: '',
    professional: '',
    enterprise: '',
    features: '',
    cap1Label: '',
    cap1Value: '',
    cap2Label: '',
    cap2Value: '',
    cap3Label: '',
    cap3Value: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '',
      canonicalUrl: '',
    }
  });

  const iconOptions = [
    { value: 'Cloud', label: 'Cloud', Icon: Cloud },
    { value: 'Shield', label: 'Security', Icon: Shield },
    { value: 'Code', label: 'Development', Icon: Code },
    { value: 'BarChart3', label: 'Analytics', Icon: BarChart3 },
  ];

  const load = async () => {
    try {
      const res = await fetch('/api/services', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setError('Unable to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      toast.error('Please fill Title, Slug and Description');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim().replace(/^\//, ''),
        description: form.description.trim(),
        tagline: form.tagline.trim() || undefined,
        icon: form.icon,
        features: form.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        capabilities: [
          { label: form.cap1Label.trim(), value: Number(form.cap1Value) },
          { label: form.cap2Label.trim(), value: Number(form.cap2Value) },
          { label: form.cap3Label.trim(), value: Number(form.cap3Value) },
        ].filter((c) => c.label && !Number.isNaN(c.value)),
        pricing: {
          basic: form.basic ? Number(form.basic) : undefined,
          professional: form.professional ? Number(form.professional) : undefined,
          enterprise: form.enterprise ? Number(form.enterprise) : undefined,
        },
        seo: {
          ...form.seo,
          keywords: typeof form.seo.keywords === 'string' 
            ? form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
            : form.seo.keywords
        }
      };

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create service');

      toast.success('Service created');

      setOpen(false);

      resetForm();

      setLoading(true);
      await load();

    } catch (err) {
      toast.error(err.message || 'Failed to create service');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      description: '',
      tagline: '',
      icon: 'Code',
      basic: '',
      professional: '',
      enterprise: '',
      features: '',
      cap1Label: '',
      cap1Value: '',
      cap2Label: '',
      cap2Value: '',
      cap3Label: '',
      cap3Value: '',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        ogImage: '',
        canonicalUrl: '',
      }
    });
    setCurrent(null);
    setOriginalSlug('');
    setSaving(false);
  };

  const handleNewServiceClick = () => {
    resetForm();
    setOpen(true);
  };

  const startEdit = (svc) => {
    setCurrent(svc);
    setOriginalSlug(svc.slug);
    setForm({
      title: svc.title || '',
      slug: svc.slug || '',
      description: svc.description || '',
      tagline: svc.tagline || '',
      icon: svc.icon || 'Code',
      basic: svc?.pricing?.basic?.toString?.() || '',
      professional: svc?.pricing?.professional?.toString?.() || '',
      enterprise: svc?.pricing?.enterprise?.toString?.() || '',
      features: Array.isArray(svc.features) ? svc.features.join(', ') : '',
      cap1Label: svc?.capabilities?.[0]?.label || '',
      cap1Value: svc?.capabilities?.[0]?.value?.toString?.() || '',
      cap2Label: svc?.capabilities?.[1]?.label || '',
      cap2Value: svc?.capabilities?.[1]?.value?.toString?.() || '',
      cap3Label: svc?.capabilities?.[2]?.label || '',
      cap3Value: svc?.capabilities?.[2]?.value?.toString?.() || '',
      seo: {
        metaTitle: svc.seo?.metaTitle || '',
        metaDescription: svc.seo?.metaDescription || '',
        keywords: Array.isArray(svc.seo?.keywords) ? svc.seo.keywords.join(', ') : svc.seo?.keywords || '',
        ogImage: svc.seo?.ogImage || '',
        canonicalUrl: svc.seo?.canonicalUrl || '',
      }
    });
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      toast.error('Please fill Title, Slug and Description');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        tagline: form.tagline.trim() || undefined,
        icon: form.icon,
        features: form.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
        capabilities: [
          { label: form.cap1Label.trim(), value: Number(form.cap1Value) },
          { label: form.cap2Label.trim(), value: Number(form.cap2Value) },
          { label: form.cap3Label.trim(), value: Number(form.cap3Value) },
        ].filter((c) => c.label && !Number.isNaN(c.value)),
        pricing: {
          basic: form.basic ? Number(form.basic) : undefined,
          professional: form.professional ? Number(form.professional) : undefined,
          enterprise: form.enterprise ? Number(form.enterprise) : undefined,
        },
        seo: {
          ...form.seo,
          keywords: typeof form.seo.keywords === 'string' 
            ? form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
            : form.seo.keywords
        }
      };
      const newSlug = form.slug.trim().replace(/^\//, '');
      if (newSlug && newSlug !== originalSlug) {
        payload.slug = newSlug;
      }
      const res = await fetch(`/api/services/${encodeURIComponent(originalSlug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update service');
      toast.success('Service updated');
      setEditOpen(false);
      setCurrent(null);
      setLoading(true);
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed to update service');
    } finally {
      setSaving(false);
    }
  };

  const startDelete = (svc) => {
    setCurrent(svc);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!current) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services/${encodeURIComponent(current.slug)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      toast.success('Service deleted');
      setDeleteOpen(false);
      setItems((prev) => prev.filter((s) => s.slug !== current.slug));
      setCurrent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="space-y-8 overflow-y-auto max-h-[70vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Services Manager</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">Create and manage your service offerings</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNewServiceClick}>
                <Plus className="h-4 w-4 mr-2" />
                New Service
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
              </DialogHeader>

              <form onSubmit={onSubmit} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Cloud Solutions"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="cloud-solutions"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short description"
                    />
                  </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Tagline (short)</Label>
                  <Input
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Short tagline"
                  />
                </div>

                  <div className="space-y-2">

                    <Label>Icon</Label>

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">

                        {(() => {
                          const Current = (iconOptions.find(o => o.value === form.icon)?.Icon) || Code;
                          return <Current className="w-5 h-5 text-white" />;
                        })()}

                      </div>

                      <Select
                        value={form.icon}
                        onValueChange={(v) => setForm({ ...form, icon: v })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>

                        <SelectContent>
                          {iconOptions.map(({ value, label, Icon }) => (
                            <SelectItem key={value} value={value}>
                              <span className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Key Features (comma separated)</Label>
                    <Input
                      value={form.features}
                      onChange={(e) => setForm({ ...form, features: e.target.value })}
                      placeholder="Feature A, Feature B"
                    />
                  </div>
                <div className="sm:col-span-2">
                  <Label className="mb-2 block">Capabilities (label and %)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Input placeholder="Label 1" value={form.cap1Label} onChange={(e) => setForm({ ...form, cap1Label: e.target.value })} />
                      <Input type="number" placeholder="Value %" value={form.cap1Value} onChange={(e) => setForm({ ...form, cap1Value: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Label 2" value={form.cap2Label} onChange={(e) => setForm({ ...form, cap2Label: e.target.value })} />
                      <Input type="number" placeholder="Value %" value={form.cap2Value} onChange={(e) => setForm({ ...form, cap2Value: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Label 3" value={form.cap3Label} onChange={(e) => setForm({ ...form, cap3Label: e.target.value })} />
                      <Input type="number" placeholder="Value %" value={form.cap3Value} onChange={(e) => setForm({ ...form, cap3Value: e.target.value })} />
                    </div>
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label>Basic Price</Label>
                    <Input
                      type="number"
                      value={form.basic}
                      onChange={(e) => setForm({ ...form, basic: e.target.value })}
                      placeholder="999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pro Price</Label>
                    <Input
                      type="number"
                      value={form.professional}
                      onChange={(e) => setForm({ ...form, professional: e.target.value })}
                      placeholder="2499"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Enterprise Price</Label>
                    <Input
                      type="number"
                      value={form.enterprise}
                      onChange={(e) => setForm({ ...form, enterprise: e.target.value })}
                      placeholder="5999"
                    />
                  </div>

                </div>
                <SEOFields data={form.seo} onChange={(seo) => setForm({ ...form, seo })} />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {saving ? 'Creating...' : 'Create Service'}
                  </Button>
                </DialogFooter>

              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Service */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmitEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Cloud Solutions"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="cloud-solutions"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Short description"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Tagline (short)</Label>
                    <Input
                      value={form.tagline}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                      placeholder="Short tagline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                        {(() => {
                          const Current = (iconOptions.find(o => o.value === form.icon)?.Icon) || Code;
                          return <Current className="w-5 h-5 text-white" />;
                        })()}
                      </div>
                      <Select
                        value={form.icon}
                        onValueChange={(v) => setForm({ ...form, icon: v })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(({ value, label, Icon }) => (
                            <SelectItem key={value} value={value}>
                              <span className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Features (comma separated)</Label>
                    <Input
                      value={form.features}
                      onChange={(e) => setForm({ ...form, features: e.target.value })}
                      placeholder="Feature A, Feature B"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="mb-2 block">Capabilities (label and %)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Input placeholder="Label 1" value={form.cap1Label} onChange={(e) => setForm({ ...form, cap1Label: e.target.value })} />
                        <Input type="number" placeholder="Value %" value={form.cap1Value} onChange={(e) => setForm({ ...form, cap1Value: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Input placeholder="Label 2" value={form.cap2Label} onChange={(e) => setForm({ ...form, cap2Label: e.target.value })} />
                        <Input type="number" placeholder="Value %" value={form.cap2Value} onChange={(e) => setForm({ ...form, cap2Value: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Input placeholder="Label 3" value={form.cap3Label} onChange={(e) => setForm({ ...form, cap3Label: e.target.value })} />
                        <Input type="number" placeholder="Value %" value={form.cap3Value} onChange={(e) => setForm({ ...form, cap3Value: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Basic Price</Label>
                    <Input
                      type="number"
                      value={form.basic}
                      onChange={(e) => setForm({ ...form, basic: e.target.value })}
                      placeholder="999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pro Price</Label>
                    <Input
                      type="number"
                      value={form.professional}
                      onChange={(e) => setForm({ ...form, professional: e.target.value })}
                      placeholder="2499"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Enterprise Price</Label>
                    <Input
                      type="number"
                      value={form.enterprise}
                      onChange={(e) => setForm({ ...form, enterprise: e.target.value })}
                      placeholder="5999"
                    />
                  </div>
                </div>
                <SEOFields data={form.seo} onChange={(seo) => setForm({ ...form, seo })} />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirm */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle>Delete Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Are you sure you want to delete <span className="font-semibold">{current?.title}</span>? This action cannot be undone.
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-gray-900">

          <CardHeader>
            <CardTitle>All Services</CardTitle>
            <CardDescription>Manage your services and pricing</CardDescription>
          </CardHeader>

          <CardContent className="text-gray-900 dark:text-gray-100 overflow-y-auto max-h-[60vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            {loading && <div className="text-sm text-slate-500">Loading services...</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && (

              <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <Table>

                <TableHeader className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <TableRow>
                    <TableHead className="dark:text-slate-100">Title</TableHead>
                    <TableHead className="dark:text-slate-100">Slug</TableHead>
                    <TableHead className="dark:text-slate-100">Basic</TableHead>
                    <TableHead className="dark:text-slate-100">Pro</TableHead>
                    <TableHead className="dark:text-slate-100">Enterprise</TableHead>
                    <TableHead className="text-right dark:text-slate-100">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {items.map((svc) => (

                    <TableRow key={svc._id || svc.id || svc.slug}>

                      <TableCell className="font-medium">
                        {svc.title}
                      </TableCell>

                      <TableCell className="font-mono text-sm">
                        {svc.slug}
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                          Rs.{svc?.pricing?.basic ?? '-'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                          Rs.{svc?.pricing?.professional ?? '-'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                          Rs.{svc?.pricing?.enterprise ?? '-'}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            onClick={() => startEdit(svc)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-50 dark:hover:bg-red-900/30"
                            onClick={() => startDelete(svc)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>

                        </div>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>
              </div>

            )}

          </CardContent>

        </Card>

      </div>

    </DashboardLayout>
  );
}
