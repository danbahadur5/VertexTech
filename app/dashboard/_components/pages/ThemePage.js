import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { toast } from 'sonner';
import { useColorTheme, THEME_OPTIONS } from '../../../lib/theme-context';
import { Check, RotateCcw, Save, Palette, Layout, Type } from 'lucide-react';

export default function ThemePage() {
  const { theme, setTheme, updateTheme, loading: themeLoading } = useColorTheme();
  const [saving, setSaving] = useState(false);
  const [localTheme, setLocalTheme] = useState(theme);

  useEffect(() => {
    if (!themeLoading) {
      setLocalTheme(theme);
    }
  }, [theme, themeLoading]);

  const handlePresetSelect = (option) => {
    setLocalTheme(option);
  };

  const handleUpdate = (updates) => {
    setLocalTheme(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localTheme)
      });
      if (!res.ok) throw new Error('Failed to save theme');
      setTheme(localTheme);
      toast.success('Theme settings applied globally!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalTheme(THEME_OPTIONS[0]);
  };

  if (themeLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Global Theme Customization</h1>
            <p className="text-gray-500 mt-2 dark:text-slate-400">Design your website's identity with real-time visual adjustments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
            <Button onClick={handleSave} disabled={saving} className="theme-btn gap-2">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Theme Presets */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" /> Theme Presets
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handlePresetSelect(option)}
                className={`relative p-4 rounded-2xl border-2 transition-all text-left group hover:scale-105 ${
                  localTheme.id === option.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent bg-white dark:bg-gray-900 shadow-sm'
                }`}
              >
                <div 
                  className="w-full h-12 rounded-lg mb-3 shadow-inner" 
                  style={{ background: option.primary }}
                />
                <span className="text-sm font-bold block truncate">{option.name}</span>
                {localTheme.id === option.id && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visual Identity */}
          <Card className="border dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b dark:border-slate-800 bg-gray-50/50 dark:bg-gray-800/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" /> Visual Identity
              </CardTitle>
              <CardDescription>Fine-tune your brand colors and gradients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Brand Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={localTheme.primary || '#000000'} 
                      onChange={(e) => handleUpdate({ primary: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input 
                      value={localTheme.primary || ''} 
                      onChange={(e) => handleUpdate({ primary: e.target.value })}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={localTheme.secondary || '#000000'} 
                      onChange={(e) => handleUpdate({ secondary: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input 
                      value={localTheme.secondary || ''} 
                      onChange={(e) => handleUpdate({ secondary: e.target.value })}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={localTheme.accent || '#000000'} 
                    onChange={(e) => handleUpdate({ accent: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    value={localTheme.accent || ''} 
                    onChange={(e) => handleUpdate({ accent: e.target.value })}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography & Shapes */}
          <Card className="border dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b dark:border-slate-800 bg-gray-50/50 dark:bg-gray-800/50">
              <CardTitle className="text-xl flex items-center gap-2">
                <Layout className="w-5 h-5 text-green-600" /> Typography & Shapes
              </CardTitle>
              <CardDescription>Control the feel through fonts and corner radius</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Type className="w-4 h-4" /> Primary Font Family</Label>
                <Select 
                  value={localTheme.fontFamily || 'Inter'} 
                  onValueChange={(val) => handleUpdate({ fontFamily: val })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter (Default)</SelectItem>
                    <SelectItem value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</SelectItem>
                    <SelectItem value="'Outfit', sans-serif">Plus Outfit</SelectItem>
                    <SelectItem value="system-ui">System Default</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Component Border Radius</Label>
                <Select 
                  value={localTheme.borderRadius || '0.75rem'} 
                  onValueChange={(val) => handleUpdate({ borderRadius: val })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0rem">Sharp (0px)</SelectItem>
                    <SelectItem value="0.375rem">Subtle (6px)</SelectItem>
                    <SelectItem value="0.5rem">Soft (8px)</SelectItem>
                    <SelectItem value="0.75rem">Modern (12px)</SelectItem>
                    <SelectItem value="1rem">Rounded (16px)</SelectItem>
                    <SelectItem value="1.5rem">Organic (24px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-6 rounded-2xl border-2 border-dashed dark:border-slate-800 flex flex-col items-center gap-4">
                <span className="text-sm font-medium text-gray-500">Live Component Preview</span>
                <div 
                  className="px-6 py-2 shadow-lg text-white font-bold transition-all"
                  style={{ 
                    background: localTheme.primary, 
                    borderRadius: localTheme.borderRadius,
                    fontFamily: localTheme.fontFamily
                  }}
                >
                  Action Button
                </div>
                <div 
                  className="w-full h-8 border shadow-sm"
                  style={{ 
                    borderColor: localTheme.primary,
                    borderRadius: localTheme.borderRadius 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
