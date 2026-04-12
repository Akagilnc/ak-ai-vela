// Skeleton loading state for gap analysis page.
// Shows tier chip placeholders + card skeletons with pulsing animation.

export default function GapsLoading() {
  return (
    <main className="flex-1 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[480px] mx-auto sm:max-w-[720px] lg:max-w-[960px] animate-pulse">
        {/* Back link placeholder */}
        <div className="h-5 w-16 bg-vela-border rounded mb-4" />

        {/* Title placeholder */}
        <div className="h-7 w-64 bg-vela-border rounded mb-2" />
        <div className="h-4 w-40 bg-vela-border rounded mb-5" />

        {/* Progress bar placeholder */}
        <div className="h-1.5 bg-vela-border rounded-full mb-3" />
        <div className="flex gap-3 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-3 w-12 bg-vela-border rounded" />
          ))}
        </div>

        {/* Tier sections */}
        {[1, 2, 3].map((tier) => (
          <div key={tier} className="mb-7">
            {/* Tier chip */}
            <div className="h-7 w-28 bg-vela-border rounded-full mb-3" />

            {/* Card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="bg-vela-surface border border-vela-border rounded-xl p-4 space-y-3"
                >
                  <div className="h-5 w-36 bg-vela-border rounded" />
                  <div className="h-3 w-24 bg-vela-border rounded" />
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((pill) => (
                      <div key={pill} className="h-5 w-16 bg-vela-border rounded-md" />
                    ))}
                  </div>
                  <div className="h-3 w-20 bg-vela-border rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
