// 404 page for /schools routes.

import Link from "next/link";

export default function SchoolsNotFound() {
  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold text-vela-heading font-display mb-3">
          未找到该页面
        </h1>
        <p className="text-vela-text-secondary mb-8">
          您访问的页面不存在或已被移除。
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] px-6 bg-vela-primary text-white font-medium rounded-lg hover:opacity-95 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
