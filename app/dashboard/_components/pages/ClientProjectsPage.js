import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useAuth } from '../../../lib/auth-context';
import { CheckCircle2, Clock, PlayCircle, FolderOpen, Layers } from 'lucide-react';
import { Progress } from '../../../components/ui/progress';

export default function ClientProjectsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.authUserId && !user?.id && !user?.name) return;
    const load = async () => {
      setLoading(true);
      try {
        const id = user.authUserId || user.id;
        const name = user.name || '';
        const res = await fetch(`/api/case-studies?clientId=${id}&clientName=${encodeURIComponent(name)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'in-progress': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>;
      case 'in-progress': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">My Projects</h1>
          <p className="text-gray-500 mt-2 dark:text-slate-400">Track progress and feature implementation for your active engagements</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map(i => (
              <Card key={i} className="animate-pulse h-64 bg-slate-50 dark:bg-slate-900/50" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex flex-col items-center gap-3">
              <FolderOpen className="h-12 w-12 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No active projects</h3>
              <p className="text-slate-500 max-w-xs mx-auto">You don't have any active projects assigned to your account yet.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-8">
            {items.map((project) => (
              <Card key={project._id || project.id} className="overflow-hidden border dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">{project.title}</CardTitle>
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                        <Layers className="h-4 w-4" /> {project.technologies?.join(' • ')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Progress</span>
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{project.progress || 0}%</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Progress value={project.progress || 0} className="h-2.5 bg-slate-200 dark:bg-slate-800" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Project Overview
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Features & Implementation
                      </h4>
                      <div className="grid gap-3">
                        {project.features && project.features.length > 0 ? (
                          project.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center justify-between p-3 rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm transition-transform hover:translate-x-1 duration-200">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-500">
                                  {feature.status.replace('-', ' ')}
                                </span>
                                {getStatusIcon(feature.status)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-slate-500 italic py-2">No specific features listed yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
