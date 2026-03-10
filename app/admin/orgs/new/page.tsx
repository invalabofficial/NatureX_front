'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Organization,
  OrganizationSize,
  OrganizationStatus,
  OrganizationType,
} from '@/lib/data-type';
import { clsx } from 'clsx';
import debounce from "debounce";

export default function NewOrgPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    type: OrganizationType;
    size: OrganizationSize;
    contact: string;
    website: string;
  }>({
    name: '',
    type: OrganizationType.COMPANY,
    size: OrganizationSize.SOLO,
    contact: '',
    website: '',
  });
  const [existenceBefore, setExistenceBefore] = useState<boolean | null>(null);
  const [existenceCheckLoading, setExistenceCheckLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      new URL('/organizations', process.env.NEXT_PUBLIC_NATUREX_BACKEND),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      },
    );

    if (!res.ok) {
      console.error('조직 생성 실패', await res.text());
      return;
    }

    router.push('/admin/orgs');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-white border-[#E5E7EB] shadow-lg">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin/orgs">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                돌아가기
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[#118DFF]/10 rounded-lg">
              <Building2 className="w-6 h-6 text-[#118DFF]" />
            </div>
            <h1 className="text-3xl font-bold text-[#111827]">새 조직 생성</h1>
          </div>
          <p className="text-[#6B7280] mb-8">
            조직은 프로젝트와 서비스 제공의 기본 단위입니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  조직명 <span className="text-red-500">*</span>
                </Label>
                <div className={"flex flex-row"}>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData({ ...formData, name: newName });
                      debounce(() => {
                        setExistenceCheckLoading(true);
                        (async () => {
                          const res = await fetch(new URL(`organization/existence?name=${formData.name}`, process.env.NEXT_PUBLIC_NATUREX_BACKEND), {
                            method: 'GET',
                          });
                          if (!res.ok) {
                            console.error('existence call failed');
                          }

                          const json = await res.json();
                          setExistenceBefore(json.existence);
                          setExistenceCheckLoading(false);
                        })();
                      }, 1000);
                    }}
                    placeholder="예: 서울시청"
                    required
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
                  />
                  <Button>
                    중복 확인
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgId" className="text-sm font-medium">
                  업종 <span className="text-red-500">*</span>
                </Label>
                <div className="space-x-2">
                  {Object.values(OrganizationType).map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      className={clsx(
                        'text-xs rounded-lg border border-[#E5E7EB]',
                        formData.type == type
                          ? 'border-3 border-[#118DFF]'
                          : 'text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#118DFF]',
                      )}
                      onClick={() => {
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            type,
                          };
                        });
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  규모 <span className="text-red-500">*</span>
                </Label>
                <div className="space-x-2">
                  {Object.values(OrganizationSize).map((size) => (
                    <Button
                      key={size}
                      size="sm"
                      className={clsx(
                        'text-xs rounded-lg border border-[#E5E7EB]',
                        formData.size == size
                          ? 'border-3 border-[#118DFF]'
                          : 'text-[#4B5563] hover:bg-[#F5F7FB] hover:text-[#118DFF]',
                      )}
                      onClick={() => {
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            size,
                          };
                        });
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-sm font-medium">
                    담당자
                  </Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    placeholder="예: 홍길동"
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    웹사이트
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="website@example.com"
                    className="bg-white border-[#E5E7EB] placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                className="bg-[#118DFF] text-white hover:bg-[#118DFF] hover:text-white"
              >
                생성
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
