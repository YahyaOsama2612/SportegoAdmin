export function StatCard({ title, value, icon: Icon, change, trend = 'neutral' }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs hover:shadow-md hover:border-purple-200 transition group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-purple-900/70 tracking-wide uppercase">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-purple-950 tracking-tight">{value}</span>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend === 'up'
                ? 'bg-emerald-50 text-emerald-700'
                : trend === 'down'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-purple-50 text-purple-700'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

