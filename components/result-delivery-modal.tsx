'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Project } from '@/lib/data-service';

interface ResultDeliveryModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function ResultDeliveryModal({
  project,
  isOpen,
  onClose,
  isAdmin,
}: ResultDeliveryModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
      <Card className="w-full max-w-xl p-6 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-[#111827]">
            결과 납품: {project.name}
          </div>
        </div>

        <div className="text-sm text-[#6B7280] space-y-2">
          <div>
            <span className="font-medium">위치:</span> {project.location}
          </div>
          <div>
            <span className="font-medium">테마:</span> {project.theme}
          </div>
          <div>
            <span className="font-medium">현재 단계:</span>{' '}
            {project.deliveryStage}
          </div>
        </div>

        {isAdmin && (
          <div className="text-sm text-[#6B7280] border border-[#E5E7EB] rounded p-3">
            납품 관리 기능은 준비 중입니다.
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </Card>
    </div>
  );
}
