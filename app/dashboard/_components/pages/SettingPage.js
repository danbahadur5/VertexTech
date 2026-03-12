import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Switch } from '../../../components/ui/switch';
import { toast } from 'sonner';

export default function SettingPage() {
  const [siteName, setSiteName] = useState('VertexTech');
  const [supportEmail, setSupportEmail] = useState('support@vertextech.com');
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initial, setInitial] = useState({ siteName: 'VertexTech', supportEmail: 'support@vertextech.com', maintenance: false });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/system', { cache: 'no-store' });
      if (res.ok) {
        const js = await res.json();
        const d = js?.item?.data || {};
        const next = {
          siteName: d.siteName || initial.siteName,
          supportEmail: d.supportEmail || initial.supportEmail,
          maintenance: !!d.maintenance
        };
        setInitial(next);
        setSiteName(next.siteName);
        setSupportEmail(next.supportEmail);
        setMaintenance(next.maintenance);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const body = { siteName: siteName.trim(), supportEmail: supportEmail.trim(), maintenance };
      const res = await fetch('/api/settings/system', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved');
      setInitial(body);
    } catch (e) {
      toast.error(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setSiteName(initial.siteName);
    setSupportEmail(initial.supportEmail);
    setMaintenance(initial.maintenance);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 overflow-y-auto max-h-[70vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Settings</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-2">Manage general application settings</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border dark:border-slate-800 bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Basic site information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-900 dark:text-gray-100">
              {loading && <div className="text-sm text-slate-500 dark:text-slate-400">Loading settings…</div>}
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Your site name" />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="support@example.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <Switch id="maintenance" checked={maintenance} onCheckedChange={setMaintenance} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave} disabled={saving} className="cursor-pointer">{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
