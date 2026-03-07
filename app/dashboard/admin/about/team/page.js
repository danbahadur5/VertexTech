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
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ name: '', position: '', avatarUrl: '', bio: '' });
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/about-team', { cache: 'no-store' });
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
    const res = await fetch('/api/settings/about-team', {
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
      const entry = { name: form.name.trim(), position: form.position.trim(), avatarUrl: form.avatarUrl.trim(), bio: form.bio.trim() };
      if (!entry.name || !entry.position) throw new Error('Name and position are required');
      const next = [...items, entry];
      await persist(next);
      setItems(next);
      setOpen(false);
      setForm({ name: '', position: '', avatarUrl: '', bio: '' });
      toast.success('Team member added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (i) => { setCurrent(i); setForm({ name: i.name || '', position: i.position || '', avatarUrl: i.avatarUrl || '', bio: i.bio || '' }); setEditOpen(true); };
  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = { name: form.name.trim(), position: form.position.trim(), avatarUrl: form.avatarUrl.trim(), bio: form.bio.trim() };
      if (!updated.name || !updated.position) throw new Error('Name and position are required');
      const next = items.map((x) => (x === current ? updated : x));
      await persist(next);
      setItems(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Team member updated');
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
      toast.success('Team member deleted');
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
      if (url) setForm((f) => ({ ...f, avatarUrl: url }));
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
          <CardHeader>
            <CardTitle>Meet Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <Button onClick={() => { setForm({ name: '', position: '', avatarUrl: '', bio: '' }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Member
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Avatar</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Bio</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it, idx) => (
                      <TableRow key={`${it.name}-${idx}`}>
                        <TableCell>
                          {it.avatarUrl ? (
                            <img src={it.avatarUrl} alt={it.name} className="h-10 w-10 rounded-full object-cover border" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 border flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{it.name}</TableCell>
                        <TableCell className="text-gray-600">{it.position}</TableCell>
                        <TableCell className="text-gray-600"><div className="line-clamp-2">{it.bio}</div></TableCell>
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
            <DialogHeader><DialogTitle>Add Member</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Position</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Avatar URL</Label>
                  <Input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://…" />
                  <div className="flex items-center gap-3 mt-2">
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
                    <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>Upload Avatar</Button>
                    {form.avatarUrl && <img src={form.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border" />}
                  </div>
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
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Edit Member</DialogTitle></DialogHeader>
            <form onSubmit={onEdit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Position</Label><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Bio</Label><Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Avatar URL</Label>
                  <Input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://…" />
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
          <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Delete Member</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this member?</div>
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
