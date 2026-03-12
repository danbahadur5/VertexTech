'use client'
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Textarea } from '../../../../components/ui/textarea';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroTitle, setHeroTitle] = useState('Protection That Scales');
  const [heroSubtitle, setHeroSubtitle] = useState('Per-endpoint pricing that grows with your organization.');
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', icon: 'Shield', tagline: '', price: '', period: '', features: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/pricing', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const d = data?.item?.data || {};
        setHeroTitle(d.heroTitle || heroTitle);
        setHeroSubtitle(d.heroSubtitle || heroSubtitle);
        setPlans(Array.isArray(d.plans) ? d.plans : []);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (nextPlans = plans, t = heroTitle, s = heroSubtitle) => {
    const res = await fetch('/api/settings/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroTitle: t, heroSubtitle: s, plans: nextPlans }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const saveHero = async () => {
    setSaving(true);
    try {
      await persist(plans);
      toast.success('Pricing hero saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const onAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entry = {
        id: form.id.trim() || form.name.trim().toLowerCase().replace(/\s+/g, '-'),
        name: form.name.trim(),
        icon: form.icon.trim() || 'Shield',
        tagline: form.tagline.trim(),
        price: form.price.trim(),
        period: form.period.trim(),
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      };
      if (!entry.name || !entry.price) throw new Error('Name and price are required');
      const next = [...plans, entry];
      await persist(next);
      setPlans(next);
      setOpen(false);
      setForm({ id: '', name: '', icon: 'Shield', tagline: '', price: '', period: '', features: '' });
      toast.success('Plan added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (p) => {
    setCurrent(p);
    setForm({
      id: p.id || '',
      name: p.name || '',
      icon: p.icon || 'Shield',
      tagline: p.tagline || '',
      price: p.price || '',
      period: p.period || '',
      features: Array.isArray(p.features) ? p.features.join(', ') : '',
    });
    setEditOpen(true);
  };

  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = {
        id: form.id.trim() || current.id,
        name: form.name.trim(),
        icon: form.icon.trim() || 'Shield',
        tagline: form.tagline.trim(),
        price: form.price.trim(),
        period: form.period.trim(),
        features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      };
      if (!updated.name || !updated.price) throw new Error('Name and price are required');
      const next = plans.map((x) => (x === current ? updated : x));
      await persist(next);
      setPlans(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Plan updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const askDelete = (p) => { setCurrent(p); setDeleteOpen(true); };
  const onDelete = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const next = plans.filter((x) => x !== current);
      await persist(next);
      setPlans(next);
      setDeleteOpen(false);
      setCurrent(null);
      toast.success('Plan deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Hero Title</Label>
                    <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Subtitle</Label>
                    <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveHero} className="bg-blue-600 hover:bg-blue-700 text-white">Save Header</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <Button onClick={() => { setForm({ id: '', name: '', icon: 'Shield', tagline: '', price: '', period: '', features: '' }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Plan
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Tagline</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map((p, idx) => (
                      <TableRow key={`${p.name}-${idx}`}>
                        <TableCell className="font-medium text-gray-900 dark:text-slate-100">{p.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-slate-100">{p.tagline}</TableCell>
                        <TableCell className="font-mono dark:text-slate-100">{p.price}</TableCell>
                        <TableCell className="text-gray-600 dark:text-slate-100">{p.period}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEdit(p)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => askDelete(p)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Add Plan</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Icon (name)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
                <div className="space-y-2"><Label>Price</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div className="space-y-2"><Label>Period</Label><Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Features (comma separated)</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? 'Adding…' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Edit Plan</DialogTitle></DialogHeader>
            <form onSubmit={onEdit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Icon (name)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
                <div className="space-y-2"><Label>Price</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div className="space-y-2"><Label>Period</Label><Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Features (comma separated)</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Delete Plan</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this plan?</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button type="button" onClick={onDelete} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
                {saving ? 'Deleting…' : 'Yes, Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
