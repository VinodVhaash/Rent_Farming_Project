const StatsCard = ({ icon, label, value, color = 'green', trend = '' }) => {
  const colorMap = {
    green: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-6 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-0.5 sm:mb-1 truncate">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-gray-400 mt-1 truncate">{trend}</p>
          )}
        </div>
        <div
          className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white text-base sm:text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
