import React, { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

export default function MediaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onPick = () => inputRef.current?.click();
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      await load();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const askDelete = (file) => {
    setCurrent(file);
    setDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (!current) return;
    setDeleting(true);
    const res = await fetch(`/api/media/${encodeURIComponent(current.publicId)}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.publicId !== current.publicId));
    }
    setDeleting(false);
    setDeleteOpen(false);
    setCurrent(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Media Library</h1>
            <p className="text-gray-600 mt-2">Upload and manage media files</p>
          </div>
          <input ref={inputRef} type="file" hidden onChange={onFile} />
          <Button onClick={onPick} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading…' : 'Upload File'}
          </Button>
        </div>

        {loading && <div className="text-sm text-gray-500">Loading media…</div>}
        {!loading && (
        <div className="grid md:grid-cols-4 gap-6">
          {items.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img src={file.url} alt={file.name || file.publicId} className="w-full h-full object-cover" />
              </div>
              <CardContent className="pt-4">
                <p className="font-medium text-sm truncate">{file.name || file.publicId}</p>
                {typeof file.size === 'number' && (
                  <p className="text-xs text-gray-500 mb-3">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ImageIcon className="h-3 w-3 mr-1" /> View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => askDelete(file)}>
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <span className="font-semibold">{current?.publicId}</span>?
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button type="button" onClick={confirmDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700 text-white">
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
