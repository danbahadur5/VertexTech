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
import { Plus, Edit, Trash2, CheckCircle2, History, Crop } from 'lucide-react';
import IconServiceSelect from '../../../../components/form/IconServiceSelect';
import { ImageCropper } from '../../../../components/dashboard/ImageCropper';
import { HeroPreview } from '../../../../components/dashboard/HeroPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';

export default function Page() {
  const [items, setItems] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [current, setCurrent] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [form, setForm] = useState({
    badge: '',
    titleLeading: '',
    titleGradient: '',
    subtitle: '',
    heroImage: '',
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
    animation: {
      type: 'fade-up',
      duration: 0.8,
      delay: 0.2
    },
    typography: {
      headingFont: 'font-sans',
      bodyFont: 'font-sans'
    }
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
      setRevisions(data?.item?.revisions || []);
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
      animation: { type: 'fade-up', duration: 0.8, delay: 0.2 },
      typography: { headingFont: 'font-sans', bodyFont: 'font-sans' }
    });
    setCurrent(null);
  };

  const handleNew = () => {
    resetForm();
    setOpen(true);
  };

  const persist = async (nextItems, comment = 'Updated hero settings') => {
    const res = await fetch('/api/settings/hero-groups', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { items: nextItems }, comment }),
    });
    if (!res.ok) throw new Error('Failed to save');
    const data = await res.json();
    setRevisions(data?.item?.revisions || []);
  };

  const onRevert = async (revisionId) => {
    if (!confirm('Are you sure you want to revert to this version?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings/hero-groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revertToRevisionId: revisionId }),
      });
      if (!res.ok) throw new Error('Revert failed');
      const data = await res.json();
      const items = Array.isArray(data?.item?.data?.items) ? data.item.data.items : [];
      setItems(items);
      setRevisions(data?.item?.revisions || []);
      toast.success('Reverted successfully');
      setHistoryOpen(false);
    } catch (err) {
      toast.error(err.message || 'Revert failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
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
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (form.animation.duration < 0.1 || form.animation.duration > 10) {
      toast.error('Animation duration must be between 0.1 and 10 seconds');
      return;
    }
    if (form.animation.delay < 0 || form.animation.delay > 10) {
      toast.error('Animation delay must be between 0 and 10 seconds');
      return;
    }

    setSaving(true);
    try {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const next = {
        id,
        ...form,
        primaryCTA: { label: form.primaryCTALabel, href: form.primaryCTAHref },
        secondaryCTA: { label: form.secondaryCTALabel, href: form.secondaryCTAHref },
        features: form.features.split(',').map((t) => ({ label: t.trim() })).filter((x) => x.label),
        avatars: form.avatars.split('\n').map((l) => l.trim()).filter(Boolean),
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
      };
      let nextItems = [...items, next];
      if (next.active) {
        nextItems = nextItems.map((g) => (g.id === id ? { ...g, active: true } : { ...g, active: false }));
      }
      await persist(nextItems, `Created hero group: ${next.titleLeading}`);
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
      animation: g.animation || { type: 'fade-up', duration: 0.8, delay: 0.2 },
      typography: g.typography || { headingFont: 'font-sans', bodyFont: 'font-sans' }
    });
    setEditOpen(true);
  };

  const onSubmitEdit = async (e) => {
    e.preventDefault();
    if (!current) return;

    // Validation
    if (form.animation.duration < 0.1 || form.animation.duration > 10) {
      toast.error('Animation duration must be between 0.1 and 10 seconds');
      return;
    }
    if (form.animation.delay < 0 || form.animation.delay > 10) {
      toast.error('Animation delay must be between 0 and 10 seconds');
      return;
    }

    setSaving(true);
    try {
      const updated = {
        ...current,
        ...form,
        primaryCTA: { label: form.primaryCTALabel, href: form.primaryCTAHref },
        secondaryCTA: { label: form.secondaryCTALabel, href: form.secondaryCTAHref },
        features: form.features.split(',').map((t) => ({ label: t.trim() })).filter((x) => x.label),
        avatars: form.avatars.split('\n').map((l) => l.trim()).filter(Boolean),
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
      };
      let nextItems = items.map((g) => (g.id === current.id ? updated : g));
      if (updated.active) {
        nextItems = nextItems.map((g) => (g.id === updated.id ? { ...g, active: true } : { ...g, active: false }));
      }
      await persist(nextItems, `Updated hero group: ${updated.titleLeading}`);
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setHistoryOpen(true)}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Hero Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl bg-white dark:bg-black dark:text-slate-100 text-gray-900 rounded-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Hero Group</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Configuration</TabsTrigger>
                    <TabsTrigger value="preview">Live Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <form onSubmit={onSubmit} className="space-y-6 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Content</h3>
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
                          <div className="space-y-2">
                            <Label>Subtitle</Label>
                            <Textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Visuals & Media</h3>
                          <div className="space-y-2">
                            <Label>Hero Image</Label>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2">
                                <Input placeholder="https://…" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
                                <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setCropImage(reader.result);
                                    setIsCropping(true);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }} />
                              {form.heroImage && (
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                  <img src={form.heroImage} alt="Hero" className="w-full h-full object-cover" />
                                  <Button 
                                    type="button" 
                                    size="sm" 
                                    variant="secondary" 
                                    className="absolute bottom-2 right-2"
                                    onClick={() => {
                                      setCropImage(form.heroImage);
                                      setIsCropping(true);
                                    }}
                                  >
                                    <Crop className="h-4 w-4 mr-2" />
                                    Recrop
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Animation & Style</h3>
                          <div className="space-y-2">
                            <Label>Heading Font</Label>
                            <select 
                              className="w-full border rounded-md p-2 bg-transparent"
                              value={form.typography.headingFont}
                              onChange={(e) => setForm({ ...form, typography: { ...form.typography, headingFont: e.target.value }})}
                            >
                              <option value="font-sans">Geist (Sans)</option>
                              <option value="font-serif">Serif</option>
                              <option value="font-mono">Mono</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label>Effect Type</Label>
                            <select 
                              className="w-full border rounded-md p-2 bg-transparent"
                              value={form.animation.type}
                              onChange={(e) => setForm({ ...form, animation: { ...form.animation, type: e.target.value }})}
                            >
                              <option value="fade-up">Fade Up</option>
                              <option value="fade-in">Fade In</option>
                              <option value="zoom-in">Zoom In</option>
                              <option value="slide-left">Slide Left</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Duration (s)</Label>
                              <Input type="number" step="0.1" min="0.1" max="10" required value={form.animation.duration} onChange={(e) => setForm({ ...form, animation: { ...form.animation, duration: parseFloat(e.target.value) || 0.8 }})} />
                            </div>
                            <div className="space-y-2">
                              <Label>Delay (s)</Label>
                              <Input type="number" step="0.1" min="0" max="10" required value={form.animation.delay} onChange={(e) => setForm({ ...form, animation: { ...form.animation, delay: parseFloat(e.target.value) || 0 }})} />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2 space-y-4">
                          <h3 className="font-semibold text-lg border-b pb-2">Call to Action</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Primary Label</Label>
                              <Input value={form.primaryCTALabel} onChange={(e) => setForm({ ...form, primaryCTALabel: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Primary Link</Label>
                              <Input value={form.primaryCTAHref} onChange={(e) => setForm({ ...form, primaryCTAHref: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Secondary Label</Label>
                              <Input value={form.secondaryCTALabel} onChange={(e) => setForm({ ...form, secondaryCTALabel: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Secondary Link</Label>
                              <Input value={form.secondaryCTAHref} onChange={(e) => setForm({ ...form, secondaryCTAHref: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Switch id="active-new" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                        <Label htmlFor="active-new">Set as Active</Label>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                          {saving ? 'Creating…' : 'Create'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </TabsContent>
                  <TabsContent value="preview" className="pt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Light Mode Preview</h3>
                      </div>
                      <HeroPreview data={form} isDark={false} />
                      <div className="flex justify-between items-center pt-4">
                        <h3 className="font-semibold">Dark Mode Preview</h3>
                      </div>
                      <HeroPreview data={form} isDark={true} />
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* History Dialog */}
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Revision History</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {revisions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No revision history found.</p>
              ) : (
                revisions.map((rev, idx) => (
                  <div key={rev._id} className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{rev.comment || 'No comment'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(rev.updatedAt).toLocaleString()} • {rev.updatedBy || 'System'}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onRevert(rev._id)}
                      disabled={saving}
                    >
                      Revert
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Crop Dialog */}
        {isCropping && (
          <ImageCropper 
            image={cropImage} 
            onCancel={() => setIsCropping(false)}
            onCropComplete={async (blob) => {
              setIsCropping(false);
              const file = new File([blob], 'hero-cropped.jpg', { type: 'image/jpeg' });
              await handleImageUpload(file);
            }}
          />
        )}

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-4xl bg-white dark:bg-black dark:text-slate-100 text-gray-900 rounded-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Hero Group</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Configuration</TabsTrigger>
                  <TabsTrigger value="preview">Live Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <form onSubmit={onSubmitEdit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Content</h3>
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
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <Textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Visuals & Media</h3>
                        <div className="space-y-2">
                          <Label>Hero Image</Label>
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <Input placeholder="https://…" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
                              <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setCropImage(reader.result);
                                  setIsCropping(true);
                                };
                                reader.readAsDataURL(file);
                              }
                            }} />
                            {form.heroImage && (
                              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                <img src={form.heroImage} alt="Hero" className="w-full h-full object-cover" />
                                <Button 
                                  type="button" 
                                  size="sm" 
                                  variant="secondary" 
                                  className="absolute bottom-2 right-2"
                                  onClick={() => {
                                    setCropImage(form.heroImage);
                                    setIsCropping(true);
                                  }}
                                >
                                  <Crop className="h-4 w-4 mr-2" />
                                  Recrop
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Animation & Style</h3>
                        <div className="space-y-2">
                          <Label>Heading Font</Label>
                          <select 
                            className="w-full border rounded-md p-2 bg-transparent"
                            value={form.typography.headingFont}
                            onChange={(e) => setForm({ ...form, typography: { ...form.typography, headingFont: e.target.value }})}
                          >
                            <option value="font-sans">Geist (Sans)</option>
                            <option value="font-serif">Serif</option>
                            <option value="font-mono">Mono</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Effect Type</Label>
                          <select 
                            className="w-full border rounded-md p-2 bg-transparent"
                            value={form.animation.type}
                            onChange={(e) => setForm({ ...form, animation: { ...form.animation, type: e.target.value }})}
                          >
                            <option value="fade-up">Fade Up</option>
                            <option value="fade-in">Fade In</option>
                            <option value="zoom-in">Zoom In</option>
                            <option value="slide-left">Slide Left</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Duration (s)</Label>
                            <Input type="number" step="0.1" min="0.1" max="10" required value={form.animation.duration} onChange={(e) => setForm({ ...form, animation: { ...form.animation, duration: parseFloat(e.target.value) || 0.8 }})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Delay (s)</Label>
                            <Input type="number" step="0.1" min="0" max="10" required value={form.animation.delay} onChange={(e) => setForm({ ...form, animation: { ...form.animation, delay: parseFloat(e.target.value) || 0 }})} />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Call to Action</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Primary Label</Label>
                            <Input value={form.primaryCTALabel} onChange={(e) => setForm({ ...form, primaryCTALabel: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Primary Link</Label>
                            <Input value={form.primaryCTAHref} onChange={(e) => setForm({ ...form, primaryCTAHref: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Secondary Label</Label>
                            <Input value={form.secondaryCTALabel} onChange={(e) => setForm({ ...form, secondaryCTALabel: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Secondary Link</Label>
                            <Input value={form.secondaryCTAHref} onChange={(e) => setForm({ ...form, secondaryCTAHref: e.target.value })} />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Features & Services</h3>
                        <div className="space-y-2">
                          <Label>Features (comma separated)</Label>
                          <Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
                        </div>
                        <div className="space-y-2">
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
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(form.services || '')
                              .split('\n')
                              .map((l) => l.trim())
                              .filter(Boolean)
                              .map((l, idx) => {
                                const [n, k] = l.split('|');
                                const name = (n || '').trim();
                                const icon = (k || '').trim();
                                return (
                                  <div key={idx} className="flex items-center justify-between rounded-md border p-2 bg-gray-50 dark:bg-gray-900">
                                    <div className="text-sm truncate mr-2">
                                      <span className="font-medium">{name}</span>
                                      <span className="text-gray-500 text-xs ml-1">({icon})</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 h-8 w-8 p-0"
                                      onClick={() => {
                                        const lines = (form.services || '').split('\n').map((x) => x.trim()).filter(Boolean);
                                        const next = lines.filter((x) => x !== l).join('\n');
                                        setForm((f) => ({ ...f, services: next }));
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Switch id="active-edit" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                      <Label htmlFor="active-edit">Set as Active</Label>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {saving ? 'Saving…' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </form>
                </TabsContent>
                <TabsContent value="preview" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Light Mode Preview</h3>
                    </div>
                    <HeroPreview data={form} isDark={false} />
                    <div className="flex justify-between items-center pt-4">
                      <h3 className="font-semibold">Dark Mode Preview</h3>
                    </div>
                    <HeroPreview data={form} isDark={true} />
                  </div>
                </TabsContent>
              </Tabs>
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

        <Card>
          <CardHeader>
            <CardTitle>All Hero Groups</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-sm text-gray-500">Loading…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="overflow-x-auto">
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
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);
}
