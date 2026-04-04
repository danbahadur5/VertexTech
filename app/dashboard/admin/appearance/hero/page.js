'use client'
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner';
import { Badge } from '../../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { Switch } from '../../../../components/ui/switch';
import { Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import IconServiceSelect from '../../../../components/form/IconServiceSelect';

export default function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({
    badge: '',
    titleLeading: '',
    titleGradient: '',
    subtitle: '',
    heroImage: '',
    lightGradientFrom: '#2563eb',
    lightGradientTo: '#7c3aed',
    darkGradientFrom: '#1d4ed8',
    darkGradientTo: '#6d28d9',
    primaryCTALabel: '',
    primaryCTAHref: '',
    secondaryCTALabel: '',
    secondaryCTAHref: '',
    features: '',
    avatars: '',
    ratingScore: '',
    ratingCaption: '',
    services: '',
    active: false,
  });
  const fileInputRef = useRef(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceIconUrl, setServiceIconUrl] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/settings/hero-groups', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load hero groups');
      const data = await res.json();
      const items = Array.isArray(data?.item?.data?.items) ? data.item.data.items : [];
      setItems(items);
    } catch (err) {
      setError('Unable to fetch hero groups');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      badge: '',
      titleLeading: '',
      titleGradient: '',
      subtitle: '',
      heroImage: '',
      lightGradientFrom: '#2563eb',
      lightGradientTo: '#7c3aed',
      darkGradientFrom: '#1d4ed8',
      darkGradientTo: '#6d28d9',
      primaryCTALabel: '',
      primaryCTAHref: '',
      secondaryCTALabel: '',
      secondaryCTAHref: '',
      features: '',
      avatars: '',
      ratingScore: '',
      ratingCaption: '',
      services: '',
      active: false,
    });
    setCurrent(null);
  };

  const handleNew = () => {
    resetForm();
    setOpen(true);
  };

  const persist = async (nextItems) => {
    const res = await fetch('/api/settings/hero-groups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: nextItems }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const next = {
        id,
        badge: form.badge,
        titleLeading: form.titleLeading,
        titleGradient: form.titleGradient,
        subtitle: form.subtitle,
        heroImage: form.heroImage || undefined,
        theme: {
          light: { gradientFrom: form.lightGradientFrom, gradientTo: form.lightGradientTo },
          dark: { gradientFrom: form.darkGradientFrom, gradientTo: form.darkGradientTo },
        },
        primaryCTA: { label: form.primaryCTALabel, href: form.primaryCTAHref },
        secondaryCTA: { label: form.secondaryCTALabel, href: form.secondaryCTAHref },
        features: form.features.split(',').map((t) => ({ label: t.trim() })).filter((x) => x.label),
        avatars: form.avatars
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
        rating: {
          score: Number.isFinite(parseFloat(form.ratingScore)) ? parseFloat(form.ratingScore) : undefined,
          caption: form.ratingCaption || undefined,
        },
        services: form.services
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const [name, icon] = l.split('|');
            return { name: (name || '').trim(), icon: (icon || '').trim() };
          })
          .filter((s) => s.name),
        active: !!form.active,
      };
      let nextItems = [...items, next];
      if (next.active) {
        nextItems = nextItems.map((g) => (g.id === id ? { ...g, active: true } : { ...g, active: false }));
      }
      await persist(nextItems);
      setItems(nextItems);
      setOpen(false);
      toast.success('Hero group created');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (g) => {
    setCurrent(g);
    setForm({
      badge: g.badge || '',
      titleLeading: g.titleLeading || '',
      titleGradient: g.titleGradient || '',
      subtitle: g.subtitle || '',
      heroImage: g.heroImage || '',
      lightGradientFrom: g?.theme?.light?.gradientFrom || '#2563eb',
      lightGradientTo: g?.theme?.light?.gradientTo || '#7c3aed',
      darkGradientFrom: g?.theme?.dark?.gradientFrom || '#1d4ed8',
      darkGradientTo: g?.theme?.dark?.gradientTo || '#6d28d9',
      primaryCTALabel: g?.primaryCTA?.label || '',
      primaryCTAHref: g?.primaryCTA?.href || '',
      secondaryCTALabel: g?.secondaryCTA?.label || '',
      secondaryCTAHref: g?.secondaryCTA?.href || '',
      features: Array.isArray(g.features) ? g.features.map((f) => f.label || f).join(', ') : '',
      avatars: Array.isArray(g.avatars) ? g.avatars.join('\n') : '',
      ratingScore: g?.rating?.score != null ? String(g.rating.score) : '',
      ratingCaption: g?.rating?.caption || '',
      services: Array.isArray(g.services)
        ? g.services.map((s) => `${s.name} | ${s.icon || ''}`).join('\n')
        : '',
      active: !!g.active,
    });
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = {
        ...current,
        badge: form.badge,
        titleLeading: form.titleLeading,
        titleGradient: form.titleGradient,
        subtitle: form.subtitle,
        heroImage: form.heroImage || undefined,
        theme: {
          light: { gradientFrom: form.lightGradientFrom, gradientTo: form.lightGradientTo },
          dark: { gradientFrom: form.darkGradientFrom, gradientTo: form.darkGradientTo },
        },
        primaryCTA: { label: form.primaryCTALabel, href: form.primaryCTAHref },
        secondaryCTA: { label: form.secondaryCTALabel, href: form.secondaryCTAHref },
        features: form.features.split(',').map((t) => ({ label: t.trim() })).filter((x) => x.label),
        avatars: form.avatars
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
        rating: {
          score: Number.isFinite(parseFloat(form.ratingScore)) ? parseFloat(form.ratingScore) : undefined,
          caption: form.ratingCaption || undefined,
        },
        services: form.services
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const [name, icon] = l.split('|');
            return { name: (name || '').trim(), icon: (icon || '').trim() };
          })
          .filter((s) => s.name),
        active: !!form.active,
      };
      let nextItems = items.map((g) => (g.id === current.id ? updated : g));
      if (updated.active) {
        nextItems = nextItems.map((g) => (g.id === updated.id ? { ...g, active: true } : { ...g, active: false }));
      }
      await persist(nextItems);
      setItems(nextItems);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Hero group updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const startDelete = (g) => {
    setCurrent(g);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!current) return;
    setDeleting(true);
    try {
      const nextItems = items.filter((g) => g.id !== current.id);
      await persist(nextItems);
      setItems(nextItems);
      toast.success('Hero group deleted');
      setDeleteOpen(false);
      setCurrent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const setActive = async (g) => {
    try {
      const nextItems = items.map((it) => (it.id === g.id ? { ...it, active: true } : { ...it, active: false }));
      await persist(nextItems);
      setItems(nextItems);
      toast.success('Active hero updated');
    } catch (err) {
      toast.error(err.message || 'Failed to activate');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Hero Groups</h1>
            <p className="text-gray-600 mt-2">Manage multiple hero variants. Only one can be active.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Hero Group
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-black dark:text-slate-100 text-gray-900 rounded-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Hero Group</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Leading</Label>
                    <Input value={form.titleLeading} onChange={(e) => setForm({ ...form, titleLeading: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Gradient</Label>
                    <Input value={form.titleGradient} onChange={(e) => setForm({ ...form, titleGradient: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Subtitle</Label>
                    <Textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Hero Image URL</Label>
                    <Input placeholder="https://…" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSaving(true);
                      try {
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
                        if (!res.ok) throw new Error('Upload failed');
                        const js = await res.json();
                        const url = js?.item?.url;
                        if (url) setForm((f) => ({ ...f, heroImage: url }));
                        toast.success('Image uploaded');
                      } catch (err) {
                        toast.error(err.message || 'Upload failed');
                      } finally {
                        setSaving(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }
                    }} />
                    <Button type="button"  variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Upload Image
                    </Button>
                    {form.heroImage && <img src={form.heroImage} alt="Hero" className="h-10 w-10 rounded object-cover border" />}
                  </div>
                  
                 
                
                  <div className="space-y-2">
                    <Label>Primary CTA Label</Label>
                    <Input value={form.primaryCTALabel} onChange={(e) => setForm({ ...form, primaryCTALabel: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary CTA Href</Label>
                    <Input value={form.primaryCTAHref} onChange={(e) => setForm({ ...form, primaryCTAHref: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA Label</Label>
                    <Input value={form.secondaryCTALabel} onChange={(e) => setForm({ ...form, secondaryCTALabel: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA Href</Label>
                    <Input value={form.secondaryCTAHref} onChange={(e) => setForm({ ...form, secondaryCTAHref: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Features (comma separated)</Label>
                    <Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Client Avatars (one URL per line)</Label>
                    <Textarea rows={4} value={form.avatars} onChange={(e) => setForm({ ...form, avatars: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating Score (0–5)</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={form.ratingScore} onChange={(e) => setForm({ ...form, ratingScore: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating Caption</Label>
                    <Input value={form.ratingCaption} onChange={(e) => setForm({ ...form, ratingCaption: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Add Service (Name + Icon URL)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        placeholder="Service name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                      />
                      <Input
                        placeholder="Icon URL (or key)"
                        value={serviceIconUrl}
                        onChange={(e) => setServiceIconUrl(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const name = serviceName.trim();
                          const icon = serviceIconUrl.trim();
                          if (!name || !icon) {
                            toast.error('Enter service name and icon URL/key');
                            return;
                          }
                          const line = `${name} | ${icon}`;
                          const lines = (form.services || '').split('\n').map((l) => l.trim()).filter(Boolean);
                          if (!lines.includes(line)) {
                            const next = [...lines, line].join('\n');
                            setForm((f) => ({ ...f, services: next }));
                            setServiceName('');
                            setServiceIconUrl('');
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {(form.services || '')
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .map((l, idx) => {
                          const [n, k] = l.split('|');
                          const name = (n || '').trim();
                          const icon = (k || '').trim();
                          return (
                            <div key={idx} className="flex items-center justify-between rounded-md border p-2">
                              <div className="text-sm text-gray-800">
                                <span className="font-medium">{name}</span>
                                <span className="text-gray-500"> — {icon}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  const lines = (form.services || '')
                                    .split('\n')
                                    .map((x) => x.trim())
                                    .filter(Boolean);
                                  const next = lines.filter((x) => x !== l).join('\n');
                                  setForm((f) => ({ ...f, services: next }));
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                    <Label htmlFor="active">Set as Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? 'Creating…' : 'Create'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-white text-gray-900 rounded-xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Hero Group</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmitEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Badge</Label>
                    <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title Leading</Label>
                    <Input value={form.titleLeading} onChange={(e) => setForm({ ...form, titleLeading: e.target.value })} />
                  </div>
                
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Subtitle</Label>
                    <Textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Hero Image URL</Label>
                    <Input placeholder="https://…" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSaving(true);
                      try {
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
                        if (!res.ok) throw new Error('Upload failed');
                        const js = await res.json();
                        const url = js?.item?.url;
                        if (url) setForm((f) => ({ ...f, heroImage: url }));
                        toast.success('Image uploaded');
                      } catch (err) {
                        toast.error(err.message || 'Upload failed');
                      } finally {
                        setSaving(false);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }
                    }} />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Upload Image
                    </Button>
                    {form.heroImage && <img src={form.heroImage} alt="Hero" className="h-10 w-10 rounded object-cover border" />}
                  </div>
                  <div className="space-y-2">
                    <Label>Light Gradient From</Label>
                    <Input type="color" value={form.lightGradientFrom} onChange={(e) => setForm({ ...form, lightGradientFrom: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Light Gradient To</Label>
                    <Input type="color" value={form.lightGradientTo} onChange={(e) => setForm({ ...form, lightGradientTo: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Dark Gradient From</Label>
                    <Input type="color" value={form.darkGradientFrom} onChange={(e) => setForm({ ...form, darkGradientFrom: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Dark Gradient To</Label>
                    <Input type="color" value={form.darkGradientTo} onChange={(e) => setForm({ ...form, darkGradientTo: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary CTA Label</Label>
                    <Input value={form.primaryCTALabel} onChange={(e) => setForm({ ...form, primaryCTALabel: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary CTA Href</Label>
                    <Input value={form.primaryCTAHref} onChange={(e) => setForm({ ...form, primaryCTAHref: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA Label</Label>
                    <Input value={form.secondaryCTALabel} onChange={(e) => setForm({ ...form, secondaryCTALabel: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary CTA Href</Label>
                    <Input value={form.secondaryCTAHref} onChange={(e) => setForm({ ...form, secondaryCTAHref: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Client Avatars (one URL per line)</Label>
                    <Textarea rows={4} value={form.avatars} onChange={(e) => setForm({ ...form, avatars: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating Score (0–5)</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={form.ratingScore} onChange={(e) => setForm({ ...form, ratingScore: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating Caption</Label>
                    <Input value={form.ratingCaption} onChange={(e) => setForm({ ...form, ratingCaption: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Service Ring (one per line: Name | IconKey)</Label>
                    <Textarea rows={4} placeholder="Cyber Security | shield" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Service Ring (picker)</Label>
                    <IconServiceSelect
                      name="services-picker-edit"
                      label={null}
                      multi
                      options={[
                        { value: 'Cyber Security|shield', label: 'Cyber Security', icon: 'shield' },
                        { value: 'Web Development|globe', label: 'Web Development', icon: 'globe' },
                        { value: 'Data Analysis|chart', label: 'Data Analysis', icon: 'chart' },
                        { value: 'App Development|app', label: 'App Development', icon: 'app' },
                        { value: 'AI Agent Build|ai', label: 'AI Agent Build', icon: 'ai' },
                        { value: 'Graphics Design|design', label: 'Graphics Design', icon: 'design' },
                      ]}
                      value={form.services
                        ? form.services.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
                            const [n, k] = l.split('|'); return `${(n || '').trim()}|${(k || '').trim()}`
                          })
                        : []}
                      onChange={(arr) => {
                        const vals = Array.isArray(arr) ? arr : [arr];
                        const lines = vals
                          .map((v) => {
                            const [n, k] = v.split('|');
                            return `${(n || '').trim()} | ${(k || '').trim()}`;
                          })
                          .join('\n');
                        setForm((f) => ({ ...f, services: lines }));
                      }}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Add Service (Name + Icon URL)</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        placeholder="Service name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                      />
                      <Input
                        placeholder="Icon URL (or key)"
                        value={serviceIconUrl}
                        onChange={(e) => setServiceIconUrl(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const name = serviceName.trim();
                          const icon = serviceIconUrl.trim();
                          if (!name || !icon) {
                            toast.error('Enter service name and icon URL/key');
                            return;
                          }
                          const line = `${name} | ${icon}`;
                          const lines = (form.services || '').split('\n').map((l) => l.trim()).filter(Boolean);
                          if (!lines.includes(line)) {
                            const next = [...lines, line].join('\n');
                            setForm((f) => ({ ...f, services: next }));
                            setServiceName('');
                            setServiceIconUrl('');
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {(form.services || '')
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                        .map((l, idx) => {
                          const [n, k] = l.split('|');
                          const name = (n || '').trim();
                          const icon = (k || '').trim();
                          return (
                            <div key={idx} className="flex items-center justify-between rounded-md border p-2">
                              <div className="text-sm text-gray-800">
                                <span className="font-medium">{name}</span>
                                <span className="text-gray-500"> — {icon}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  const lines = (form.services || '')
                                    .split('\n')
                                    .map((x) => x.trim())
                                    .filter(Boolean);
                                  const next = lines.filter((x) => x !== l).join('\n');
                                  setForm((f) => ({ ...f, services: next }));
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="active-edit" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                    <Label htmlFor="active-edit">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
              <DialogHeader>
                <DialogTitle>Delete Hero Group</DialogTitle>
              </DialogHeader>
              <div className="text-sm text-gray-600">Are you sure you want to delete <span className="font-semibold">{current?.titleLeading || '(Untitled)'}</span>?</div>
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
            <CardTitle>All Hero Groups</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-sm text-gray-500">Loading…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{(g.titleLeading || '') + ' ' + (g.titleGradient || '')}</TableCell>
                    <TableCell>{g.badge || '-'}</TableCell>
                    <TableCell>
                      {g.active ? (
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!g.active && (
                          <Button variant="outline" size="sm" onClick={() => setActive(g)}>Set Active</Button>
                        )}
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50" onClick={() => startEdit(g)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => startDelete(g)}>
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
