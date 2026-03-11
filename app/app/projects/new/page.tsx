'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TrendingDown, TrendingUp, Leaf, Building2 } from 'lucide-react';
import { getOrgs, createOrg, type Org } from '@/lib/data-type';

const projectTypes = [
  {
    id: 'efficiency',
    title: '운영비 절감',
    icon: TrendingDown,
    description:
      'AI 기반 분석으로 자연자산 유지관리 우선순위를 자동화하여 불필요한 비용과 작업을 줄입니다.',
  },
  {
    id: 'asset',
    title: '자산 가치 향상',
    icon: TrendingUp,
    description:
      '생산성·바이오매스·탄소 지표를 기반으로 자연자산의 장기 가치를 정량화합니다.',
  },
  {
    id: 'biodiversity',
    title: '생물다양성 프로젝트',
    icon: Leaf,
    description:
      '생물다양성 상태를 분석하고 보전·복원 성과를 체계적으로 관리합니다. 결과는 ESG·TNFD 공시로 연결될 수 있습니다.',
  },
];

export default function NewProjectRequestPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<
    'efficiency' | 'asset' | 'biodiversity' | ''
  >('');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [organizations, setOrganizations] = useState<Org[]>([]);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');

  useEffect(() => {
    if (!user) return;

    if (user.roles?.includes('ADMIN' as any)) {
      const orgs = getOrgs();
      setOrganizations(orgs);
    } else if (!user.roles?.includes('ADMIN' as any) && user.organizationId) {
      setSelectedOrgId(user.organizationId);
    }
  }, [user]);

  const isFormValid = () => {
    if (user?.roles?.includes('ADMIN' as any)) {
      return (
        projectName.trim() !== '' &&
        location.trim() !== '' &&
        selectedTheme !== '' &&
        selectedOrgId !== ''
      );
    }
    return (
      projectName.trim() !== '' &&
      location.trim() !== '' &&
      selectedTheme !== ''
    );
  };

  const handleCreateNewOrg = () => {
    if (!newOrgName.trim()) return;

    const newOrg = createOrg(newOrgName);
    setOrganizations([...organizations, newOrg]);
    setSelectedOrgId(newOrg.id);
    setShowNewOrgModal(false);
    setNewOrgName('');
  };

  const handleSubmit = () => {
    if (!isFormValid() || !user) return;

    const projectId = `proj-${Date.now()}`;
    const orgId = !user.roles?.includes('ADMIN' as any) ? user.organizationId! : selectedOrgId;

    const existingProjects = JSON.parse(
      localStorage.getItem('naturex_projects') || '[]',
    );
    const newProject = {
      projectId,
      orgId,
      name: projectName,
      theme: selectedTheme,
      location,
      status: 'planning',
      createdAt: new Date().toISOString(),
    };

    existingProjects.push(newProject);
    localStorage.setItem('naturex_projects', JSON.stringify(existingProjects));

    router.push(`/app/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] pb-24">
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-6">
        <h1 className="text-2xl font-semibold text-[#111827] mb-2">
          새 프로젝트 생성
        </h1>
        <p className="text-sm text-[#374151]">
          프로젝트 정보를 입력하고 대시보드를 시작하세요
        </p>
      </div>

      <div className="px-8 py-8 max-w-4xl mx-auto space-y-6">
        {/* Admin: Customer Org Selection */}
        {user?.roles?.includes('ADMIN' as any) && (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <h2 className="text-base font-semibold text-[#111827] mb-4">
              고객사 선택 *
            </h2>
            <div className="space-y-4">
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="border-[#E5E7EB] bg-white">
                  <SelectValue placeholder="고객사를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E5E7EB] shadow-lg z-[9999]">
                  {organizations.map((org) => (
                    <SelectItem
                      key={org.id}
                      value={org.id}
                      className="hover:bg-[#F3F4F6]"
                    >
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewOrgModal(true)}
                className="w-full border-[#E5E7EB] text-[#118DFF] hover:bg-[#118DFF]/5"
              >
                <Building2 className="w-4 h-4 mr-2" />새 고객사 생성
              </Button>
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111827] mb-4">
            프로젝트 기본 정보
          </h2>

          <div className="space-y-5">
            <div>
              <Label
                htmlFor="project-name"
                className="text-sm text-[#374151] mb-2 block"
              >
                프로젝트 이름 *
              </Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="예: 서울숲 생태복원 프로젝트"
                className="border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF]"
              />
            </div>

            <div>
              <Label
                htmlFor="location"
                className="text-sm text-[#374151] mb-2 block"
              >
                프로젝트 위치 *
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 서울시 성동구"
                className="border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF]"
              />
            </div>

            <div>
              <Label className="text-sm text-[#374151] mb-3 block">
                프로젝트 유형 선택 *
              </Label>
              <RadioGroup
                value={selectedTheme}
                onValueChange={(val) => setSelectedTheme(val as any)}
              >
                <div className="space-y-3">
                  {projectTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedTheme === type.id;

                    return (
                      <div
                        key={type.id}
                        className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-[#118DFF]/40 ${
                          isSelected
                            ? 'border-[#118DFF] shadow-sm'
                            : 'border-[#E5E7EB]'
                        }`}
                        onClick={() => setSelectedTheme(type.id as any)}
                      >
                        <div className="flex items-start gap-4">
                          <RadioGroupItem
                            value={type.id}
                            id={type.id}
                            className="mt-1"
                          />
                          <div className="w-10 h-10 rounded-lg bg-[#118DFF]/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-[#118DFF]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label
                              htmlFor={type.id}
                              className="font-semibold text-[#111827] text-sm mb-1 block cursor-pointer"
                            >
                              {type.title}
                            </label>
                            <p className="text-xs text-[#6B7280] leading-relaxed">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/app/projects')}
            className="border-[#E5E7EB] text-[#374151] hover:bg-slate-50"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="bg-[#118DFF] hover:bg-[#0d6ecc] text-white disabled:opacity-50 disabled:cursor-not-allowed px-8"
          >
            프로젝트 생성
          </Button>
        </div>
      </div>

      {/* New Org Modal */}
      <Dialog open={showNewOrgModal} onOpenChange={setShowNewOrgModal}>
        <DialogContent className="bg-white border-[#E5E7EB]">
          <DialogHeader>
            <DialogTitle className="text-[#111827]">새 고객사 생성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="new-org-name" className="text-[#374151]">
                고객사 이름
              </Label>
              <Input
                id="new-org-name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="예: ABC 기업"
                className="border-[#E5E7EB]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowNewOrgModal(false);
                  setNewOrgName('');
                }}
                className="border-[#E5E7EB]"
              >
                취소
              </Button>
              <Button
                onClick={handleCreateNewOrg}
                disabled={!newOrgName.trim()}
                className="bg-[#118DFF] hover:bg-[#0D6FCC]"
              >
                생성
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
