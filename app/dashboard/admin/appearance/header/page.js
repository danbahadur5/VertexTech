'use client'
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/', hasDropdown: false, dropdown: [] },
    { name: 'Services', href: '/services', hasDropdown: true, dropdown: [
      { name: 'Cloud Solutions', href: '/services/cloud-solutions' },
      { name: 'Cybersecurity', href: '/services/cybersecurity' },
    ]},
  ]);
  const [ctas, setCtas] = useState([{ name: 'Start Project', href: '/contact' }]);

  const [navDialogOpen, setNavDialogOpen] = useState(false);
  const [dropdownDialogOpen, setDropdownDialogOpen] = useState(false);
  const [ctaDialogOpen, setCtaDialogOpen] = useState(false);
  
  const [currentNavIdx, setCurrentNavIdx] = useState(-1);
  const [currentDropdownIdx, setCurrentDropdownIdx] = useState(-1);
  const [currentCtaIdx, setCurrentCtaIdx] = useState(-1);

  const [navForm, setNavForm] = useState({ name: '', href: '', hasDropdown: false });
  const [dropdownForm, setDropdownForm] = useState({ name: '', href: '' });
  const [ctaForm, setCtaForm] = useState({ name: '', href: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings/header', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const d = data?.item?.data || {};
        if (d.logoUrl) setLogoUrl(d.logoUrl);
        if (Array.isArray(d.navigation)) setNavigation(d.navigation);
        if (Array.isArray(d.ctas)) setCtas(d.ctas);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const persist = async (nextNav = navigation, nextLogo = logoUrl, nextCtas = ctas) => {
    const res = await fetch('/api/settings/header', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logoUrl: nextLogo, navigation: nextNav, ctas: nextCtas }),
    });
    if (!res.ok) throw new Error('Failed to save');
  };

  const saveHeader = async () => {
    setSaving(true);
    try {
      await persist();
      toast.success('Header settings saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Navigation CRUD
  const startAddNav = () => {
    setCurrentNavIdx(-1);
    setNavForm({ name: '', href: '', hasDropdown: false });
    setNavDialogOpen(true);
  };

  const startEditNav = (idx) => {
    setCurrentNavIdx(idx);
    setNavForm({ ...navigation[idx] });
    setNavDialogOpen(true);
  };

  const onSaveNav = async (e) => {
    e.preventDefault();
    const next = [...navigation];
    if (currentNavIdx === -1) {
      next.push({ ...navForm, dropdown: [] });
    } else {
      next[currentNavIdx] = { ...next[currentNavIdx], ...navForm };
    }
    setNavigation(next);
    setNavDialogOpen(false);
  };

  const onDeleteNav = (idx) => {
    const next = navigation.filter((_, i) => i !== idx);
    setNavigation(next);
  };

  // Dropdown CRUD
  const startAddDropdown = (navIdx) => {
    setCurrentNavIdx(navIdx);
    setCurrentDropdownIdx(-1);
    setDropdownForm({ name: '', href: '' });
    setDropdownDialogOpen(true);
  };

  const startEditDropdown = (navIdx, dropIdx) => {
    setCurrentNavIdx(navIdx);
    setCurrentDropdownIdx(dropIdx);
    setDropdownForm({ ...navigation[navIdx].dropdown[dropIdx] });
    setDropdownDialogOpen(true);
  };

  const onSaveDropdown = (e) => {
    e.preventDefault();
    const next = [...navigation];
    const navItem = { ...next[currentNavIdx] };
    const dropdown = [...(navItem.dropdown || [])];
    
    if (currentDropdownIdx === -1) {
      dropdown.push(dropdownForm);
    } else {
      dropdown[currentDropdownIdx] = dropdownForm;
    }
    
    navItem.dropdown = dropdown;
    next[currentNavIdx] = navItem;
    setNavigation(next);
    setDropdownDialogOpen(false);
  };

  const onDeleteDropdown = (navIdx, dropIdx) => {
    const next = [...navigation];
    const navItem = { ...next[navIdx] };
    navItem.dropdown = navItem.dropdown.filter((_, i) => i !== dropIdx);
    next[navIdx] = navItem;
    setNavigation(next);
  };

  // CTA CRUD
  const startAddCta = () => {
    setCurrentCtaIdx(-1);
    setCtaForm({ name: '', href: '' });
    setCtaDialogOpen(true);
  };

  const startEditCta = (idx) => {
    setCurrentCtaIdx(idx);
    setCtaForm({ ...ctas[idx] });
    setCtaDialogOpen(true);
  };

  const onSaveCta = (e) => {
    e.preventDefault();
    const next = [...ctas];
    if (currentCtaIdx === -1) {
      next.push(ctaForm);
    } else {
      next[currentCtaIdx] = ctaForm;
    }
    setCtas(next);
    setCtaDialogOpen(false);
  };

  const onDeleteCta = (idx) => {
    const next = ctas.filter((_, i) => i !== idx);
    setCtas(next);
  };

  const moveItem = (list, setList, idx, dir) => {
    const next = [...list];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setList(next);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Header Settings</h1>
            <p className="text-gray-600 dark:text-slate-400 mt-1">Manage navigation, logo, and calls to action</p>
          </div>
          <Button onClick={saveHeader} disabled={saving} className="theme-btn">
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand & Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <div className="flex gap-2">
                <Input value={logoUrl || ''} onChange={(e) => setLogoUrl(e.target.value)} placeholder="/logo.png" />
                <Button variant="outline" onClick={() => window.open('/dashboard/admin/media', '_blank')}>Media</Button>
              </div>
              <p className="text-xs text-gray-500">Enter a URL or select from media library. Recommended size: 160x160px.</p>
            </div>
            {logoUrl && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 flex justify-center">
                <img src={logoUrl} alt="Logo Preview" className="h-12 object-contain" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Navigation Menu</CardTitle>
            <Button size="sm" onClick={startAddNav}><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Link (href)</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {navigation.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <TableRow>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.href}</TableCell>
                      <TableCell>{item.hasDropdown ? 'Dropdown' : 'Link'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => moveItem(navigation, setNavigation, idx, -1)} disabled={idx === 0}><ChevronUp className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => moveItem(navigation, setNavigation, idx, 1)} disabled={idx === navigation.length - 1}><ChevronDown className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => startEditNav(idx)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteNav(idx)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                    {item.hasDropdown && (
                      <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                        <TableCell colSpan={4} className="pl-12 py-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase text-gray-500">Dropdown Items</span>
                            <Button variant="outline" size="xs" className="h-7 text-xs" onClick={() => startAddDropdown(idx)}><Plus className="h-3 w-3 mr-1" /> Add Dropdown Link</Button>
                          </div>
                          <div className="space-y-2">
                            {(item.dropdown || []).map((drop, dIdx) => (
                              <div key={dIdx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 border rounded-md text-sm">
                                <span>{drop.name} <span className="text-gray-400 ml-2">({drop.href})</span></span>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditDropdown(idx, dIdx)}><Edit className="h-3.5 w-3.5" /></Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => onDeleteDropdown(idx, dIdx)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Calls to Action (Buttons)</CardTitle>
            <Button size="sm" onClick={startAddCta}><Plus className="h-4 w-4 mr-1" /> Add CTA</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Link (href)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ctas.map((cta, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{cta.name}</TableCell>
                    <TableCell>{cta.href}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => moveItem(ctas, setCtas, idx, -1)} disabled={idx === 0}><ChevronUp className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => moveItem(ctas, setCtas, idx, 1)} disabled={idx === ctas.length - 1}><ChevronDown className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => startEditCta(idx)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteCta(idx)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Nav Dialog */}
      <Dialog open={navDialogOpen} onOpenChange={setNavDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentNavIdx === -1 ? 'Add' : 'Edit'} Navigation Item</DialogTitle></DialogHeader>
          <form onSubmit={onSaveNav} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={navForm.name || ''} onChange={(e) => setNavForm({ ...navForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Link (href)</Label>
              <Input value={navForm.href || ''} onChange={(e) => setNavForm({ ...navForm, href: e.target.value })} required />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="hasDropdown" checked={!!navForm.hasDropdown} onChange={(e) => setNavForm({ ...navForm, hasDropdown: e.target.checked })} />
              <Label htmlFor="hasDropdown">Enable Dropdown</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNavDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dropdown Dialog */}
      <Dialog open={dropdownDialogOpen} onOpenChange={setDropdownDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentDropdownIdx === -1 ? 'Add' : 'Edit'} Dropdown Item</DialogTitle></DialogHeader>
          <form onSubmit={onSaveDropdown} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={dropdownForm.name || ''} onChange={(e) => setDropdownForm({ ...dropdownForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Link (href)</Label>
              <Input value={dropdownForm.href || ''} onChange={(e) => setDropdownForm({ ...dropdownForm, href: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDropdownDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CTA Dialog */}
      <Dialog open={ctaDialogOpen} onOpenChange={setCtaDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{currentCtaIdx === -1 ? 'Add' : 'Edit'} CTA</DialogTitle></DialogHeader>
          <form onSubmit={onSaveCta} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={ctaForm.name || ''} onChange={(e) => setCtaForm({ ...ctaForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Link (href)</Label>
              <Input value={ctaForm.href || ''} onChange={(e) => setCtaForm({ ...ctaForm, href: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCtaDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
