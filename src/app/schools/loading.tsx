// Skeleton loading state for schools list page.
// Shows back link, title, filter bar, and card grid placeholders with pulsing animation.

export default function SchoolsLoading() {
  return (
    <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto animate-pulse">
        {/* Back link placeholder */}
        <div className="mb-8">
          <div className="h-5 w-14 bg-vela-border rounded mb-2" />
          <div className="h-8 w-48 bg-vela-border rounded mb-1" />
          <div className="h-4 w-32 bg-vela-border rounded" />
        </div>

        {/* Filter bar placeholder */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="h-10 w-36 bg-vela-border rounded-lg" />
          <div className="h-10 w-36 bg-vela-border rounded-lg" />
          <div className="h-10 w-28 bg-vela-border rounded-lg" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-vela-surface border border-vela-border rounded-lg p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-vela-border rounded" />
                  <div className="h-4 w-24 bg-vela-border rounded" />
                </div>
                <div className="h-10 w-10 bg-vela-border rounded-full ml-2" />
              </div>
              <div className="h-4 w-28 bg-vela-border rounded" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 w-14 bg-vela-border rounded" />
                    <div className="h-4 w-16 bg-vela-border rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
