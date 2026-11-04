import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  UserPlus,
  Building,
  Heart,
  CheckSquare,
  Calendar,
  FileText,
  Menu,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    activeTab,
    setGlobalSearchOpen,
    openQuickAdd,
    setNotificationsOpen,
    setAiDrawerOpen,
    notifications,
  } = useCRM();

  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAddDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Relationship & Giving Dashboard';
      case 'contacts':
        return 'Contacts & Key Relationships';
      case 'gifts':
        return 'Gifts, Pledges & Fundraising Ledger';
      case 'organizations':
        return 'Organizations, Foundations & Partners';
      case 'governance':
        return 'Board Governance, Committees & Meetings';
      case 'tasks':
        return 'Nonprofit Action Items & Follow-ups';
      default:
        return 'MAPLE Inc. CRM';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            onClick={() => setGlobalSearchOpen(true)}
            readOnly
            className="block w-full pl-9 pr-8 py-1.5 border border-slate-200 rounded-full bg-slate-50 text-xs text-slate-700 cursor-pointer placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1e3a8a] hover:bg-slate-100/80 transition-all"
            placeholder="Search MAPLE records, donors, gifts, or tasks... (⌘K)"
          />
          <kbd className="absolute inset-y-0 right-2 my-auto h-4 px-1 text-[9px] font-mono bg-white border border-slate-200 rounded text-slate-400 flex items-center justify-center">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Add, Notifications, AI Assistant */}
      <div className="flex items-center gap-3">
        {/* Quick Add '+' Button with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setAddDropdownOpen(!addDropdownOpen)}
            className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#172554] text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4 text-lime-300" />
            <span>Quick Add</span>
          </button>

          {addDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Create
              </div>
              <button
                onClick={() => {
                  setAddDropdownOpen(false);
                  openQuickAdd('contact');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#1e3a8a] text-left font-medium transition-colors"
              >
                <UserPlus className="w-4 h-4 text-[#1e3a8a]" />
                <span>Add Contact</span>
              </button>
              <button
                onClick={() => {
                  setAddDropdownOpen(false);
                  openQuickAdd('organization');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#1e3a8a] text-left font-medium transition-colors"
              >
                <Building className="w-4 h-4 text-[#1e3a8a]" />
                <span>Add Organization</span>
              </button>
              <button
                onClick={() => {
                  setAddDropdownOpen(false);
                  openQuickAdd('gift');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#1e3a8a] text-left font-medium transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Record Gift</span>
              </button>
              <button
                onClick={() => {
                  setAddDropdownOpen(false);
                  openQuickAdd('task');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#1e3a8a] text-left font-medium transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-amber-500" />
                <span>Create Task</span>
              </button>
              <button
                onClick={() => {
                  setAddDropdownOpen(false);
                  openQuickAdd('note');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#1e3a8a] text-left font-medium transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Add Activity / Note</span>
              </button>
              <button
                onClick={() => {
                  setAddDropdownOpen(false);
                  openQuickAdd('meeting');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#1e3a8a] text-left font-medium transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#1e3a8a]" />
                <span>Schedule Meeting</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Center Bell */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="p-2 text-slate-400 hover:text-[#1e3a8a] transition-colors relative rounded-full hover:bg-slate-50"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          )}
        </button>

        {/* Ask AI Copilot Header Trigger */}
        <button
          onClick={() => setAiDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100/80 text-[#1e3a8a] text-xs font-semibold border border-blue-200/80 transition-all shadow-2xs"
          title="Ask MAPLE AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Ask AI</span>
        </button>
      </div>
    </header>
  );
};
