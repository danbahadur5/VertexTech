'use client'
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ num: '', suffix: '', label: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/hero-trusted-count', { cache: 'no-store' });
      const data = await res.json();
      const d = data?.item?.data || {};
      setTitle(d.title || '');
      setItems(Array.isArray(d.items) ? d.items : []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (nextItems) => {
    const res = await fetch('/api/settings/hero-trusted-count', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, items: nextItems }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const onAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entry = { num: form.num.trim(), suffix: form.suffix.trim(), label: form.label.trim() };
      if (!entry.num || !entry.label) throw new Error('Number and label are required');
      const next = [...items, entry];
      await persist(next);
      setItems(next);
      setOpen(false);
      setForm({ num: '', suffix: '', label: '' });
      toast.success('Item added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (i) => {
    setCurrent(i);
    setForm({ num: i.num || '', suffix: i.suffix || '', label: i.label || '' });
    setEditOpen(true);
  };
  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = { num: form.num.trim(), suffix: form.suffix.trim(), label: form.label.trim() };
      if (!updated.num || !updated.label) throw new Error('Number and label are required');
      const next = items.map((x) => (x === current ? updated : x));
      await persist(next);
      setItems(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Item updated');
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
      toast.success('Item deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const saveTitle = async () => {
    try {
      await persist(items);
      toast.success('Title saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save title');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Trusted Count</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="flex-1">
                    <Label>Section Title (optional)</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <Button onClick={saveTitle} className="bg-blue-600 hover:bg-blue-700 text-white">Save Title</Button>
                  <Button onClick={() => { setForm({ num: '', suffix: '', label: '' }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Suffix</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => (
                      <TableRow key={`${it.label}-${idx}`}>
                        <TableCell>{it.num}</TableCell>
                        <TableCell>{it.suffix}</TableCell>
                        <TableCell>{it.label}</TableCell>
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

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Item</DialogTitle></DialogHeader>
                    <form onSubmit={onAdd} className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Number</Label>
                          <Input value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} />
                        </div>
                        <div>
                          <Label>Suffix</Label>
                          <Input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} />
                        </div>
                        <div className="col-span-3">
                          <Label>Label</Label>
                          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                        </div>
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
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Edit Item</DialogTitle></DialogHeader>
                    <form onSubmit={onEdit} className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label>Number</Label>
                          <Input value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} />
                        </div>
                        <div>
                          <Label>Suffix</Label>
                          <Input value={form.suffix} onChange={(e) => setForm({ ...form, suffix: e.target.value })} />
                        </div>
                        <div className="col-span-3">
                          <Label>Label</Label>
                          <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                        </div>
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
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Delete Item</DialogTitle></DialogHeader>
                    <div className="text-sm text-gray-600">Are you sure you want to delete this item?</div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
                      <Button type="button" onClick={onDelete} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
                        {saving ? 'Deleting…' : 'Yes, Delete'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
