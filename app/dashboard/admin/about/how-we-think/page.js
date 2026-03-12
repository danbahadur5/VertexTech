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
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ icon: 'Shield', title: '', desc: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/about-principles', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const d = data?.item?.data || {};
        setItems(Array.isArray(d.items) ? d.items : []);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (next) => {
    const res = await fetch('/api/settings/about-principles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: next }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const onAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entry = { icon: form.icon.trim() || 'Shield', title: form.title.trim(), desc: form.desc.trim() };
      if (!entry.title || !entry.desc) throw new Error('Title and description are required');
      const next = [...items, entry];
      await persist(next);
      setItems(next);
      setOpen(false);
      setForm({ icon: 'Shield', title: '', desc: '' });
      toast.success('Principle added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (i) => { setCurrent(i); setForm({ icon: i.icon || 'Shield', title: i.title || '', desc: i.desc || '' }); setEditOpen(true); };
  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = { icon: form.icon.trim() || 'Shield', title: form.title.trim(), desc: form.desc.trim() };
      if (!updated.title || !updated.desc) throw new Error('Title and description are required');
      const next = items.map((x) => (x === current ? updated : x));
      await persist(next);
      setItems(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Principle updated');
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
      const next = items.filter((x) => x !== current);
      await persist(next);
      setItems(next);
      setDeleteOpen(false);
      setCurrent(null);
      toast.success('Principle deleted');
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
          <CardHeader><CardTitle>How We Think</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <Button onClick={() => { setForm({ icon: 'Shield', title: '', desc: '' }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Principle
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icon</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => (
                      <TableRow key={`${it.title}-${idx}`}>
                        <TableCell className="text-gray-600 dark">{it.icon}</TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-300">{it.title}</TableCell>
                        <TableCell className="text-gray-600"><div className="line-clamp-2">{it.desc}</div></TableCell>
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
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Add Principle</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Icon (name)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
                <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
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
            <DialogHeader><DialogTitle>Edit Principle</DialogTitle></DialogHeader>
            <form onSubmit={onEdit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Icon (name)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
                <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></div>
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
            <DialogHeader><DialogTitle>Delete Principle</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this item?</div>
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
