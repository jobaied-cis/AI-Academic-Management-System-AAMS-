import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, CalendarDays, Bell, MessageSquare, TrendingUp,
  HelpCircle, UserCheck, FileText, Users, ChevronLeft, ChevronRight,
  GraduationCap, BookOpen, ClipboardList, LogOut, Cpu, Sparkles,
  User, Brain, BellRing
} from "lucide-react";

const studentNav = [
  { label: "Dashboard",       path: "/student/dashboard",       icon: LayoutDashboard },
  { label: "Schedule",        path: "/student/schedule",        icon: CalendarDays    },
  { label: "Notices",         path: "/student/notices",         icon: Bell            },
  { label: "Queries",         path: "/student/queries",         icon: MessageSquare   },
  { label: "Progress",        path: "/student/progress",        icon: TrendingUp      },
  { label: "FAQ & AI Chat",   path: "/student/faq",             icon: HelpCircle      },
  { label: "Advising",        path: "/student/advising",        icon: UserCheck       },
  { label: "Documents",       path: "/student/documents",       icon: FileText        },
  { label: "AI Insights",     path: "/student/recommendations", icon: Brain           },
  { label: "Notifications",   path: "/student/notifications",   icon: BellRing        },
  { label: "Profile",         path: "/student/profile",         icon: User            },
];

const facultyNav = [
  { label: "Dashboard",   path: "/faculty/dashboard",  icon: LayoutDashboard },
  { label: "Queries",     path: "/faculty/queries",    icon: MessageSquare   },
  { label: "Notices",     path: "/faculty/notices",    icon: Bell            },
  { label: "Students",    path: "/faculty/students",   icon: Users           },
  { label: "Scheduling",  path: "/faculty/scheduling", icon: CalendarDays    },
  { label: "Documents",   path: "/faculty/documents",  icon: FileText        },
  { label: "Profile",     path: "/faculty/profile",    icon: User            },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user?.role === "student" ? studentNav : facultyNav;
  const initials = user?.name?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => { logout(); navigate("/login"); };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 flex-shrink-0 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-glow-blue">
          <Cpu size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-display font-bold text-white text-sm leading-none">AAMS</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI Academic Management System</p>
          </div>
        )}
      </div>

      {/* User info */}
      <div className={`mx-3 mt-4 mb-2 p-3 rounded-xl glass-card flex-shrink-0 ${collapsed ? "flex justify-center" : "flex items-center gap-3"}`}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-display font-bold">
          {initials}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate leading-snug">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user?.role === "student" ? "bg-blue-500/15 text-blue-400" : "bg-amber-500/15 text-amber-400"}`}>
              {user?.role === "student" ? "Student" : "Faculty"}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="text-[10px] font-display font-semibold uppercase tracking-widest text-slate-600 px-3 py-2">
            Navigation
          </p>
        )}
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={({ isActive }) =>
              `nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? "nav-active" : "text-slate-400"
              } ${collapsed ? "justify-center" : ""}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-white/5 pt-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-space-800 border-r border-white/5 relative transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[68px]" : "w-[230px]"}`}
        style={{ minHeight: "100vh" }}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-space-700 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 h-full w-[230px] bg-space-800 border-r border-white/5 z-50 animate-slide-in-left overflow-y-auto">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
