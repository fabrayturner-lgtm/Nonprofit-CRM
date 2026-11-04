import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Users,
  Building2,
  Heart,
  CheckSquare,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Modal } from '../common/Modal';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    contacts,
    organizations,
    gifts,
    tasks,
    boardMembers,
    meetings,
    navigateToContact,
    navigateToOrg,
    navigateToGift,
    navigateToTask,
    navigateToBoardMember,
    navigateToMeeting,
    openAIWithPrompt,
  } = useCRM();

  const [query, setQuery] = useState('');

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGlobalSearchOpen]);

  // Results
  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedContacts = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.organizationName && c.organizationName.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedOrgs = organizations.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.type.toLowerCase().includes(q) ||
        (o.primaryContactName && o.primaryContactName.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedGifts = gifts.filter(
      (g) =>
        g.donorName.toLowerCase().includes(q) ||
        g.campaign.toLowerCase().includes(q) ||
        g.fund.toLowerCase().includes(q) ||
        (g.organizationName && g.organizationName.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedTasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.relatedToName.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedBoard = boardMembers.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.boardRole.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      contacts: matchedContacts,
      orgs: matchedOrgs,
      gifts: matchedGifts,
      tasks: matchedTasks,
      board: matchedBoard,
    };
  }, [query, contacts, organizations, gifts, tasks, boardMembers]);

  return (
    <Modal
      isOpen={globalSearchOpen}
      onClose={() => {
        setGlobalSearchOpen(false);
        setQuery('');
      }}
      title="Global CRM Search"
      subtitle="Instant search across donors, organizations, gifts, board members, and tasks"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search donors, foundations, gift amounts, board roles, tasks..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 text-sm font-medium"
          />
        </div>

        {/* Results Container */}
        {results ? (
          <div className="max-h-96 overflow-y-auto space-y-4 pt-1">
            {/* Contacts */}
            {results.contacts.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Contacts & Donors ({results.contacts.length})</span>
                </div>
                {results.contacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setGlobalSearchOpen(false);
                      setQuery('');
                      navigateToContact(c.id);
                    }}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/40 border border-slate-100 hover:border-indigo-200 cursor-pointer flex items-center justify-between text-xs transition-all group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-indigo-700">{c.name}</span>
                      <span className="text-slate-500 ml-2">({c.title}{c.organizationName ? ` · ${c.organizationName}` : ''})</span>
                    </div>
                    <span className="font-semibold text-slate-800">${c.lifetimeGiving.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Organizations */}
            {results.orgs.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Organizations & Foundations ({results.orgs.length})</span>
                </div>
                {results.orgs.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setGlobalSearchOpen(false);
                      setQuery('');
                      navigateToOrg(o.id);
                    }}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 cursor-pointer flex items-center justify-between text-xs transition-all group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-700">{o.name}</span>
                      <span className="text-slate-500 ml-2">({o.type} · {o.relationshipStatus})</span>
                    </div>
                    <span className="font-semibold text-slate-800">${o.totalGiving.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Gifts */}
            {results.gifts.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Gifts & Contributions ({results.gifts.length})</span>
                </div>
                {results.gifts.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      setGlobalSearchOpen(false);
                      setQuery('');
                      navigateToGift(g.id);
                    }}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-rose-50/40 border border-slate-100 hover:border-rose-200 cursor-pointer flex items-center justify-between text-xs transition-all group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-rose-700">{g.donorName}</span>
                      <span className="text-slate-500 ml-2">({g.fund} · {g.giftDate})</span>
                    </div>
                    <span className="font-bold text-slate-900">${g.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks */}
            {results.tasks.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tasks & Follow-ups ({results.tasks.length})</span>
                </div>
                {results.tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setGlobalSearchOpen(false);
                      setQuery('');
                      navigateToTask(t.id);
                    }}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50/40 border border-slate-100 hover:border-amber-200 cursor-pointer flex items-center justify-between text-xs transition-all group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-amber-800">{t.title}</span>
                      <span className="text-slate-500 ml-2">(Due {t.dueDate})</span>
                    </div>
                    <span className="text-slate-600 font-medium">{t.priority}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Board Members */}
            {results.board.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Board Governance ({results.board.length})</span>
                </div>
                {results.board.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setGlobalSearchOpen(false);
                      setQuery('');
                      navigateToBoardMember(b.id);
                    }}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-purple-50/40 border border-slate-100 hover:border-purple-200 cursor-pointer flex items-center justify-between text-xs transition-all group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-purple-800">{b.name}</span>
                      <span className="text-purple-900 ml-2 font-semibold">({b.boardRole})</span>
                    </div>
                    <span className="text-slate-600">Term: {b.termEnd}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400 space-y-2">
            <p>Type to search across all records in MAPLE Inc. CRM.</p>
            <div className="flex flex-wrap justify-center gap-1.5 pt-2">
              <button
                onClick={() => setQuery('Jane Smith')}
                className="px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px]"
              >
                "Jane Smith"
              </button>
              <button
                onClick={() => setQuery('ABC Foundation')}
                className="px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px]"
              >
                "ABC Foundation"
              </button>
              <button
                onClick={() => setQuery('Pledge')}
                className="px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px]"
              >
                "Pledge"
              </button>
              <button
                onClick={() => setQuery('Board')}
                className="px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px]"
              >
                "Board"
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
