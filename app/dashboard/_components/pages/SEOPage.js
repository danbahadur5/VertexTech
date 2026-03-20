'use client'
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Edit, Search, Globe, FileText, Briefcase, Newspaper } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { toast } from 'sonner';

export default function SEOPage() {
  const [pages, setPages] = useState([]);
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [globalSEO, setGlobalSEO] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
    canonicalUrl: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState(null); // { type: 'page'|'service'|'post'|'caseStudy', data: obj }
  
  const [form, setForm] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
    canonicalUrl: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resPages, resServices, resPosts, resCaseStudies, resGlobal] = await Promise.all([
        fetch('/api/pages', { cache: 'no-store' }),
        fetch('/api/services', { cache: 'no-store' }),
        fetch('/api/blog', { cache: 'no-store' }),
        fetch('/api/case-studies', { cache: 'no-store' }),
        fetch('/api/settings/system', { cache: 'no-store' })
      ]);

      const [dPages, dServices, dPosts, dCaseStudies, dGlobal] = await Promise.all([
        resPages.ok ? resPages.json() : { items: [] },
        resServices.ok ? resServices.json() : { items: [] },
        resPosts.ok ? resPosts.json() : { items: [] },
        resCaseStudies.ok ? resCaseStudies.json() : { items: [] },
        resGlobal.ok ? resGlobal.json() : { item: { data: {} } }
      ]);

      setPages(dPages.items || []);
      setServices(dServices.items || []);
      setPosts(dPosts.items || []);
      setCaseStudies(dCaseStudies.items || []);
      
      const g = dGlobal?.item?.data || {};
      setGlobalSEO({
        metaTitle: g.metaTitle || '',
        metaDescription: g.metaDescription || '',
        keywords: g.keywords || '',
        ogImage: g.ogImage || '',
        canonicalUrl: g.canonicalUrl || ''
      });
    } catch (err) {
      toast.error('Failed to load SEO data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const startEdit = (type, item) => {
    setCurrent({ type, data: item });
    setForm({
      metaTitle: item.seo?.metaTitle || '',
      metaDescription: item.seo?.metaDescription || '',
      keywords: Array.isArray(item.seo?.keywords) ? item.seo.keywords.join(', ') : '',
      ogImage: item.seo?.ogImage || '',
      canonicalUrl: item.seo?.canonicalUrl || ''
    });
    setEditOpen(true);
  };

  const onSaveSEO = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const seoPayload = {
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        ogImage: form.ogImage.trim(),
        canonicalUrl: form.canonicalUrl.trim()
      };

      let url = '';
      let method = 'PUT';
      let body = {};

      if (current.type === 'global') {
        url = '/api/settings/system';
        // For global, we merge with existing system settings
        const resGlobal = await fetch('/api/settings/system', { cache: 'no-store' });
        const existing = resGlobal.ok ? (await resGlobal.json())?.item?.data || {} : {};
        body = { ...existing, ...seoPayload, keywords: form.keywords.trim() }; // Keep keywords as string for global settings
      } else {
        const slug = current.data.slug;
        const endpoint = current.type === 'page' ? 'pages' : 
                         current.type === 'service' ? 'services' : 
                         current.type === 'post' ? 'blog' : 'case-studies';
        url = `/api/${endpoint}/${encodeURIComponent(slug)}`;
        // For individual items, we just update the SEO field
        body = { seo: seoPayload };
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Failed to save SEO');
      
      toast.success('SEO updated successfully');
      setEditOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to update SEO');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = (items) => {
    if (!search) return items;
    return items.filter(i => 
      (i.title || i.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (i.slug || '').toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">SEO Manager</h1>
            <p className="text-gray-600 dark:text-slate-300 mt-2">Manage search engine optimization for the entire website</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by title or slug..." 
              className="pl-10 w-full md:w-80 bg-white dark:bg-gray-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-[750px] bg-gray-100 dark:bg-gray-900">
            <TabsTrigger value="pages" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Pages</TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Services</TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2"><Newspaper className="h-4 w-4" /> Blog</TabsTrigger>
            <TabsTrigger value="case-studies" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Case Studies</TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-2"><Globe className="h-4 w-4" /> Global</TabsTrigger>
          </TabsList>

          {/* PAGES TAB */}
          <TabsContent value="pages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Page SEO</CardTitle>
                <CardDescription>Manage metadata for your static pages</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Meta Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8">Loading pages...</TableCell></TableRow>
                    ) : filteredItems(pages).map((page) => (
                      <TableRow key={page._id || page.slug}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="font-mono text-xs">{page.slug}</TableCell>
                        <TableCell className="text-sm truncate max-w-[200px]">{page.seo?.metaTitle || '-'}</TableCell>
                        <TableCell><Badge variant={page.status === 'published' ? 'success' : 'secondary'}>{page.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => startEdit('page', page)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Edit SEO
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SERVICES TAB */}
          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Service SEO</CardTitle>
                <CardDescription>Manage metadata for your service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Meta Title</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8">Loading services...</TableCell></TableRow>
                    ) : filteredItems(services).map((service) => (
                      <TableRow key={service._id || service.slug}>
                        <TableCell className="font-medium">{service.title}</TableCell>
                        <TableCell className="font-mono text-xs">/services/{service.slug}</TableCell>
                        <TableCell className="text-sm truncate max-w-[200px]">{service.seo?.metaTitle || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => startEdit('service', service)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Edit SEO
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BLOG TAB */}
          <TabsContent value="blog" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Post SEO</CardTitle>
                <CardDescription>Manage metadata for your articles</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Meta Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8">Loading blog posts...</TableCell></TableRow>
                    ) : filteredItems(posts).map((post) => (
                      <TableRow key={post._id || post.slug}>
                        <TableCell className="font-medium truncate max-w-[200px]">{post.title}</TableCell>
                        <TableCell className="font-mono text-xs">/blog/{post.slug}</TableCell>
                        <TableCell className="text-sm truncate max-w-[200px]">{post.seo?.metaTitle || '-'}</TableCell>
                        <TableCell><Badge variant={post.status === 'published' ? 'success' : 'secondary'}>{post.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => startEdit('post', post)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Edit SEO
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CASE STUDIES TAB */}
          <TabsContent value="case-studies" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Case Study SEO</CardTitle>
                <CardDescription>Manage metadata for your success stories</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Meta Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8">Loading case studies...</TableCell></TableRow>
                    ) : filteredItems(caseStudies).map((cs) => (
                      <TableRow key={cs._id || cs.slug}>
                        <TableCell className="font-medium truncate max-w-[200px]">{cs.title}</TableCell>
                        <TableCell className="font-mono text-xs">/case-studies/{cs.slug}</TableCell>
                        <TableCell className="text-sm truncate max-w-[200px]">{cs.seo?.metaTitle || '-'}</TableCell>
                        <TableCell><Badge variant={cs.status === 'completed' ? 'success' : 'secondary'}>{cs.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => startEdit('caseStudy', cs)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Edit SEO
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GLOBAL TAB */}
          <TabsContent value="global" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Global SEO Defaults</CardTitle>
                <CardDescription>Default settings for pages that don't have custom SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Meta Title</Label>
                      <Input 
                        value={globalSEO.metaTitle} 
                        onChange={(e) => setGlobalSEO({...globalSEO, metaTitle: e.target.value})}
                        placeholder="VertexTech | Digital Solutions"
                        className="bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Meta Description</Label>
                      <Textarea 
                        value={globalSEO.metaDescription} 
                        onChange={(e) => setGlobalSEO({...globalSEO, metaDescription: e.target.value})}
                        placeholder="Expert technology solutions for your business..."
                        rows={4}
                        className="bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Keywords</Label>
                      <Input 
                        value={globalSEO.keywords} 
                        onChange={(e) => setGlobalSEO({...globalSEO, keywords: e.target.value})}
                        placeholder="cloud, security, software"
                        className="bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default OG Image URL</Label>
                      <Input 
                        value={globalSEO.ogImage} 
                        onChange={(e) => setGlobalSEO({...globalSEO, ogImage: e.target.value})}
                        placeholder="https://example.com/og-image.png"
                        className="bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Canonical URL</Label>
                      <Input 
                        value={globalSEO.canonicalUrl} 
                        onChange={(e) => setGlobalSEO({...globalSEO, canonicalUrl: e.target.value})}
                        placeholder="https://vertextech.com"
                        className="bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div className="pt-4">
                      <Button 
                        onClick={() => startEdit('global', { seo: globalSEO })} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        Update Global SEO Defaults
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit SEO Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle>
                Edit SEO: {current?.type === 'global' ? 'Global Defaults' : current?.data?.title || current?.data?.name}
              </DialogTitle>
              <DialogDescription>
                Customize search engine optimization settings for this {current?.type}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSaveSEO} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input 
                  value={form.metaTitle} 
                  onChange={(e) => setForm({...form, metaTitle: e.target.value})}
                  placeholder="Focus on 50-60 characters"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea 
                  value={form.metaDescription} 
                  onChange={(e) => setForm({...form, metaDescription: e.target.value})}
                  placeholder="Aim for 150-160 characters for best results."
                  rows={4}
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Keywords (comma separated)</Label>
                <Input 
                  value={form.keywords} 
                  onChange={(e) => setForm({...form, keywords: e.target.value})}
                  placeholder="tech, innovation, vertextech"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>OG Image URL</Label>
                <Input 
                  value={form.ogImage} 
                  onChange={(e) => setForm({...form, ogImage: e.target.value})}
                  placeholder="URL to the preview image for social shares"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input 
                  value={form.canonicalUrl} 
                  onChange={(e) => setForm({...form, canonicalUrl: e.target.value})}
                  placeholder="Preferred URL for this page"
                  className="bg-white dark:bg-gray-950"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  {saving ? 'Saving...' : 'Save SEO Settings'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
