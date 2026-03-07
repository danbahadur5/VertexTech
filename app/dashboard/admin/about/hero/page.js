'use client'
import { useEffect, useRef, useState } from 'react';
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
  const [badge, setBadge] = useState('About VertexTech');
  const [titleLeading, setTitleLeading] = useState('Defending the');
  const [titleGradient, setTitleGradient] = useState('Digital Frontier');
  const [subtitle1, setSubtitle1] = useState('');
  const [subtitle2, setSubtitle2] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [stats, setStats] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ num: '', label: '' });
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/about-hero', { cache: 'no-store' });
      if (res.ok) {
        const js = await res.json();
        const d = js?.item?.data || {};
        if (d.badge) setBadge(d.badge);
        if (d.titleLeading) setTitleLeading(d.titleLeading);
        if (d.titleGradient) setTitleGradient(d.titleGradient);
        if (d.subtitle1) setSubtitle1(d.subtitle1);
        if (d.subtitle2) setSubtitle2(d.subtitle2);
        if (d.heroImage) setHeroImage(d.heroImage);
        if (Array.isArray(d.stats)) setStats(d.stats);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (nextStats = stats) => {
    const body = { badge, titleLeading, titleGradient, subtitle1, subtitle2, heroImage, stats: nextStats };
    const res = await fetch('/api/settings/about-hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const saveMeta = async () => {
    setSaving(true);
    try {
      await persist(stats);
      toast.success('Hero saved');
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
      const entry = { num: form.num.trim(), label: form.label.trim() };
      if (!entry.num || !entry.label) throw new Error('Number and label are required');
      const next = [...stats, entry];
      await persist(next);
      setStats(next);
      setOpen(false);
      setForm({ num: '', label: '' });
      toast.success('Stat added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };
  const startEdit = (i) => { setCurrent(i); setForm({ num: i.num || '', label: i.label || '' }); setEditOpen(true); };
  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = { num: form.num.trim(), label: form.label.trim() };
      if (!updated.num || !updated.label) throw new Error('Number and label are required');
      const next = stats.map((x) => (x === current ? updated : x));
      await persist(next);
      setStats(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Stat updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };
  const askDelete = (i) => { setCurrent(i); setDeleteOpen(true); };
  const onDelete = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const next = stats.filter((x) => x !== current);
      await persist(next);
      setStats(next);
      setDeleteOpen(false);
      setCurrent(null);
      toast.success('Stat deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (file) => {
    if (!file) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const js = await res.json();
      const url = js?.item?.url;
      if (url) setHeroImage(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setSaving(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>About Hero</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Badge</Label><Input value={badge} onChange={(e) => setBadge(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Title Leading</Label><Input value={titleLeading} onChange={(e) => setTitleLeading(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Title Gradient</Label><Input value={titleGradient} onChange={(e) => setTitleGradient(e.target.value)} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Story Paragraph 1</Label>
                  <Textarea rows={3} value={subtitle1} onChange={(e) => setSubtitle1(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Story Paragraph 2</Label>
                  <Textarea rows={3} value={subtitle2} onChange={(e) => setSubtitle2(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Hero Image URL</Label>
                  <Input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://…" />
                  <div className="flex items-center gap-3">
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>Upload Image</Button>
                    {heroImage && <img src={heroImage} alt="Hero" className="h-10 w-10 rounded object-cover border" />}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveMeta} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">Save Hero</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Stats</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <Button onClick={() => { setForm({ num: '', label: '' }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Stat
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.map((it, idx) => (
                      <TableRow key={`${it.label}-${idx}`}>
                        <TableCell className="font-medium text-gray-900">{it.num}</TableCell>
                        <TableCell className="text-gray-600">{it.label}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEdit(it)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => askDelete(it)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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
          <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Add Stat</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2"><Label>Number</Label><Input value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} /></div>
                <div className="space-y-2"><Label>Label</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
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
          <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Edit Stat</DialogTitle></DialogHeader>
            <form onSubmit={onEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2"><Label>Number</Label><Input value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} /></div>
                <div className="space-y-2"><Label>Label</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></div>
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
            <DialogHeader><DialogTitle>Delete Stat</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this stat?</div>
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
