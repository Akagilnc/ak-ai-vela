"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  loadDraft,
  clearDraft,
  useQuestionnaire,
  type DraftInfo,
} from "@/components/questionnaire/questionnaire-provider";

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const { setStep } = useQuestionnaire();
  const [draft, setDraft] = useState<DraftInfo | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const existing = loadDraft();
    setDraft(existing);
    setChecked(true);
  }, []);

  const handleResume = () => {
    if (draft) {
      setStep(draft.currentStep);
      router.push(`/questionnaire/step/${draft.currentStep}`);
    }
  };

  const handleFreshStart = () => {
    clearDraft();
    setStep(1);
    router.push("/questionnaire/step/1");
  };

  if (!checked) return null; // Avoid flash

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-vela-heading font-display">
          Vela 美国本科规划问卷
        </h1>
        <p className="text-base text-vela-text-secondary">
          5 分钟完成，我们会据此生成可执行的申请差距分析
        </p>

        {/* Draft resume card */}
        {draft && (
          <div className="bg-vela-surface border border-vela-border rounded-lg p-5 text-left space-y-3">
            <p className="text-sm text-vela-text">
              上次填写进度: 第 {draft.currentStep}/8 步
            </p>
            <p className="text-sm text-vela-muted">
              保存时间: {formatTimeAgo(draft.savedAt)}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleResume}
                className="flex-1 min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-vela-primary rounded-md hover:bg-vela-primary-dark transition-colors"
              >
                继续填写 →
              </button>
              <button
                type="button"
                onClick={handleFreshStart}
                className="min-h-[44px] px-4 py-2 text-sm text-vela-text-secondary border border-vela-border rounded-md hover:bg-vela-surface transition-colors"
              >
                重新开始
              </button>
            </div>
          </div>
        )}

        {/* Start button (when no draft) */}
        {!draft && (
          <button
            type="button"
            onClick={handleFreshStart}
            className="min-h-[44px] px-8 py-3 text-base font-medium text-white bg-vela-primary rounded-md hover:bg-vela-primary-dark transition-colors"
          >
            开始填写
          </button>
        )}

        <div className="pt-2">
          <Link
            href="/"
            className="text-sm text-vela-text-secondary hover:text-vela-primary transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
