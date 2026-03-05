import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { mockMediaFiles } from '../../lib/mock-data';

export default function MediaPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-2">Upload and manage media files</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {mockMediaFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="pt-4">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mb-3">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <ImageIcon className="h-3 w-3 mr-1" /> View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
