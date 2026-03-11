'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { ServiceWorkflowCard } from '@/components/service-workflow-card';
import { useToast } from '@/hooks/use-toast';
import { type Project, type Widget, getProjectById, getWidgetConfig } from '@/lib/project-storage';

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const preview = searchParams.get('preview') === 'true';
    setIsPreview(preview);

    const proj = getProjectById(projectId);
    if (!proj) {
      router.push('/app/projects');
      return;
    }

    if (!preview && !user?.roles?.includes('ADMIN' as any) && proj.id !== (user?.organizationId ?? '')) {
      toast({
        title: '접근 권한이 없습니다',
        description: '이 프로젝트에 접근할 수 있는 권한이 없습니다.',
        variant: 'destructive',
      });
      router.push('/app/projects');
      return;
    }

    setProject(proj);

    const config = getWidgetConfig(projectId);
    if (config) {
      const customerWidgets = config.widgets
        .filter((w) => w.enabled && w.permission === 'customer_view')
        .sort((a, b) => a.order - b.order);
      setWidgets(customerWidgets);
    }
  }, [projectId, router, user, searchParams]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FB]">
        <div className="text-[#6B7280]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/app/projects">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-4 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            프로젝트 목록
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            {project.name}
          </h1>
          <p className="text-[#6B7280]">{project.location}</p>
        </div>

        <div className="mb-6">
          <ServiceWorkflowCard />
        </div>

        {widgets.length === 0 ? (
          <Card className="p-12 bg-white border-[#E5E7EB] text-center">
            <AlertCircle className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              InvaLab에서 대시보드를 구성 중입니다
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              곧 분석 결과가 제공될 예정입니다.
            </p>
            <div className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              설정 진행 중
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {widgets.map((widget) => (
              <Card key={widget.id} className="p-6 bg-white border-[#E5E7EB]">
                <h2 className="text-xl font-bold text-[#111827] mb-2">
                  {widget.title}
                </h2>
                <p className="text-sm text-[#6B7280] mb-4">
                  {widget.description}
                </p>
                <div className="bg-[#F5F7FB] rounded-lg p-8 text-center border border-[#E5E7EB]">
                  <p className="text-sm text-[#6B7280]">
                    위젯 컴포넌트:{' '}
                    <span className="font-mono text-[#118DFF]">
                      {widget.component}
                    </span>
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-2">
                    실제 대시보드 컴포넌트가 여기에 렌더링됩니다
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
