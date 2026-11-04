import React, { useState } from 'react';
import {
  HeartHandshake,
  Users,
  CheckSquare,
  Calendar,
  Building2,
  Contact as ContactIcon,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  AlertCircle,
  Plus,
  Mail,
  Phone,
  Video,
  FileText,
  DollarSign,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { GivingChart } from '../common/GivingChart';
import { Badge } from '../common/Badge';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';

export const DashboardView: React.FC = () => {
  const {
    kpiStats,
    gifts,
    contacts,
    organizations,
    tasks,
    meetings,
    activities,
    navigateToContact,
    navigateToOrg,
    navigateToGift,
    navigateToTask,
    navigateToMeeting,
    openAIWithPrompt,
    openQuickAdd,
    completeTask,
    setThankModalGift,
  } = useCRM();

  const [activityTab, setActivityTab] = useState<'all' | 'gifts' | 'contacts' | 'followups'>('all');

  // Urgent / High priority open tasks
  const prioritizedTasks = tasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => {
      const priorityWeights = { Urgent: 4, High: 3, Normal: 2, Low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    })
    .slice(0, 5);

  // Recent 5 gifts
  const recentGifts = gifts
    .filter(g => g.status === 'Received')
    .slice(0, 5);

  // Filtered activities
  const displayActivities = activities.filter(a => {
    if (activityTab === 'gifts') return a.type === 'Gift';
    if (activityTab === 'contacts') return a.type === 'Email' || a.type === 'Phone Call' || a.type === 'Meeting';
    if (activityTab === 'followups') return a.type === 'Note' || a.type === 'Grant Update';
    return true;
  }).slice(0, 7);

  // Recently added contacts
  const recentlyAddedContacts = contacts.slice(0, 4);
  // Recently added organizations
  const recentlyAddedOrgs = organizations.slice(0, 4);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* MAPLE Inc. Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#172554] to-[#1e3a8a] rounded-2xl p-5 md:p-6 text-white shadow-sm border border-blue-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-lime-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-60 h-60 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0 shadow-md">
              <img
                src="/assets/aistudio/MAPLE_Logo_ab678960.png"
                alt="MAPLE Inc."
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  MAPLE Inc.
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-lime-400 text-lime-950 shadow-2xs">
                  Making Aging People Lives Easier
                </span>
              </div>
              <p className="text-xs text-blue-100/90 mt-1 max-w-xl leading-relaxed">
                Empowering older adults with dignity, home accessibility, companionship, and community support.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => openQuickAdd('gift')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Record Gift</span>
            </button>
            <button
              onClick={() => openAIWithPrompt('Generate an executive summary of Q3 fundraising progress for MAPLE Inc.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 backdrop-blur-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Executive Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Summary Cards (6 Key Executive Metrics in clean minimal grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Gifts YTD */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
          <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            Total Gifts YTD
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ${kpiStats.totalGiftsYTD.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +18.4% vs 2025
          </div>
        </div>

        {/* Active Donors */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
          <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            Active Donors
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {kpiStats.activeDonorsCount}
          </div>
          <div className="mt-2 flex items-center text-xs text-indigo-600 font-medium">
            <span className="bg-indigo-50 px-2 py-0.5 rounded-full">+18 this month</span>
          </div>
        </div>

        {/* Open Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
          <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            Open Tasks
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {kpiStats.openTasksCount}
          </div>
          <div className="mt-2 text-xs text-amber-600 flex items-center font-medium">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            3 urgent priorities
          </div>
        </div>

        {/* Board Governance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
          <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            Board Governance
          </div>
          <div className="text-2xl font-bold text-slate-900">
            3 <span className="text-xs font-normal text-slate-400">Expirations</span>
          </div>
          <div className="mt-2 text-xs text-orange-600 flex items-center font-medium">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Term Review Required
          </div>
        </div>

        {/* Organizations */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
          <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            Organizations
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {kpiStats.totalOrgsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Foundations & corps
          </p>
        </div>

        {/* Total Contacts */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
          <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">
            CRM Contacts
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {kpiStats.totalContactsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            10 board members
          </p>
        </div>
      </div>

      {/* 2. Giving Visualization + AI Assistant Clean Minimalism Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Giving visualization */}
        <div className="lg:col-span-2">
          <GivingChart gifts={gifts} />
        </div>

        {/* Right 1 Col: Prominent "Ask AI" Clean Dark Card */}
        <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm">Ask AI</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase tracking-tight">
              Workspace Insight
            </span>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 text-xs leading-relaxed border border-slate-700 text-slate-300">
            "Based on your Gmail activity, <span className="text-indigo-300 font-medium">Sarah Miller</span> hasn't been contacted in 3 weeks. Her lifetime giving is $12,000. Recommend scheduling a brief check-in."
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => openAIWithPrompt('Who should I follow up with this week?')}
              className="text-[11px] text-left px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 border border-slate-700"
            >
              "Who should I follow up with this week?"
            </button>
            <button
              onClick={() => openAIWithPrompt('Summarize our relationship with ABC Foundation.')}
              className="text-[11px] text-left px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 border border-slate-700"
            >
              "Summarize ABC Foundation relationship."
            </button>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  openAIWithPrompt(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
              placeholder="Ask a question..."
            />
            <button
              onClick={() => openAIWithPrompt('Who should I follow up with this week?')}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Two Columns: Prioritized Tasks vs Relationship / Development Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Action Required / Tasks */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Action Required</h3>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {prioritizedTasks.length} Pending
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1">
            {prioritizedTasks.map((task) => {
              const isUrgent = task.priority === 'Urgent';
              return (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => completeTask(task.id)}
                      className="w-4 h-4 rounded border-2 border-slate-300 hover:border-indigo-600 mt-0.5 flex-shrink-0 transition-colors"
                      title="Mark task completed"
                    >
                      <span className="sr-only">Complete</span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <p
                        onClick={() => navigateToTask(task.id)}
                        className="text-xs font-bold text-slate-800 hover:text-indigo-600 cursor-pointer truncate"
                      >
                        {task.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                        {task.relatedToName} · {task.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${
                          isUrgent ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Due {task.dueDate.split('-').slice(1).join('/')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigateToTask(prioritizedTasks[0]?.id || '')}
            className="p-3 text-center text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 border-t border-slate-50 transition-colors"
          >
            VIEW ALL TASKS
          </button>
        </div>

        {/* Right Column: Recent Contact Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Recent Contact Activity</h3>
            <div className="flex bg-slate-50 p-1 rounded-lg text-[10px] font-bold uppercase">
              <button
                onClick={() => setActivityTab('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activityTab === 'all'
                    ? 'bg-white shadow-xs text-indigo-600 font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActivityTab('gifts')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activityTab === 'gifts'
                    ? 'bg-white shadow-xs text-indigo-600 font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Gifts
              </button>
              <button
                onClick={() => setActivityTab('contacts')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activityTab === 'contacts'
                    ? 'bg-white shadow-xs text-indigo-600 font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Comms
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {displayActivities.map((act) => {
              const isGift = act.type === 'Gift';
              const isEmail = act.type === 'Email';
              const isMeeting = act.type === 'Meeting';
              return (
                <div key={act.id} className="flex gap-3.5 items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isGift
                        ? 'bg-emerald-100 text-emerald-700'
                        : isEmail
                        ? 'bg-indigo-100 text-indigo-700'
                        : isMeeting
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isGift && 'GF'}
                    {isEmail && 'EM'}
                    {isMeeting && 'MT'}
                    {!isGift && !isEmail && !isMeeting && 'NT'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase shrink-0 font-mono">
                        {act.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                      {act.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      {act.contactName && (
                        <span
                          onClick={() => act.contactId && navigateToContact(act.contactId)}
                          className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600 uppercase hover:text-indigo-600 cursor-pointer"
                        >
                          {act.contactName}
                        </span>
                      )}
                      {act.organizationName && (
                        <span
                          onClick={() => act.organizationId && navigateToOrg(act.organizationId)}
                          className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-600 uppercase hover:text-indigo-600 cursor-pointer"
                        >
                          {act.organizationName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Key Contacts & Organizations Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Contacts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Key Contacts & Donors</span>
            </h3>
            <button
              onClick={() => openQuickAdd('contact')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Contact</span>
            </button>
          </div>

          <div className="space-y-2">
            {recentlyAddedContacts.map((c) => (
              <div
                key={c.id}
                onClick={() => navigateToContact(c.id)}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-full ${c.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {c.title} {c.organizationName ? `· ${c.organizationName}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-800 block">
                    ${c.lifetimeGiving.toLocaleString()}
                  </span>
                  <Badge variant="outline" size="sm" className="text-[10px]">
                    {c.relationshipType}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Organizations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Key Organizations & Funders</span>
            </h3>
            <button
              onClick={() => openQuickAdd('organization')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Organization</span>
            </button>
          </div>

          <div className="space-y-2">
            {recentlyAddedOrgs.map((org) => (
              <div
                key={org.id}
                onClick={() => navigateToOrg(org.id)}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${org.logoColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {org.logoLetter}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 truncate">
                      {org.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {org.type} · Lead: {org.primaryContactName || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-800 block">
                    ${org.totalGiving.toLocaleString()}
                  </span>
                  <Badge variant="indigo" size="sm" className="text-[10px]">
                    {org.relationshipStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
