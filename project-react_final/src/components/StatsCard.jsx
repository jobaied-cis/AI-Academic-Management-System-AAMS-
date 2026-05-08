import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCard({ label, value, sub, icon: Icon, color = "blue", trend, trendValue }) {
  const colorMap = {
    blue:    { bg: "from-blue-500/20 to-blue-600/5",   icon: "bg-blue-500/15 text-blue-400",   border: "border-blue-500/20",  glow: "hover:shadow-glow-blue"  },
    cyan:    { bg: "from-cyan-500/20 to-cyan-600/5",   icon: "bg-cyan-500/15 text-cyan-400",   border: "border-cyan-500/20",  glow: "hover:shadow-glow-cyan"  },
    amber:   { bg: "from-amber-500/20 to-amber-600/5", icon: "bg-amber-500/15 text-amber-400", border: "border-amber-500/20", glow: "hover:shadow-glow-amber" },
    emerald: { bg: "from-emerald-500/20 to-emerald-600/5", icon: "bg-emerald-500/15 text-emerald-400", border: "border-emerald-500/15", glow: "" },
    rose:    { bg: "from-rose-500/20 to-rose-600/5",   icon: "bg-rose-500/15 text-rose-400",   border: "border-rose-500/15",  glow: "" },
    violet:  { bg: "from-violet-500/20 to-violet-600/5", icon: "bg-violet-500/15 text-violet-400", border: "border-violet-500/15", glow: "" },
  };

  const c = colorMap[color] || colorMap.blue;

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-500";

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-5 border ${c.border} relative overflow-hidden transition-all duration-300 ${c.glow}`}>
      {/* Gradient blob */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-60 pointer-events-none`} />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">{label}</p>
          <p className="font-display text-2xl font-bold text-white leading-none">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-1.5">{sub}</p>}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <TrendIcon size={12} />
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
