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
  const [title, setTitle] = useState('Talk to a Security Expert');
  const [subtitle, setSubtitle] = useState('Ready to strengthen your security posture? Our team is available 24/7.');
  const [contact, setContact] = useState({ address: '123 Tech Street, San Francisco, CA 94105', phone: '+1 (555) 123-4567', email: 'contact@vertextech.com' });
  const [cta, setCta] = useState({ label: 'Get In Touch', href: '/contact' });
  const [hours, setHours] = useState([
    { day: 'Monday – Friday', hours: '7:00 AM – 6:00 PM PST' },
    { day: 'Saturday', hours: '8:00 AM – 2:00 PM PST' },
    { day: 'Sunday', hours: 'Closed' },
  ]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ day: '', hours: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/security-exports', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const d = data?.item?.data || {};
        if (typeof d.title === 'string') setTitle(d.title);
        if (typeof d.subtitle === 'string') setSubtitle(d.subtitle);
        if (d.contact && typeof d.contact === 'object') setContact({ address: d.contact.address || '', phone: d.contact.phone || '', email: d.contact.email || '' });
        if (d.cta && typeof d.cta === 'object') setCta({ label: d.cta.label || '', href: d.cta.href || '' });
        if (Array.isArray(d.hours) && d.hours.length) setHours(d.hours);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (nextHours = hours, nextTitle = title, nextSubtitle = subtitle, nextContact = contact, nextCta = cta) => {
    const res = await fetch('/api/settings/security-exports', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: nextTitle, subtitle: nextSubtitle, contact: nextContact, cta: nextCta, hours: nextHours }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const saveMeta = async () => {
    setSaving(true);
    try {
      await persist(hours);
      toast.success('Section saved');
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
      const entry = { day: form.day.trim(), hours: form.hours.trim() };
      if (!entry.day || !entry.hours) throw new Error('Day and hours are required');
      const next = [...hours, entry];
      await persist(next);
      setHours(next);
      setOpen(false);
      setForm({ day: '', hours: '' });
      toast.success('Hours added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (i) => { setCurrent(i); setForm({ day: i.day || '', hours: i.hours || '' }); setEditOpen(true); };
  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = { day: form.day.trim(), hours: form.hours.trim() };
      if (!updated.day || !updated.hours) throw new Error('Day and hours are required');
      const next = hours.map((h) => (h === current ? updated : h));
      await persist(next);
      setHours(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Hours updated');
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
      const next = hours.filter((h) => h !== current);
      await persist(next);
      setHours(next);
      setDeleteOpen(false);
      setCurrent(null);
      toast.success('Hours deleted');
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
            <CardTitle>Talk to a Security Expert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Blurb</Label>
                    <Textarea rows={3} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>CTA Label</Label>
                    <Input value={cta.label} onChange={(e) => setCta({ ...cta, label: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Href</Label>
                    <Input value={cta.href} onChange={(e) => setCta({ ...cta, href: e.target.value })} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveMeta} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">Save Section</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Office Hours</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <Button onClick={() => { setForm({ day: '', hours: '' }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Hours
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Day</TableHead>
                      <TableHead className="w-1/2">Hours</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hours.map((h, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-gray-900 dark:text-slate-100">{h.day}</TableCell>
                        <TableCell className="text-gray-600 dark:text-slate-400">{h.hours}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEdit(h)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => askDelete(h)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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
            <DialogHeader><DialogTitle>Add Hours</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-3">
              <div className="space-y-2">
                <Label>Day</Label>
                <Input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
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
            <DialogHeader><DialogTitle>Edit Hours</DialogTitle></DialogHeader>
            <form onSubmit={onEdit} className="space-y-3">
              <div className="space-y-2">
                <Label>Day</Label>
                <Input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
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
            <DialogHeader><DialogTitle>Delete Hours</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this schedule?</div>
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
