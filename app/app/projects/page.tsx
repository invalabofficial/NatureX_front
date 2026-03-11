'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  FolderKanban,
  Gauge,
  TrendingUp,
  Leaf,
  FolderOpen,
  MapPin,
  Trash2,
} from 'lucide-react';
import {
  getProjects,
  deleteProject,
  customerOrgMap,
  themeLabels,
  type Project,
} from '@/lib/data-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const themeConfig = {
  efficiency: {
    label: themeLabels.efficiency,
    icon: Gauge,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  asset: {
    label: themeLabels.asset,
    icon: TrendingUp,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  biodiversity: {
    label: themeLabels.biodiversity,
    icon: Leaf,
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
  },
};

const statusConfig = {
  pending: { label: '요청', color: 'bg-yellow-100 text-yellow-700' },
  analyzing: { label: '분석 중', color: 'bg-blue-100 text-blue-700' },
  delivering: { label: '납품 중', color: 'bg-orange-100 text-orange-700' },
  executing: { label: '실행 중', color: 'bg-purple-100 text-purple-700' },
  completed: { label: '완료', color: 'bg-green-100 text-green-700' },
};

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getProjects().then((loadedProjects) => {
      setProjects(loadedProjects);
    });
  }, [user]);

  const handleDeleteClick = (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!projectToDelete) return;

    try {
      deleteProject(projectToDelete);
      setProjects((prev) =>
        prev.filter((p) => p.projectId !== projectToDelete),
      );
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('[v0] Failed to delete project:', error);
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const canDeleteProject = (project: Project) => {
    if (user?.roles.includes('ADMIN' as any)) return true;
    if (user?.roles.includes('USER' as any) && user.organizationId === project.orgId) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] mb-1">
              내 프로젝트
            </h1>
            <p className="text-sm text-[#6B7280]">
              InvaLab에서 구성한 프로젝트를 확인하고 대시보드를 탐색하세요
            </p>
          </div>
          <Button
            onClick={() => router.push('/app/projects/new')}
            className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white"
          >
            새 프로젝트 생성
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="p-16 bg-white border-[#E5E7EB] text-center">
            <FolderOpen className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              프로젝트가 없습니다
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              홈으로 이동해 목적에 맞는 프로젝트를 생성해주세요.
            </p>
            <Button
              onClick={() => router.push('/app')}
              variant="outline"
              className="border-[#118DFF] text-[#118DFF] hover:bg-blue-50"
            >
              홈으로
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const theme =
                themeConfig[project.theme as keyof typeof themeConfig] ??
                themeConfig.efficiency;
              const ThemeIcon = theme.icon;
              const status =
                statusConfig[project.deliveryStage as keyof typeof statusConfig] ??
                statusConfig.pending;
              const customerLabel =
                user?.roles.includes('ADMIN' as any)
                  ? customerOrgMap[project.orgId as keyof typeof customerOrgMap]
                  : null;

              return (
                <Link
                  key={project.projectId}
                  href={`/app/projects/${project.projectId}`}
                >
                  <Card className="p-5 bg-white border-[#E5E7EB] hover:border-[#118DFF] hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <FolderKanban className="w-5 h-5 text-[#118DFF]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="text-base font-semibold text-[#111827]">
                              {project.name}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${theme.bgColor} ${theme.textColor} ${theme.borderColor}`}
                            >
                              <ThemeIcon className="w-3 h-3" />
                              {theme.label}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${status.color}`}
                            >
                              {status.label}
                            </span>
                            {customerLabel && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                                {customerLabel}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[#6B7280] mb-1">
                            <MapPin className="w-4 h-4" />
                            {project.location}
                          </div>
                          <div className="text-xs text-[#9CA3AF]">
                            생성:{' '}
                            {new Date(project.createdAt).toLocaleDateString(
                              'ko-KR',
                            )}
                          </div>
                        </div>
                      </div>
                      {canDeleteProject(project) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) =>
                            handleDeleteClick(project.projectId, e)
                          }
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>프로젝트 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수
                없으며, 프로젝트의 모든 데이터와 위젯 설정이 삭제됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
