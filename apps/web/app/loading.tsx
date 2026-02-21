export default function Loading(): JSX.Element {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <div className="h-8 w-1/3 animate-pulse rounded bg-[#e8dccb]" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-2xl bg-[#efe5d8]" />
        ))}
      </div>
    </div>
  );
}
