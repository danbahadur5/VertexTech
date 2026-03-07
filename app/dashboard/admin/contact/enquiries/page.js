'use client'
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Eye, Trash2, CheckCircle2, Mail, Building2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enquiries', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      toast.error('Unable to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const view = (item) => { setCurrent(item); setViewOpen(true); if (item.status === 'new') markStatus(item, 'read'); };
  const askDelete = (item) => { setCurrent(item); setDeleteOpen(true); };

  const markStatus = async (item, status) => {
    try {
      const res = await fetch(`/api/enquiries/${item._id || item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setItems((prev) => prev.map((x) => (x._id === item._id ? { ...x, status } : x)));
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    }
  };

  const doDelete = async () => {
    if (!current) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/enquiries/${current._id || current.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setItems((prev) => prev.filter((x) => (x._id || x.id) !== (current._id || current.id)));
      setDeleteOpen(false);
      setCurrent(null);
      toast.success('Enquiry deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-gray-500">Loading…</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it) => (
                    <TableRow key={it._id || it.id}>
                      <TableCell className="font-medium text-gray-900">{it.name}</TableCell>
                      <TableCell className="text-gray-600">{it.email}</TableCell>
                      <TableCell className="text-gray-600">{it.subject}</TableCell>
                      <TableCell className="text-gray-600">{it.company || '-'}</TableCell>
                      <TableCell>
                        <Badge className={it.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {it.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{it.createdAt ? new Date(it.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => view(it)}><Eye className="h-4 w-4" /></Button>
                          {it.status === 'new' ? (
                            <Button variant="outline" size="sm" onClick={() => markStatus(it, 'read')}><CheckCircle2 className="h-4 w-4" /></Button>
                          ) : null}
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

        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="sm:max-w-xl bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Enquiry</DialogTitle></DialogHeader>
            {current && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4" /><span>{current.email}</span></div>
                {current.company && <div className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4" /><span>{current.company}</span></div>}
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">{current.subject}</div>
                    <div className="text-gray-700 whitespace-pre-wrap">{current.message}</div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-white text-gray-900 rounded-xl">
            <DialogHeader><DialogTitle>Delete Enquiry</DialogTitle></DialogHeader>
            <div className="text-sm text-gray-600">Are you sure you want to delete this enquiry?</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button type="button" onClick={doDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
