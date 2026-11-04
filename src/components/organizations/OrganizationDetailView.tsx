import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  MapPin,
  User,
  DollarSign,
  HeartHandshake,
  FileText,
  Calendar,
  Sparkles,
  Plus,
  Folder,
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Network,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Organization, Contact, Gift, Grant, CRMTask, ActivityItem } from '../../types';
import { Badge } from '../common/Badge';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';
import { RelationshipSummaryCard } from '../ai/RelationshipSummaryCard';

interface OrganizationDetailViewProps {
  org: Organization;
  onBack: () => void;
}

export const OrganizationDetailView: React.FC<OrganizationDetailViewProps> = ({
  org,
  onBack,
}) => {
  const {
    contacts,
    gifts,
    grants,
    tasks,
    activities,
    navigateToContact,
    navigateToGift,
    navigateToTask,
    openQuickAdd,
    openAIWithPrompt,
    completeTask,
    setThankModalGift,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'contacts' | 'gifts' | 'grants' | 'activity' | 'documents' | 'hierarchy'
  >('overview');

  // Associated contacts
  const orgContacts = contacts.filter((c) => c.organizationId === org.id);

  // Associated gifts & grants
  const orgGifts = gifts.filter((g) => g.organizationId === org.id);

  // Associated grant proposals in pipeline
  const orgGrants = grants.filter((gr) => gr.organizationId === org.id);

  // Associated tasks
  const orgTasks = tasks.filter(
    (t) => t.relatedToId === org.id || t.relatedToName.includes(org.name)
  );

  // Associated activity logs
  const orgActivities = activities.filter((a) => a.organizationId === org.id);

  const getGrantStageBadge = (stage: Grant['stage']) => {
    switch (stage) {
      case 'Awarded':
        return 'success';
      case 'Submitted':
        return 'indigo';
      case 'Under Review':
        return 'warning';
      case 'Reporting':
        return 'teal';
      case 'Drafting':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Organizations</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAIWithPrompt(`Summarize our relationship with ${org.name}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Funder Briefing</span>
          </button>
          <button
            onClick={() => openQuickAdd('gift')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Grant / Gift</span>
          </button>
        </div>
      </div>

      {/* Hero Organization Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl ${org.logoColor} text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-sm`}>
              {org.logoLetter}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {org.name}
                </h2>
                <Badge variant="purple">{org.type}</Badge>
                <Badge variant="teal">{org.relationshipStatus}</Badge>
              </div>
              <p className="text-xs text-slate-500">
                {org.address.city}, {org.address.state} · Focus: {(org.tags || org.programFocus || ['Community']).join(', ')}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Lifetime Support
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                ${org.totalGiving.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Staff Lead
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {org.assignedTo}
              </span>
            </div>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Primary: <strong className="text-slate-800 font-semibold">{org.primaryContactName || 'None'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <a href={`https://${org.website}`} target="_blank" rel="noreferrer" className="text-teal-700 hover:underline truncate">
              {org.website}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{org.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Last Contact: <strong className="text-slate-800 font-mono">{org.lastContactDate || 'None'}</strong></span>
          </div>
        </div>

        {/* Google Drive Repository link banner */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GoogleWorkspaceBadge type="drive" label={`Google Drive Folder: /Organizations/${org.name.replace(/\s+/g, '_')}`} />
            <span className="text-xs text-slate-600 hidden md:inline">
              (Grant letters, agreements, 990s & tax receipts)
            </span>
          </div>
          <span className="text-xs text-teal-700 font-semibold flex items-center gap-1 cursor-pointer hover:underline">
            Open in Drive <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Overview & AI Briefing
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'contacts' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Associated Contacts</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {orgContacts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'grants' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Grants Pipeline</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {orgGrants.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'gifts' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Gifts & Contributions</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {orgGifts.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'activity' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Activity History</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-600">
              {orgActivities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'documents' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Documents & Drive
          </button>
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'hierarchy' ? 'border-teal-600 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-teal-600" />
            <span>Relationship Map</span>
          </button>
        </nav>
      </div>

      {/* Tab Panes */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RelationshipSummaryCard
              title="Funder Relationship & Intelligence Summary"
              summaryText={org.aiSummary}
              entityName={org.name}
            />

            {/* Funder Notes */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Grant Guidelines & Funder Priorities
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {org.notes || 'No specialized funder guidelines recorded.'}
              </p>
            </div>

            {/* Focus Tags */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Programmatic Focus Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(org.tags || org.programFocus || ['Community Impact']).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-medium border border-teal-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Address & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Headquarters Address
              </h3>
              <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="font-semibold">{org.address.street}</p>
                <p>{org.address.city}, {org.address.state} {org.address.zip}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Grant Cycle Deadlines
              </h3>
              <div className="text-xs space-y-2">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-semibold block">Fall Grant Cycle:</span>
                  <span>LOI Deadline: September 15, 2026</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                  <span className="font-semibold block">Spring Grant Cycle:</span>
                  <span>Full Proposal: March 1, 2027</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACTS TAB */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Key Officers & Associated Contacts ({orgContacts.length})
            </h3>
            <button
              onClick={() => openQuickAdd('contact')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Liaison</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgContacts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 col-span-2 text-center">
                No individuals linked to this organization yet.
              </p>
            ) : (
              orgContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => navigateToContact(contact.id)}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all cursor-pointer flex items-start justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${contact.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                      {contact.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                        {contact.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{contact.title}</p>
                      <p className="text-[11px] text-teal-700 mt-1">{contact.email}</p>
                    </div>
                  </div>
                  <Badge variant="indigo" size="sm">{contact.relationshipType}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3. GRANTS PIPELINE TAB */}
      {activeTab === 'grants' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4.5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Grants Pipeline & Applications ({orgGrants.length})
              </h3>
              <p className="text-xs text-slate-500">
                Track proposals through drafting, submission, review, award, and reporting.
              </p>
            </div>
            <button
              onClick={() => openQuickAdd('gift')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Grant Proposal</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Grant Proposal Name</th>
                  <th className="py-2.5 px-4">Stage</th>
                  <th className="py-2.5 px-4 text-right">Requested</th>
                  <th className="py-2.5 px-4 text-right">Awarded</th>
                  <th className="py-2.5 px-4">Deadline</th>
                  <th className="py-2.5 px-4">Program</th>
                  <th className="py-2.5 px-4">Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgGrants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No grant proposals recorded for this organization.
                    </td>
                  </tr>
                ) : (
                  orgGrants.map((grant) => (
                    <tr key={grant.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{grant.title}</div>
                        <div className="text-[11px] text-slate-500">{grant.notes}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getGrantStageBadge(grant.stage)}>
                          {grant.stage}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700">
                        ${grant.amountRequested.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {grant.amountAwarded ? `$${grant.amountAwarded.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {grant.deadline}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {grant.programArea}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {grant.assignedTo}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. GIFTS TAB */}
      {activeTab === 'gifts' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4.5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Contribution History ({orgGifts.length})
            </h3>
            <button
              onClick={() => openQuickAdd('gift')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Gift</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Designated Fund</th>
                  <th className="py-2.5 px-4">Method</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgGifts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No gift records found for this organization.
                    </td>
                  </tr>
                ) : (
                  orgGifts.map((gift) => (
                    <tr key={gift.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-700">{gift.giftDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">${gift.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <Badge variant="purple">{gift.type}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{gift.fund}</td>
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
                            className="px-2.5 py-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-[11px] border border-teal-200"
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

      {/* 5. ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Institutional Engagement & History
            </h3>
            <button
              onClick={() => openQuickAdd('note')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Note or Meeting</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {orgActivities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No communications or logs recorded for this organization yet.
              </p>
            ) : (
              orgActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 border border-teal-200">
                    <FileText className="w-4 h-4 text-teal-700" />
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

      {/* 6. DOCUMENTS & GOOGLE DRIVE TAB */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Google Drive Grant Agreements & 990 Repository
              </h3>
              <p className="text-xs text-slate-500">
                Directly connected to Google Drive folder for {org.name}
              </p>
            </div>
            <button className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Link New Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-red-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">2026_Grant_Agreement_Signed.pdf</h4>
                  <p className="text-[11px] text-slate-500">Uploaded Aug 2026 · 1.4 MB</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-teal-600 cursor-pointer" />
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Midterm_Impact_Evaluation_Metrics.docx</h4>
                  <p className="text-[11px] text-slate-500">Google Docs Live Sync · 320 KB</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-teal-600 cursor-pointer" />
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">MAPLE_Inc_IRS_501c3_Determination_Letter.pdf</h4>
                  <p className="text-[11px] text-slate-500">Permanent Record · 850 KB</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-teal-600 cursor-pointer" />
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Form_990_Public_Inspection_2025.pdf</h4>
                  <p className="text-[11px] text-slate-500">Financial Disclosure · 4.1 MB</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-teal-600 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* 7. RELATIONSHIP HIERARCHY / MAP TAB */}
      {activeTab === 'hierarchy' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Relationship & Institutional Network Map
            </h3>
            <p className="text-xs text-slate-500">
              Trace connections between {org.name}, staff liaisons, gifts, grants, and community impact programs.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            {/* Box 1: Org */}
            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs w-48">
              <span className="text-[10px] font-bold text-purple-600 uppercase">Institution</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">{org.name}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{org.type}</p>
            </div>

            <div className="text-teal-600 font-bold text-xs">➔</div>

            {/* Box 2: Primary Contact */}
            <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-2xs w-48">
              <span className="text-[10px] font-bold text-teal-600 uppercase">Key Officer</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">{org.primaryContactName || 'Liaison'}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Program Officer</p>
            </div>

            <div className="text-teal-600 font-bold text-xs">➔</div>

            {/* Box 3: Grants / Gifts */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs w-48">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Funding Vehicle</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">${org.totalGiving.toLocaleString()}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{orgGrants.length} Grants · {orgGifts.length} Gifts</p>
            </div>

            <div className="text-teal-600 font-bold text-xs">➔</div>

            {/* Box 4: Impact Program */}
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs w-48">
              <span className="text-[10px] font-bold text-blue-600 uppercase">Community Impact</span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">Youth STEM & Education</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">500+ Students Reached</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
