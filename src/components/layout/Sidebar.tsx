import React from 'react';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Building2,
  ShieldCheck,
  CheckSquare,
  Sparkles,
  PlusCircle,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { NavigationTab } from '../../types';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedContactId,
    setSelectedOrgId,
    setSelectedGiftId,
    setSelectedBoardMemberId,
    setSelectedTaskId,
    setSelectedMeetingId,
    currentUser,
    openQuickAdd,
    setAiDrawerOpen,
    kpiStats,
  } = useCRM();

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: Users,
      badge: kpiStats.totalContactsCount,
    },
    {
      id: 'gifts',
      label: 'Gifts',
      icon: HeartHandshake,
      badge: kpiStats.totalGiftCount,
    },
    {
      id: 'organizations',
      label: 'Organizations',
      icon: Building2,
      badge: kpiStats.totalOrgsCount,
    },
    {
      id: 'governance',
      label: 'Governance',
      icon: ShieldCheck,
      badge: '3 Terms',
      badgeColor: 'bg-amber-50 text-amber-700 font-medium',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: kpiStats.openTasksCount,
      badgeColor: 'bg-rose-50 text-rose-700 font-medium',
    },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    // Reset any deep selection when switching tabs from sidebar
    setSelectedContactId(null);
    setSelectedOrgId(null);
    setSelectedGiftId(null);
    setSelectedBoardMemberId(null);
    setSelectedTaskId(null);
    setSelectedMeetingId(null);
    setActiveTab(tabId);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none shrink-0">
      {/* Product Branding Header */}
      <div className="px-4 py-4 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-1 flex items-center justify-center shrink-0">
            <img
              src="/assets/aistudio/MAPLE_Logo_ab678960.png"
              alt="MAPLE Inc."
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="leading-tight text-base font-extrabold text-[#1e3a8a] tracking-tight">
                MAPLE Inc.
              </span>
              <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-lime-100 text-lime-800 border border-lime-300">
                CRM
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium tracking-tight truncate leading-tight mt-0.5" title="Making Aging People Lives Easier">
              Making Aging People Lives Easier
            </span>
          </div>
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="px-4 pb-3">
        <button
          onClick={() => openQuickAdd()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-medium text-xs shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-lime-400" />
          <span>Quick Add Record</span>
        </button>
      </div>

      {/* Primary Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50/90 text-[#1e3a8a] font-semibold border-l-3 border-[#1e3a8a] pl-2.5'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#1e3a8a]' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    item.badgeColor || (isActive ? 'bg-blue-100/80 text-blue-900 font-semibold' : 'bg-slate-100 text-slate-500')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Copilot shortcut in nav */}
        <div className="pt-4 mt-2 border-t border-slate-100">
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-blue-50/70 hover:text-[#1e3a8a] border border-slate-200/80 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ask AI Copilot</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1e3a8a]" />
          </button>
        </div>
      </nav>

      {/* Google Workspace status indicator */}
      <div className="p-3 mx-4 mb-3 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center justify-between font-medium text-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Google Sync Active
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Connected</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Gmail, Meet, Drive & Calendar synced
        </p>
      </div>

      {/* User / Profile Section at Bottom */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {currentUser.avatar}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-xs font-bold truncate text-slate-900">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
