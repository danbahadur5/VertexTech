import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';

export default function ClientSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium' });
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/tickets', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setTickets(data.items || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const getStatusClass = (status) => {
    if (status === 'open') return 'bg-red-100 text-red-800';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support</h1>
            <p className="text-gray-600 mt-2">Create and track your </p>
          </div>
          <Button onClick={() => { setForm({ subject: '', description: '', priority: 'medium' }); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Tickets</CardTitle>
            <CardDescription>Latest updates from our team</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-sm text-gray-500">Loading tickets…</div>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t._id || t.id}>
                    <TableCell className="font-medium">{t.subject}</TableCell>
                    <TableCell>
                      <Badge variant={t.priority === 'high' ? 'destructive' : 'secondary'}>
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusClass(t.status)}>{t.status}</Badge>
                    </TableCell>
                    <TableCell>{t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle>New Support Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!form.subject.trim() || !form.description.trim()) {
                toast.error('Please fill Subject and Description');
                return;
              }
              setSaving(true);
              try {
                const res = await fetch('/api/tickets', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ subject: form.subject.trim(), description: form.description.trim(), priority: form.priority }),
                });
                if (!res.ok) throw new Error('Failed to create ticket');
                const data = await res.json();
                setTickets((prev) => [data.item, ...prev]);
                setOpen(false);
                toast.success('Ticket created');
              } catch (err) {
                toast.error(err.message || 'Failed to create ticket');
              } finally {
                setSaving(false);
              }
            }} className="space-y-4">
              <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <Textarea rows={4} placeholder="Describe your issue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">{saving ? 'Submitting...' : 'Submit Ticket'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
