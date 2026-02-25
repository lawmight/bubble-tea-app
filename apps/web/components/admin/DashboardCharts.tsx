'use client';

interface StatusCount {
  status: string;
  count: number;
}

interface DailyRevenue {
  date: string;
  label: string;
  totalInCents: number;
}

interface DashboardChartsProps {
  ordersByStatus: StatusCount[];
  revenueLast7Days: DailyRevenue[];
}

const STATUS_BAR_COLORS: Record<string, string> = {
  pending: '#8C7B6B',
  preparing: '#C4A35A',
  ready: '#8B9F82',
  completed: '#6B8A5E',
  cancelled: '#A0524F',
};

const STATUS_BG_COLORS: Record<string, string> = {
  pending: 'rgba(140,123,107,0.12)',
  preparing: 'rgba(196,163,90,0.12)',
  ready: 'rgba(139,159,130,0.12)',
  completed: 'rgba(139,159,130,0.12)',
  cancelled: 'rgba(160,82,79,0.12)',
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

function OrdersByStatusChart({ data }: { data: StatusCount[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5">
      <h3 className="mb-4 font-display text-lg font-semibold text-[#6B5344]">
        Orders by Status
      </h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-3">
            <span className="w-20 text-right text-xs font-medium capitalize text-[#8C7B6B]">
              {item.status}
            </span>
            <div className="relative flex-1 h-7 rounded-full overflow-hidden" style={{ backgroundColor: STATUS_BG_COLORS[item.status] ?? '#f5f0e8' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max((item.count / maxCount) * 100, item.count > 0 ? 4 : 0)}%`,
                  backgroundColor: STATUS_BAR_COLORS[item.status] ?? '#8C7B6B',
                }}
              />
            </div>
            <span className="w-8 text-xs font-bold text-[#6B5344]">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueLast7DaysChart({ data }: { data: DailyRevenue[] }) {
  const maxRevenue = Math.max(...data.map((d) => d.totalInCents), 1);
  const barWidth = 40;
  const gap = 12;
  const chartHeight = 140;
  const svgWidth = data.length * (barWidth + gap) - gap;

  return (
    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5">
      <h3 className="mb-4 font-display text-lg font-semibold text-[#6B5344]">
        Revenue Last 7 Days
      </h3>
      {data.every((d) => d.totalInCents === 0) ? (
        <p className="py-8 text-center text-sm text-[#8C7B6B]">No revenue data yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <svg
            width={svgWidth + 20}
            height={chartHeight + 40}
            viewBox={`0 0 ${svgWidth + 20} ${chartHeight + 40}`}
            className="mx-auto"
          >
            {data.map((day, i) => {
              const barHeight = Math.max(
                (day.totalInCents / maxRevenue) * chartHeight,
                day.totalInCents > 0 ? 4 : 0,
              );
              const x = i * (barWidth + gap) + 10;
              const y = chartHeight - barHeight;

              return (
                <g key={day.date}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={6}
                    fill="#8B9F82"
                    opacity={0.85}
                  />
                  {day.totalInCents > 0 && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      className="text-[10px] font-semibold"
                      fill="#6B5344"
                    >
                      {formatCents(day.totalInCents)}
                    </text>
                  )}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 16}
                    textAnchor="middle"
                    className="text-[10px]"
                    fill="#8C7B6B"
                  >
                    {day.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

export function DashboardCharts({ ordersByStatus, revenueLast7Days }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <OrdersByStatusChart data={ordersByStatus} />
      <RevenueLast7DaysChart data={revenueLast7Days} />
    </div>
  );
}
