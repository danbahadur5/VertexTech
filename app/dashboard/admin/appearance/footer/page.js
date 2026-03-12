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
  const [blurb, setBlurb] = useState('AI-powered cybersecurity platform protecting 10M+ endpoints worldwide. Your trusted partner for complete digital defense.');
  const [contact, setContact] = useState({ email: 'contact@vertextech.com', phone: '+1 (555) 123-4567', address: '123 Tech Street, San Francisco, CA 94105' });
  const [socials, setSocials] = useState({ facebook: '#', twitter: '#', linkedin: '#', instagram: '#' });
  const [columns, setColumns] = useState([
    { title: 'Solutions', links: [{ name: 'Endpoint Detection', href: '/services/endpoint-detection' }, { name: 'Cloud Security', href: '/services/cloud-security' }] },
    { title: 'Resources', links: [{ name: 'Pricing', href: '/pricing' }, { name: 'Blog', href: '/blog' }] },
    { title: 'Company', links: [{ name: 'About Us', href: '/about' }, { name: 'Contact', href: '/contact' }] },
    { title: 'Legal', links: [{ name: 'Privacy Policy', href: '#' }, { name: 'Terms of Service', href: '#' }] },
  ]);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentColIdx, setCurrentColIdx] = useState(-1);
  const [currentLink, setCurrentLink] = useState(null);
  const [linkForm, setLinkForm] = useState({ name: '', href: '' });
  const [colForm, setColForm] = useState({ title: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/footer', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const d = data?.item?.data || {};
        if (typeof d.blurb === 'string') setBlurb(d.blurb);
        if (d.contact) setContact({ email: d.contact.email || '', phone: d.contact.phone || '', address: d.contact.address || '' });
        if (d.socials) setSocials({ facebook: d.socials.facebook || '', twitter: d.socials.twitter || '', linkedin: d.socials.linkedin || '', instagram: d.socials.instagram || '' });
        if (Array.isArray(d.columns) && d.columns.length) setColumns(d.columns);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const persist = async (nextColumns = columns, nextBlurb = blurb, nextContact = contact, nextSocials = socials) => {
    const res = await fetch('/api/settings/footer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blurb: nextBlurb, contact: nextContact, socials: nextSocials, columns: nextColumns }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const saveMeta = async () => {
    setSaving(true);
    try {
      await persist(columns);
      toast.success('Footer saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const startAddLink = (colIdx) => { setCurrentColIdx(colIdx); setCurrentLink(null); setLinkForm({ name: '', href: '' }); setOpen(true); };
  const onAddLink = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entry = { name: linkForm.name.trim(), href: linkForm.href.trim() };
      if (!entry.name || !entry.href) throw new Error('Name and href are required');
      const next = columns.map((c, i) => (i === currentColIdx ? { ...c, links: [...(c.links || []), entry] } : c));
      await persist(next);
      setColumns(next);
      setOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const startEditLink = (colIdx, link) => { setCurrentColIdx(colIdx); setCurrentLink(link); setLinkForm({ name: link.name || '', href: link.href || '' }); setEditOpen(true); };
  const onEditLink = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = { name: linkForm.name.trim(), href: linkForm.href.trim() };
      if (!updated.name || !updated.href) throw new Error('Name and href are required');
      const next = columns.map((c, i) => {
        if (i !== currentColIdx) return c;
        return { ...c, links: c.links.map((l) => (l === currentLink ? updated : l)) };
      });
      await persist(next);
      setColumns(next);
      setEditOpen(false);
      setCurrentLink(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const askDeleteLink = (colIdx, link) => { setCurrentColIdx(colIdx); setCurrentLink(link); setDeleteOpen(true); };
  const onDeleteLink = async () => {
    setSaving(true);
    try {
      const next = columns.map((c, i) => (i === currentColIdx ? { ...c, links: c.links.filter((l) => l !== currentLink) } : c));
      await persist(next);
      setColumns(next);
      setDeleteOpen(false);
      setCurrentLink(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const startEditColumn = (colIdx) => { setCurrentColIdx(colIdx); setColForm({ title: columns[colIdx]?.title || '' }); setEditOpen(true); setCurrentLink({ isColumn: true }); };
  const onEditColumn = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const next = columns.map((c, i) => (i === currentColIdx ? { ...c, title: colForm.title.trim() } : c));
      await persist(next);
      setColumns(next);
      setEditOpen(false);
      setCurrentLink(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update column');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Footer Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Blurb</Label>
                  <Textarea rows={3} value={blurb} onChange={(e) => setBlurb(e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <Label>Facebook URL</Label>
                    <Input value={socials.facebook} onChange={(e) => setSocials({ ...socials, facebook: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter URL</Label>
                    <Input value={socials.twitter} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn URL</Label>
                    <Input value={socials.linkedin} onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram URL</Label>
                    <Input value={socials.instagram} onChange={(e) => setSocials({ ...socials, instagram: e.target.value })} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={saveMeta} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">Save Footer</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Link Columns</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <div className="grid md:grid-cols-4 gap-6">
                {columns.map((col, colIdx) => (
                  <div key={colIdx} className="rounded-xl border bg-white dark:bg-black p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-gray-900 dark:text-slate-100">{col.title}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEditColumn(colIdx)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => startAddLink(colIdx)}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-sm font-medium text-gray-900 dark:text-slate-100">Name</TableHead>
                          <TableHead className="text-sm font-medium text-gray-900 dark:text-slate-100">Href</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(col.links || []).map((l, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm font-medium text-gray-900 dark:text-slate-100">{l.name}</TableCell>
                            <TableCell className="text-sm text-gray-600 dark:text-slate-100">{l.href}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEditLink(colIdx, l)}><Edit className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => askDeleteLink(colIdx, l)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Add Link</DialogTitle></DialogHeader>
            <form onSubmit={onAddLink} className="space-y-3">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={linkForm.name} onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Href</Label>
                <Input value={linkForm.href} onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })} />
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
          <DialogContent className="sm:max-w-md bg-white dark:bg-black text-gray-900 dark:text-slate-100 rounded-xl">
            <DialogHeader><DialogTitle>{currentLink?.isColumn ? 'Edit Column' : 'Edit Link'}</DialogTitle></DialogHeader>
            {currentLink?.isColumn ? (
              <form onSubmit={onEditColumn} className="space-y-3">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={colForm.title} onChange={(e) => setColForm({ ...colForm, title: e.target.value })} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <form onSubmit={onEditLink} className="space-y-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={linkForm.name} onChange={(e) => setLinkForm({ ...linkForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Href</Label>
                  <Input value={linkForm.href} onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Delete Link</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this link?</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button type="button" onClick={onDeleteLink} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
                {saving ? 'Deleting…' : 'Yes, Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
