'use client'
import React from 'react';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';

export function SEOFields({ data, onChange }) {
  return (
    <Accordion type="single" collapsible className="w-full sm:col-span-2">
      <AccordionItem value="seo" className="border-none">
        <AccordionTrigger className="hover:no-underline py-2">
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Search Engine Optimization (SEO) Settings</span>
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                value={data?.metaTitle || ''}
                onChange={(e) => onChange({ ...data, metaTitle: e.target.value })}
                placeholder="Page title for search results"
              />
              <p className="text-[10px] text-slate-500 italic">Recommended: 50-60 characters</p>
            </div>
            <div className="space-y-2">
              <Label>OG Image URL</Label>
              <Input
                value={data?.ogImage || ''}
                onChange={(e) => onChange({ ...data, ogImage: e.target.value })}
                placeholder="https://example.com/og-image.png"
              />
              <p className="text-[10px] text-slate-500 italic">Social share preview image</p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Meta Description</Label>
              <Textarea
                rows={2}
                value={data?.metaDescription || ''}
                onChange={(e) => onChange({ ...data, metaDescription: e.target.value })}
                placeholder="Brief summary for search engines"
              />
              <p className="text-[10px] text-slate-500 italic">Recommended: 150-160 characters</p>
            </div>
            <div className="space-y-2">
              <Label>Keywords (comma separated)</Label>
              <Input
                value={Array.isArray(data?.keywords) ? data.keywords.join(', ') : data?.keywords || ''}
                onChange={(e) => onChange({ ...data, keywords: e.target.value })}
                placeholder="keyword1, keyword2"
              />
            </div>
            <div className="space-y-2">
              <Label>Canonical URL</Label>
              <Input
                value={data?.canonicalUrl || ''}
                onChange={(e) => onChange({ ...data, canonicalUrl: e.target.value })}
                placeholder="https://vertextech.com/page"
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
