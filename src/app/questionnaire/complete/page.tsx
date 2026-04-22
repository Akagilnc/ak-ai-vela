"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CompleteContent() {
  const searchParams = useSearchParams();
  const childName = searchParams.get("name") || "孩子";
  const studentId = searchParams.get("studentId") || "";

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-vela-heading font-display">
          {childName} 的问卷已完成
        </h1>
        <p className="text-base text-vela-text-secondary">
          下一步可以查看 {childName} 与各学校的差距分析。
        </p>

        <div className="bg-vela-surface border border-vela-border rounded-lg p-4 text-sm text-vela-text font-mono">
          <p>问卷数据已保存</p>
        </div>

        <div className="space-y-3 pt-2">
          {studentId && (
            <Link
              href={`/questionnaire/complete/gaps?studentId=${encodeURIComponent(studentId)}`}
              className="block min-h-[44px] px-6 py-3 text-base font-medium text-white bg-vela-primary rounded-md hover:bg-vela-primary-dark transition-colors"
            >
              查看差距分析 →
            </Link>
          )}
          <Link
            href="/schools"
            className={`block min-h-[44px] px-6 py-3 text-base font-medium transition-colors ${
              studentId
                ? "text-vela-primary border border-vela-primary rounded-md hover:bg-vela-primary hover:text-white"
                : "text-white bg-vela-primary rounded-md hover:bg-vela-primary-dark"
            }`}
          >
            浏览学校推荐 →
          </Link>
          <Link
            href="/"
            className="block text-sm text-vela-text-secondary hover:text-vela-primary transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={null}>
      <CompleteContent />
    </Suspense>
  );
}
