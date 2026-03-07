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
import { Switch } from '../../../../components/ui/switch';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const fileAvatarRef = useRef(null);
  const fileLogoRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    quote: '',
    avatarUrl: '',
    logoUrl: '',
    featured: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/trusted-security-leader', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      const d = data?.item?.data || {};
      setTitle(d.title || '');
      setSubtitle(d.subtitle || '');
      setItems(Array.isArray(d.items) ? d.items : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (nextItems, nextTitle = title, nextSubtitle = subtitle) => {
    const res = await fetch('/api/settings/trusted-security-leader', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: nextTitle, subtitle: nextSubtitle, items: nextItems }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const onAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entry = {
        name: form.name.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        quote: form.quote.trim(),
        avatarUrl: form.avatarUrl.trim(),
        logoUrl: form.logoUrl.trim(),
        featured: !!form.featured,
      };
      if (!entry.name || !entry.role) throw new Error('Name and role are required');
      const next = [...items, entry];
      await persist(next);
      setItems(next);
      setOpen(false);
      setForm({ name: '', role: '', company: '', quote: '', avatarUrl: '', logoUrl: '', featured: false });
      toast.success('Leader added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (i) => {
    setCurrent(i);
    setForm({
      name: i.name || '',
      role: i.role || '',
      company: i.company || '',
      quote: i.quote || '',
      avatarUrl: i.avatarUrl || '',
      logoUrl: i.logoUrl || '',
      featured: !!i.featured,
    });
    setEditOpen(true);
  };

  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = {
        name: form.name.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        quote: form.quote.trim(),
        avatarUrl: form.avatarUrl.trim(),
        logoUrl: form.logoUrl.trim(),
        featured: !!form.featured,
      };
      if (!updated.name || !updated.role) throw new Error('Name and role are required');
      const next = items.map((x) => (x === current ? updated : x));
      await persist(next);
      setItems(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Leader updated');
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
      toast.success('Leader deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const saveMeta = async () => {
    setSaving(true);
    try {
      await persist(items);
      toast.success('Section saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save section');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file, onUrl) => {
    if (!file) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const js = await res.json();
      const url = js?.item?.url;
      if (url) onUrl(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trusted Security Leader</h1>
            <p className="text-gray-600 mt-2">Showcase leader quotes and trust signals.</p>
          </div>
          <Button onClick={() => { setForm({ name: '', role: '', company: '', quote: '', avatarUrl: '', logoUrl: '', featured: false }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Leader
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Trusted by Security Leaders" />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Short supporting statement" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveMeta} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Section
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Featured</TableHead>
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
                      <TableCell className="text-gray-600">{it.role}</TableCell>
                      <TableCell className="text-gray-600 flex items-center gap-2">
                        {it.logoUrl && <img src={it.logoUrl} alt={it.company} className="h-5 w-5 object-contain" />}
                        {it.company}
                      </TableCell>
                      <TableCell>{it.featured ? 'Yes' : 'No'}</TableCell>
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
            )}
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Add Leader</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  <Input placeholder="https://…" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
                  <div className="flex items-center gap-3">
                    <input ref={fileAvatarRef} type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadImage(file, (url) => setForm((f) => ({ ...f, avatarUrl: url })));
                      if (fileAvatarRef.current) fileAvatarRef.current.value = '';
                    }} />
                    <Button type="button" variant="outline" onClick={() => fileAvatarRef.current?.click()}>
                      Upload Avatar
                    </Button>
                    {form.avatarUrl && <img src={form.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Company Logo URL</Label>
                  <Input placeholder="https://…" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
                  <div className="flex items-center gap-3">
                    <input ref={fileLogoRef} type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadImage(file, (url) => setForm((f) => ({ ...f, logoUrl: url })));
                      if (fileLogoRef.current) fileLogoRef.current.value = '';
                    }} />
                    <Button type="button" variant="outline" onClick={() => fileLogoRef.current?.click()}>
                      Upload Logo
                    </Button>
                    {form.logoUrl && <img src={form.logoUrl} alt="Logo" className="h-8 w-8 object-contain border rounded" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="featured" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {saving ? 'Adding…' : 'Add Leader'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Edit Leader</DialogTitle></DialogHeader>
            <form onSubmit={onEdit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Avatar URL</Label>
                  <Input placeholder="https://…" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
                  <div className="flex items-center gap-3">
                    <input ref={fileAvatarRef} type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadImage(file, (url) => setForm((f) => ({ ...f, avatarUrl: url })));
                      if (fileAvatarRef.current) fileAvatarRef.current.value = '';
                    }} />
                    <Button type="button" variant="outline" onClick={() => fileAvatarRef.current?.click()}>
                      Upload Avatar
                    </Button>
                    {form.avatarUrl && <img src={form.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border" />}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Company Logo URL</Label>
                  <Input placeholder="https://…" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} />
                  <div className="flex items-center gap-3">
                    <input ref={fileLogoRef} type="file" accept="image/*" hidden onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await uploadImage(file, (url) => setForm((f) => ({ ...form, logoUrl: url })));
                      if (fileLogoRef.current) fileLogoRef.current.value = '';
                    }} />
                    <Button type="button" variant="outline" onClick={() => fileLogoRef.current?.click()}>
                      Upload Logo
                    </Button>
                    {form.logoUrl && <img src={form.logoUrl} alt="Logo" className="h-8 w-8 object-contain border rounded" />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="featured2" checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                  <Label htmlFor="featured2">Featured</Label>
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
            <DialogHeader><DialogTitle>Delete Leader</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this leader?</div>
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
