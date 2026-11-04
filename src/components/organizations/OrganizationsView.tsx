import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Globe,
  Phone,
  DollarSign,
  User,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Organization, OrgType, OrgRelationshipStatus } from '../../types';
import { Badge } from '../common/Badge';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';
import { OrganizationDetailView } from './OrganizationDetailView';

export const OrganizationsView: React.FC = () => {
  const {
    organizations,
    selectedOrgId,
    setSelectedOrgId,
    openQuickAdd,
    openAIWithPrompt,
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // If an organization is selected, show detail view
  if (selectedOrgId) {
    const selectedOrg = organizations.find((o) => o.id === selectedOrgId);
    if (selectedOrg) {
      return (
        <OrganizationDetailView
          org={selectedOrg}
          onBack={() => setSelectedOrgId(null)}
        />
      );
    }
  }

  // Filtered orgs
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (org.primaryContactName && org.primaryContactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        org.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'all' || org.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || org.relationshipStatus === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [organizations, searchQuery, typeFilter, statusFilter]);

  const getOrgTypeBadgeVariant = (type: OrgType) => {
    switch (type) {
      case 'Foundation':
        return 'purple';
      case 'Corporation':
        return 'teal';
      case 'Government Agency':
        return 'info';
      case 'Nonprofit Partner':
        return 'indigo';
      case 'Community Group':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Organizations, Foundations & Corporate Partners
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filteredOrgs.length} organizations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Grantmaking foundations, corporate social responsibility sponsors, and partner agencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAIWithPrompt('Summarize our relationship with ABC Foundation.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Funder Briefing</span>
          </button>
          <button
            onClick={() => openQuickAdd('organization')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Organization</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search organizations by name, contact, type, or focus area..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Org Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Organization Types</option>
            <option value="Foundation">Foundation</option>
            <option value="Corporation">Corporation</option>
            <option value="Government Agency">Government Agency</option>
            <option value="Nonprofit Partner">Nonprofit Partner</option>
            <option value="Community Group">Community Group</option>
          </select>

          {/* Relationship Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Relationship Statuses</option>
            <option value="Active Funder">Active Funder</option>
            <option value="Grant Applicant">Grant Applicant</option>
            <option value="Corporate Sponsor">Corporate Sponsor</option>
            <option value="Community Partner">Community Partner</option>
            <option value="Prospective Funder">Prospective Funder</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table or Card View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Organization Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Primary Contact / Liaison</th>
                  <th className="py-3 px-4">Relationship Status</th>
                  <th className="py-3 px-4 text-right">Total Giving & Grants</th>
                  <th className="py-3 px-4">Last Contact</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No organizations found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrgs.map((org) => (
                    <tr
                      key={org.id}
                      onClick={() => setSelectedOrgId(org.id)}
                      className="hover:bg-indigo-50/20 cursor-pointer transition-colors group"
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${org.logoColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {org.logoLetter}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600">
                              {org.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {org.address.city}, {org.address.state}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4">
                        <Badge variant={getOrgTypeBadgeVariant(org.type)} size="sm">
                          {org.type}
                        </Badge>
                      </td>

                      {/* Primary Contact */}
                      <td className="py-3 px-4">
                        {org.primaryContactName ? (
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{org.primaryContactName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None assigned</span>
                        )}
                      </td>

                      {/* Relationship Status */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {org.relationshipStatus}
                        </span>
                      </td>

                      {/* Total Giving */}
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        ${org.totalGiving.toLocaleString()}
                      </td>

                      {/* Last Contact */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {org.lastContactDate || 'None'}
                      </td>

                      {/* Assigned To */}
                      <td className="py-3 px-4 text-slate-600">
                        {org.assignedTo}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 inline-block transition-transform group-hover:translate-x-0.5" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              onClick={() => setSelectedOrgId(org.id)}
              className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm p-4.5 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl ${org.logoColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                      {org.logoLetter}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                        {org.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {org.type}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getOrgTypeBadgeVariant(org.type)} size="sm">
                    {org.relationshipStatus}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  {org.primaryContactName && (
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Primary Contact: <strong className="text-slate-800 font-semibold">{org.primaryContactName}</strong></span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center gap-1.5 truncate text-[11px]">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-indigo-700 truncate">{org.website}</span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 line-clamp-2 border border-slate-100">
                  <Sparkles className="w-3 h-3 text-indigo-600 inline mr-1" />
                  {org.aiSummary}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Lifetime Support</span>
                  <span className="font-bold text-slate-900">${org.totalGiving.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Staff Lead</span>
                  <span className="text-slate-700 font-medium">{org.assignedTo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
