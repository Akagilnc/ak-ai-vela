import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-vela-heading font-display">
          Vela
        </h1>
        <p className="text-xl text-vela-text-secondary">
          先了解孩子，再规划美本申请
        </p>
        <div className="flex gap-4 justify-center pt-4 flex-wrap">
          <Link
            href="/trait-quiz"
            className="relative px-6 py-3 bg-vela-primary text-white rounded-md font-medium hover:bg-vela-primary-dark transition-colors"
          >
            <span className="absolute -top-2 -right-2 bg-vela-secondary text-vela-heading text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              NEW
            </span>
            特质测评
          </Link>
          <Link
            href="/questionnaire"
            className="px-6 py-3 border border-vela-border text-vela-text rounded-md font-medium hover:bg-vela-surface transition-colors"
          >
            问卷评估
          </Link>
          <Link
            href="/schools"
            className="px-6 py-3 border border-vela-border text-vela-text rounded-md font-medium hover:bg-vela-surface transition-colors"
          >
            浏览学校
          </Link>
        </div>
      </div>
    </main>
  );
}
