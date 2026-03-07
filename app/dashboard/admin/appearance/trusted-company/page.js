'use client'
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lines, setLines] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [logos, setLogos] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ url: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/settings/trusted-company', { cache: 'no-store' });
        const data = await res.json();
        const d = data?.item?.data || {};
        const items = Array.isArray(d?.logos) ? d.logos : [];
        setTitle(d.title || '');
        setSubtitle(d.subtitle || '');
        setLines(items.join('\n'));
        setLogos(items);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const logosArray = (logos.length ? logos : lines.split('\n').map((l) => l.trim()).filter(Boolean));
      const res = await fetch('/api/settings/trusted-company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle, logos: logosArray }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Trusted company section saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Trusted Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Section Subtitle</Label>
                    <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">Logos</div>
                    <Button type="button" onClick={() => { setForm({ url: '' }); setOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" /> Add Logo
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Preview</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logos.map((u, idx) => (
                        <TableRow key={`${u}-${idx}`}>
                          <TableCell>
                            <img src={u} alt="" className="h-8 w-auto object-contain" />
                          </TableCell>
                          <TableCell className="max-w-[420px]">
                            <Input
                              value={u}
                              onChange={(e) => {
                                const next = [...logos];
                                next[idx] = e.target.value;
                                setLogos(next);
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="ghost" size="sm" className="hover:bg-red-50"
                                onClick={() => setLogos((prev) => prev.filter((_, i) => i !== idx))}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {saving ? 'Saving…' : 'Save Section'}
                    </Button>
                  </div>
                </form>

                <div className="pt-2">
                  <div className="text-xs text-gray-500">Bulk edit (optional)</div>
                  <Textarea rows={6} value={lines} onChange={(e) => { setLines(e.target.value); setLogos(e.target.value.split('\n').map((l) => l.trim()).filter(Boolean)); }} />
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>Add Logo</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <Input value={form.url} onChange={(e) => setForm({ url: e.target.value })} />
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={() => {
                          const url = form.url.trim();
                          if (!url) { toast.error('Enter a logo URL'); return; }
                          if (!logos.includes(url)) setLogos((prev) => [...prev, url]);
                          setOpen(false);
                          setForm({ url: '' });
                        }} className="bg-blue-600 hover:bg-blue-700 text-white">
                          Add
                        </Button>
                      </DialogFooter>
                    </div>
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
