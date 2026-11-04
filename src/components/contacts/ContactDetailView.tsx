import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  HeartHandshake,
  CheckSquare,
  Sparkles,
  Edit,
  Plus,
  Clock,
  ShieldCheck,
  Tag,
  ExternalLink,
  MessageSquare,
  FileText,
  Video,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Contact, Gift, CRMTask, ActivityItem } from '../../types';
import { Badge } from '../common/Badge';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';
import { RelationshipSummaryCard } from '../ai/RelationshipSummaryCard';

interface ContactDetailViewProps {
  contact: Contact;
  onBack: () => void;
}

export const ContactDetailView: React.FC<ContactDetailViewProps> = ({
  contact,
  onBack,
}) => {
  const {
    gifts,
    tasks,
    activities,
    organizations,
    boardMembers,
    committees,
    navigateToOrg,
    navigateToGift,
    navigateToTask,
    navigateToMeeting,
    navigateToBoardMember,
    openQuickAdd,
    completeTask,
    setThankModalGift,
    openAIWithPrompt,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'activity' | 'gifts' | 'tasks' | 'relationships' | 'ai'
  >('overview');

  // Related gifts for this contact
  const contactGifts = gifts.filter(
    (g) => g.donorId === contact.id || (contact.organizationId && g.organizationId === contact.organizationId)
  );

  // Related tasks for this contact
  const contactTasks = tasks.filter(
    (t) => t.relatedToId === contact.id || t.relatedToName.includes(contact.name)
  );

  // Related activity logs
  const contactActivities = activities.filter(
    (a) => a.contactId === contact.id || (contact.organizationId && a.organizationId === contact.organizationId)
  );

  // Board role if any
  const boardMemberProfile = boardMembers.find((bm) => bm.contactId === contact.id);

  // Organization if any
  const org = organizations.find((o) => o.id === contact.organizationId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Contacts</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAIWithPrompt(`Summarize our relationship with ${contact.name}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Briefing</span>
          </button>
          <button
            onClick={() => openQuickAdd('gift')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Gift</span>
          </button>
        </div>
      </div>

      {/* Hero Contact Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl ${contact.avatarColor} text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm`}>
              {contact.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {contact.name}
                </h2>
                <Badge variant="indigo">{contact.relationshipType}</Badge>
                {boardMemberProfile && (
                  <Badge variant="purple" className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{boardMemberProfile.boardRole}</span>
                  </Badge>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    contact.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {contact.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {contact.title}
                {org && (
                  <span
                    onClick={() => navigateToOrg(org.id)}
                    className="text-teal-700 hover:underline cursor-pointer font-semibold ml-1.5"
                  >
                    at {org.name}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Lifetime Giving
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                ${contact.lifetimeGiving.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Assigned Staff
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {contact.assignedTo}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info Row & Google Workspace Sync */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <a href={`mailto:${contact.email}`} className="text-teal-700 hover:underline truncate">
              {contact.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{contact.address.city}, {contact.address.state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Last Contact: <strong className="text-slate-800 font-mono">{contact.lastContactDate || 'None'}</strong></span>
          </div>
        </div>

        {/* Google Workspace Integrations Pill Banner */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Google Workspace Sync:</span>
            {contact.googleWorkspace?.gmailThreadsCount ? (
              <GoogleWorkspaceBadge type="gmail" count={contact.googleWorkspace.gmailThreadsCount} />
            ) : null}
            {contact.googleWorkspace?.hasDriveFolder ? (
              <GoogleWorkspaceBadge type="drive" label="Drive Folder Linked" />
            ) : null}
            {contact.googleWorkspace?.nextCalendarEvent ? (
              <GoogleWorkspaceBadge type="calendar" label={contact.googleWorkspace.nextCalendarEvent} />
            ) : null}
          </div>
          <span className="text-[11px] text-slate-400">Prefers: <strong className="text-slate-700">{contact.preferredChannel}</strong></span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Relationship Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'activity'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Activity Timeline</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {contactActivities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'gifts'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Gifts & Grants</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {contactGifts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Tasks & Follow-ups</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {contactTasks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'relationships'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Relationships & Roles
          </button>
        </nav>
      </div>

      {/* Tab Content Panes */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Summary Banner */}
            <RelationshipSummaryCard
              summaryText={contact.aiSummary}
              entityName={contact.name}
            />

            {/* Notes Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Relationship Notes & Stewardship Preferences
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {contact.notes || 'No custom notes recorded yet.'}
              </p>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Relationship Tags & Interest Areas</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Address & Key Metadata */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mailing & Physical Address
              </h3>
              <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="font-semibold">{contact.address.street}</p>
                <p>{contact.address.city}, {contact.address.state} {contact.address.zip}</p>
                <p className="text-[11px] text-slate-500 pt-1">United States</p>
              </div>
            </div>

            {/* Google Workspace Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Connected Google Services
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-red-50/50 border border-red-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-slate-800">Gmail Threads</span>
                  </div>
                  <span className="font-bold text-red-700 font-mono">
                    {contact.googleWorkspace?.gmailThreadsCount || 0} active
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-slate-800">Google Drive Folder</span>
                  </div>
                  <span className="text-emerald-700 font-medium text-[11px]">Linked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AI SUMMARY TAB */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <RelationshipSummaryCard
            title="Comprehensive AI Relationship Profile"
            summaryText={contact.aiSummary}
            entityName={contact.name}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>AI Recommended Next Steps</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>Send quarterly metric progress report with youth participant quotes.</span>
                </li>
                <li className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>Schedule annual fall coffee check-in ahead of year-end grant allocation.</span>
                </li>
                <li className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span>Invite to the upcoming October STEM Impact Gala as a special guest.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Communication Pattern Insights
              </h3>
              <div className="text-xs text-slate-700 space-y-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-900 block">Preferred Medium:</span>
                  <span className="text-slate-600">{contact.preferredChannel} communications with bullet points and clean outcome data.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-900 block">Typical Response Speed:</span>
                  <span className="text-slate-600">Within 24-48 hours on business weekdays.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVITY TIMELINE TAB */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Activity History & Google Workspace Log
            </h3>
            <button
              onClick={() => openQuickAdd('note')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Note or Call</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {contactActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No activity records logged for this contact yet.
              </p>
            ) : (
              contactActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 border border-teal-200">
                    {act.type === 'Email' && <Mail className="w-4 h-4 text-red-600" />}
                    {act.type === 'Meeting' && <Calendar className="w-4 h-4 text-blue-600" />}
                    {act.type === 'Phone Call' && <Phone className="w-4 h-4 text-teal-600" />}
                    {act.type === 'Gift' && <HeartHandshake className="w-4 h-4 text-emerald-600" />}
                    {act.type === 'Note' && <FileText className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-slate-900">{act.title}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{act.date}</span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{act.description}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Logged by: {act.author}</span>
                      {act.googleWorkspaceSource && (
                        <span className="text-teal-700 font-medium">Synced via {act.googleWorkspaceSource}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. GIFTS TAB */}
      {activeTab === 'gifts' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Gifts, Grants & Contributions ({contactGifts.length})
            </h3>
            <button
              onClick={() => openQuickAdd('gift')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Gift</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Campaign & Fund</th>
                  <th className="py-2.5 px-4">Method</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contactGifts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No gift records found for this contact.
                    </td>
                  </tr>
                ) : (
                  contactGifts.map((gift) => (
                    <tr key={gift.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-700">{gift.giftDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">${gift.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="indigo">{gift.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{gift.campaign}</p>
                        <p className="text-[11px] text-slate-500">{gift.fund}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{gift.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <Badge variant={gift.status === 'Received' ? 'success' : 'warning'}>
                          {gift.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {!gift.thanked ? (
                          <button
                            onClick={() => setThankModalGift(gift)}
                            className="px-2.5 py-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] border border-teal-200 transition-colors"
                          >
                            Thank Donor
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-medium">✓ Thanked</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Tasks & Follow-up Items ({contactTasks.length})
            </h3>
            <button
              onClick={() => openQuickAdd('task')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>

          <div className="space-y-2">
            {contactTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No active or historical tasks linked to this contact.
              </p>
            ) : (
              contactTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-lg border border-slate-200 flex items-start justify-between gap-3 bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.status === 'Completed'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-teal-500'
                      }`}
                    >
                      {task.status === 'Completed' && '✓'}
                    </button>
                    <div>
                      <p
                        onClick={() => navigateToTask(task.id)}
                        className={`text-xs font-semibold cursor-pointer ${
                          task.status === 'Completed'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 hover:text-teal-700'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={task.priority === 'Urgent' ? 'danger' : 'warning'}>
                      {task.priority}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Due {task.dueDate}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. RELATIONSHIPS & ROLES TAB */}
      {activeTab === 'relationships' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Connection */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Institutional Affiliation</span>
            </h3>
            {org ? (
              <div
                onClick={() => navigateToOrg(org.id)}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-teal-50/20 hover:border-teal-200 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{org.name}</h4>
                  <p className="text-[11px] text-slate-500">{org.type} · {org.relationshipStatus}</p>
                </div>
                <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                  View Org <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No primary organization linked.</p>
            )}
          </div>

          {/* Board & Committee Memberships */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Governance & Board Roles</span>
            </h3>
            {boardMemberProfile ? (
              <div
                onClick={() => navigateToBoardMember(boardMemberProfile.id)}
                className="p-3 rounded-lg border border-slate-200 bg-purple-50/40 hover:border-purple-300 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">{boardMemberProfile.boardRole}</span>
                  <Badge variant="purple" size="sm">{boardMemberProfile.status}</Badge>
                </div>
                <p className="text-[11px] text-slate-600">
                  Term: {boardMemberProfile.startDate} to {boardMemberProfile.termEnd} (Term #{boardMemberProfile.termNumber})
                </p>
                <p className="text-[11px] text-slate-600">
                  Attendance Record: <strong className="text-slate-900">{boardMemberProfile.attendanceRate}%</strong>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Not a member of the Board of Directors.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
