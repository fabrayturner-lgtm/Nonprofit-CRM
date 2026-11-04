import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Calendar,
  Clock,
  Video,
  FileText,
  DollarSign,
  CheckSquare,
  AlertCircle,
  Plus,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { BoardMember, Committee, GovernanceMeeting } from '../../types';
import { Badge } from '../common/Badge';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';
import { BoardMemberDetailModal } from './BoardMemberDetailModal';
import { MeetingDetailModal } from './MeetingDetailModal';

export const GovernanceView: React.FC = () => {
  const {
    boardMembers,
    committees,
    meetings,
    kpiStats,
    selectedBoardMemberId,
    setSelectedBoardMemberId,
    selectedMeetingId,
    setSelectedMeetingId,
    openQuickAdd,
    openAIWithPrompt,
    navigateToContact,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'members' | 'committees' | 'meetings' | 'calendar'>('members');
  const [activeMemberModal, setActiveMemberModal] = useState<BoardMember | null>(null);
  const [activeMeetingModal, setActiveMeetingModal] = useState<GovernanceMeeting | null>(null);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Board Governance, Committees & Meetings
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
              501(c)(3) Board of Directors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Board roster, term tracking, committee leadership, stated meetings, and Google Meet integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAIWithPrompt('What board terms expire this year?')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Governance Audit</span>
          </button>
          <button
            onClick={() => openQuickAdd('meeting')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Board Overview 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Board Members
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {kpiStats.totalBoardMembersCount} Directors
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">100% Board Giving</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Upcoming Meetings
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {kpiStats.upcomingMeetingsCount} Scheduled
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">Synced with Google Meet</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Active Committees
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {kpiStats.activeCommitteesCount} Committees
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Exec, Fin, Gov, Dev, Prog</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Expiring Terms 2026
          </span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {kpiStats.expiringTermsThisYear} Terms Ending
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Nominations Open</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Avg Attendance
          </span>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            92% Quorum
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Past 12 Months</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'members' ? 'border-indigo-600 text-indigo-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Board Directors Roster</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {boardMembers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('committees')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'committees' ? 'border-indigo-600 text-indigo-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Committees & Charters</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {committees.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'meetings' ? 'border-indigo-600 text-indigo-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Stated Meetings & Agendas</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {meetings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'calendar' ? 'border-indigo-600 text-indigo-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Governance Calendar
          </button>
        </nav>
      </div>

      {/* Tab Panes */}
      {/* 1. BOARD MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Director Name</th>
                  <th className="py-3 px-4">Board Officer Role</th>
                  <th className="py-3 px-4">Committee Roles</th>
                  <th className="py-3 px-4">Term Dates</th>
                  <th className="py-3 px-4 text-right">Annual Giving</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {boardMembers.map((bm) => {
                  const isExpiringSoon = bm.termEnd.startsWith('2026');
                  return (
                    <tr
                      key={bm.id}
                      onClick={() => setActiveMemberModal(bm)}
                      className="hover:bg-purple-50/20 cursor-pointer transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-purple-700">
                          {bm.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{bm.email}</div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 font-semibold text-purple-900">
                        {bm.boardRole}
                      </td>

                      {/* Committees */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(bm.committees || []).map((c, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Term */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div>{bm.startDate} – {bm.termEnd}</div>
                        {isExpiringSoon && (
                          <span className="text-[10px] text-amber-600 font-medium">Term ending 2026</span>
                        )}
                      </td>

                      {/* Annual Giving */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        ${(bm.annualGiving || bm.lifetimeGiving || 0).toLocaleString()}
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">
                        {bm.attendanceRate}%
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <Badge variant="purple" size="sm">{bm.status}</Badge>
                      </td>

                      {/* Chevron */}
                      <td className="py-3 px-4 text-center">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 inline-block" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. COMMITTEES TAB */}
      {activeTab === 'committees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {committees.map((committee) => (
            <div
              key={committee.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{committee.name}</h3>
                  <Badge variant="purple" size="sm">{(committee.members || []).length} Members</Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{committee.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                  <p>
                    <strong className="text-slate-900">Committee Chair:</strong> {committee.chairName}
                  </p>
                  <p>
                    <strong className="text-slate-900">Members:</strong> {(committee.members || []).join(', ')}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Next Meeting: <strong className="text-indigo-700 font-semibold">{committee.nextMeeting || committee.nextMeetingDate || 'TBD'}</strong></span>
                <button
                  onClick={() => openQuickAdd('meeting')}
                  className="text-indigo-700 font-semibold hover:underline"
                >
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. MEETINGS TAB */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => setActiveMeetingModal(meeting)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">{meeting.type}</Badge>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                    {meeting.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {meeting.date} at {meeting.time}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span>{meeting.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {meeting.googleMeetLink && (
                  <span className="inline-flex items-center gap-1 text-xs text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                    <Video className="w-3.5 h-3.5" />
                    Google Meet
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. GOVERNANCE CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Governance Timeline & Key Deadlines (2026 - 2027)
            </h3>
            <p className="text-xs text-slate-500">
              Board meetings, committee reviews, annual audit sign-offs, and director term expirations.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            <div className="ml-6 relative">
              <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white" />
              <span className="text-[10px] font-bold uppercase text-teal-700 font-mono">Sep 15, 2026</span>
              <h4 className="text-xs font-bold text-slate-900">Fall LOI & Grant Submissions Window</h4>
              <p className="text-xs text-slate-600">Executive Committee review of Q4 proposals.</p>
            </div>

            <div className="ml-6 relative">
              <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white" />
              <span className="text-[10px] font-bold uppercase text-purple-700 font-mono">Sep 24, 2026</span>
              <h4 className="text-xs font-bold text-slate-900">Q3 Stated Board Meeting & Strategic Plan Review</h4>
              <p className="text-xs text-slate-600">Google Meet hybrid video call & in-person quorum.</p>
            </div>

            <div className="ml-6 relative">
              <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white" />
              <span className="text-[10px] font-bold uppercase text-amber-700 font-mono">Oct 15, 2026</span>
              <h4 className="text-xs font-bold text-slate-900">Finance & Audit Committee: 2027 Operating Budget Review</h4>
              <p className="text-xs text-slate-600">Review draft budget with Treasurer Patricia Moore.</p>
            </div>

            <div className="ml-6 relative">
              <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-rose-500 ring-4 ring-white" />
              <span className="text-[10px] font-bold uppercase text-rose-700 font-mono">Dec 31, 2026</span>
              <h4 className="text-xs font-bold text-slate-900">3 Director Terms Expiring (Patricia Moore, Dr. Elena Rostova, Marcus Vance)</h4>
              <p className="text-xs text-slate-600">Governance Committee slate nominations review.</p>
            </div>
          </div>
        </div>
      )}

      {/* Board Member Detail Modal */}
      <BoardMemberDetailModal
        boardMember={activeMemberModal}
        isOpen={!!activeMemberModal}
        onClose={() => setActiveMemberModal(null)}
      />

      {/* Meeting Detail Modal */}
      <MeetingDetailModal
        meeting={activeMeetingModal}
        isOpen={!!activeMeetingModal}
        onClose={() => setActiveMeetingModal(null)}
      />
    </div>
  );
};
