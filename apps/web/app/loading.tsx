export default function Loading(): JSX.Element {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="h-7 w-28 animate-pulse rounded-lg bg-[#E8DDD0]" />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
            <div className="aspect-square animate-pulse bg-[#F0EAE0]" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#E8DDD0]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[#F0EAE0]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
