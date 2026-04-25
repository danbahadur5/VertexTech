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
import { Plus, Trash2, Edit, RotateCcw } from 'lucide-react';

const DEFAULT_LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg"
];

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

  const onReset = () => {
    setTitle('TRUSTED BY');
    setSubtitle('Powering Businesses Around the World');
    setLogos(DEFAULT_LOGOS);
    setLines(DEFAULT_LOGOS.join('\n'));
    toast.info('Reset to defaults (click save to persist)');
  };

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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Trusted Company</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
            </Button>
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
                            <img 
                              src={u} 
                              alt="" 
                              className="h-8 w-auto object-contain bg-gray-50 dark:bg-gray-800 rounded" 
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150x50?text=Error";
                                e.target.onerror = null;
                              }}
                            />
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
