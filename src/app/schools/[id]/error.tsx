"use client";

// Error boundary for /schools/[id] route.

export default function SchoolDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-[#E63946]/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#E63946]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-vela-heading font-display mb-2">
          加载学校详情时出错
        </h1>
        <p className="text-vela-text-secondary mb-8">
          请稍后重试，或返回学校列表。
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center min-h-[44px] px-6 bg-vela-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity"
          >
            重试
          </button>
          <a
            href="/schools"
            className="inline-flex items-center justify-center min-h-[44px] px-6 border border-vela-border text-vela-text-secondary font-medium rounded-lg hover:bg-vela-surface transition-colors"
          >
            返回学校列表
          </a>
        </div>
      </div>
    </main>
  );
}
