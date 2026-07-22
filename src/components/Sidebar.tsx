import { NavLink, useLocation } from "react-router-dom";
import { CalendarDays, ListTodo, Dumbbell, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/calendar", label: "日历", icon: CalendarDays, abbr: "CAL" },
  { to: "/plans", label: "计划", icon: ListTodo, abbr: "PLN" },
];

export default function Sidebar() {
  const location = useLocation();
  // 训练详情页时高亮日历
  const isTraining = location.pathname.startsWith("/train");

  return (
    <>
      {/* 桌面侧边栏 */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 md:left-0 md:border-r md:border-ink-700/60 md:bg-ink-900/40 md:backdrop-blur-xl md:z-20">
        <div className="flex items-center gap-3 px-6 h-20 border-b border-ink-700/60">
          <div className="relative">
            <div className="h-10 w-10 rounded-lg bg-volt flex items-center justify-center shadow-volt">
              <Dumbbell className="h-5 w-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-ember ring-2 ring-ink-900" />
          </div>
          <div>
            <div className="font-display text-2xl leading-none tracking-wider text-ink-50">
              FORGE
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-400 mt-1">
              Train · Log · Grow
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-ink-800 text-ink-50 border border-ink-600"
                    : "text-ink-300 hover:bg-ink-800/50 hover:text-ink-100 border border-transparent"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-volt" : "text-ink-400 group-hover:text-ink-200"
                    )}
                    strokeWidth={2}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-volt" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <NavLink
            to="/calendar"
            className={cn(
              "group flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
              isTraining
                ? "bg-ink-800 text-ink-50 border border-ink-600"
                : "text-ink-300 hover:bg-ink-800/50 hover:text-ink-100 border border-transparent"
            )}
          >
            <Flame
              className={cn(
                "h-5 w-5 transition-colors",
                isTraining ? "text-ember" : "text-ink-400 group-hover:text-ink-200"
              )}
              strokeWidth={2}
            />
            <span className="font-medium">训练</span>
            {isTraining && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-ember" />
            )}
          </NavLink>
        </nav>

        <div className="px-6 py-5 border-t border-ink-700/60">
          <div className="text-[10px] uppercase tracking-[0.2em] text-ink-400 mb-1">
            本地存储
          </div>
          <div className="text-xs text-ink-300 leading-relaxed">
            数据保存在你的浏览器，关闭不会被清除
          </div>
        </div>
      </aside>

      {/* 移动端底部 Tab */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-ink-900/95 backdrop-blur-xl border-t border-ink-700/60 px-2 py-2 flex justify-around">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-colors",
                isActive ? "text-volt" : "text-ink-400"
              )
            }
          >
            <item.icon className="h-5 w-5" strokeWidth={2} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {item.abbr}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
