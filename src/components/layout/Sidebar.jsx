import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Satellite, 
  Mountain, 
  Cpu, 
  Map, 
  TrendingUp, 
  AlertOctagon, 
  BarChart3, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Hexagon
} from 'lucide-react';
import { useApp } from '../../state/AppContext';

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Input Data', path: '/input-data', icon: UploadCloud },
    { name: 'Satellite Processing', path: '/satellite', icon: Satellite },
    { name: 'Geological Analysis', path: '/geology', icon: Mountain },
    { name: 'AI / ML Prediction', path: '/prediction', icon: Cpu },
    { name: 'Interactive Map', path: '/map', icon: Map },
    { name: 'Supply & Demand', path: '/supply-demand', icon: TrendingUp },
    { name: 'Shortfall Forecast', path: '/shortfall-forecast', icon: AlertOctagon },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#24352B] border-r border-[#1a2c20] transition-all duration-200 z-30 select-none ${
        sidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-3.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded bg-[#B56B32] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Hexagon className="w-5 h-5 fill-white/20" />
          </div>
          {!sidebarCollapsed && (
            <div className="leading-tight">
              <span className="font-bold text-xs tracking-wider text-white font-mono block truncate">
                MANGANESE AI
              </span>
              <span className="text-[10px] text-white/60 font-mono tracking-widest block uppercase">
                INTELLIGENCE
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={sidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2.5 py-2 rounded text-xs font-mono transition-all group ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold border-l-2 border-[#B56B32] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border-l-2 border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-white group-[.active]:text-[#B56B32]" />
              {!sidebarCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <div className="p-2 border-t border-white/10 flex items-center justify-end">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full py-1.5 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2 text-[11px] font-mono w-full justify-between px-2">
              <span>COLLAPSE</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
