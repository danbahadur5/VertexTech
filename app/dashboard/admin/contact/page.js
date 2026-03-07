'use client'
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [badge, setBadge] = useState('Get in Touch');
  const [titleLeading, setTitleLeading] = useState('Talk to a');
  const [titleGradient, setTitleGradient] = useState('Security Expert');
  const [subtitle, setSubtitle] = useState('Ready to strengthen your security posture? Our team of cybersecurity experts is available 24/7 to assess your needs and recommend the right protection.');

  const [contact, setContact] = useState({
    email: 'contact@vertextech.com',
    emailLink: 'mailto:contact@vertextech.com',
    phone: '+1 (555) 123-4567',
    phoneLink: 'tel:+15551234567',
    hqAddress: '123 Tech Street, San Francisco, CA 94105',
    hqLink: 'https://maps.google.com',
    hours: 'Mon–Fri: 9:00 AM – 6:00 PM PST',
  });

  const [offices, setOffices] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ city: '', country: '', address: '', phone: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/contact-page', { cache: 'no-store' });
      if (res.ok) {
        const js = await res.json();
        const d = js?.item?.data || {};
        if (d.badge) setBadge(d.badge);
        if (d.titleLeading) setTitleLeading(d.titleLeading);
        if (d.titleGradient) setTitleGradient(d.titleGradient);
        if (d.subtitle) setSubtitle(d.subtitle);
        if (d.contact) setContact({ ...contact, ...d.contact });
        if (Array.isArray(d.offices)) setOffices(d.offices);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (nextOffices = offices) => {
    const body = { badge, titleLeading, titleGradient, subtitle, contact, offices: nextOffices };
    const res = await fetch('/api/settings/contact-page', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const saveHero = async () => {
    setSaving(true);
    try {
      await persist(offices);
      toast.success('Contact hero saved');
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
      const entry = { city: form.city.trim(), country: form.country.trim(), address: form.address.trim(), phone: form.phone.trim() };
      if (!entry.city || !entry.country || !entry.address) throw new Error('City, country, and address are required');
      const next = [...offices, entry];
      await persist(next);
      setOffices(next);
      setOpen(false);
      setForm({ city: '', country: '', address: '', phone: '' });
      toast.success('Office added');
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (o) => { setCurrent(o); setForm({ city: o.city || '', country: o.country || '', address: o.address || '', phone: o.phone || '' }); setEditOpen(true); };
  const onEdit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setSaving(true);
    try {
      const updated = { city: form.city.trim(), country: form.country.trim(), address: form.address.trim(), phone: form.phone.trim() };
      if (!updated.city || !updated.country || !updated.address) throw new Error('City, country, and address are required');
      const next = offices.map((x) => (x === current ? updated : x));
      await persist(next);
      setOffices(next);
      setEditOpen(false);
      setCurrent(null);
      toast.success('Office updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };
  const askDelete = (o) => { setCurrent(o); setDeleteOpen(true); };
  const onDelete = async () => {
    if (!current) return;
    setSaving(true);
    try {
      const next = offices.filter((x) => x !== current);
      await persist(next);
      setOffices(next);
      setDeleteOpen(false);
      setCurrent(null);
      toast.success('Office deleted');
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
          <CardHeader><CardTitle>Contact Hero</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-2"><Label>Badge</Label><Input value={badge} onChange={(e) => setBadge(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Title Leading</Label><Input value={titleLeading} onChange={(e) => setTitleLeading(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Title Gradient</Label><Input value={titleGradient} onChange={(e) => setTitleGradient(e.target.value)} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea rows={3} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Email</Label><Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Email Link</Label><Input value={contact.emailLink} onChange={(e) => setContact({ ...contact, emailLink: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Phone Link</Label><Input value={contact.phoneLink} onChange={(e) => setContact({ ...contact, phoneLink: e.target.value })} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>HQ Address</Label><Input value={contact.hqAddress} onChange={(e) => setContact({ ...contact, hqAddress: e.target.value })} /></div>
                  <div className="space-y-2"><Label>HQ Map Link</Label><Input value={contact.hqLink} onChange={(e) => setContact({ ...contact, hqLink: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Business Hours</Label><Input value={contact.hours} onChange={(e) => setContact({ ...contact, hours: e.target.value })} /></div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveHero} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">Save</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Offices</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <Button onClick={() => { setForm({ city: '', country: '', address: '', phone: '' }); setOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Office
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offices.map((o, idx) => (
                      <TableRow key={`${o.city}-${idx}`}>
                        <TableCell className="font-medium text-gray-900">{o.city}</TableCell>
                        <TableCell className="text-gray-600">{o.country}</TableCell>
                        <TableCell className="text-gray-600">{o.address}</TableCell>
                        <TableCell className="text-gray-600">{o.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEdit(o)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => askDelete(o)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
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
            <DialogHeader><DialogTitle>Add Office</DialogTitle></DialogHeader>
            <form onSubmit={onAdd} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div className="space-y-2"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
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
            <DialogHeader><DialogTitle>Edit Office</DialogTitle></DialogHeader>
            <form onSubmit={onEdit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div className="space-y-2"><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
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
            <DialogHeader><DialogTitle>Delete Office</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this office?</div>
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
