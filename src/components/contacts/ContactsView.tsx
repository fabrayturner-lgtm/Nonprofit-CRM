import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  UserCheck,
  ChevronRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Contact, ContactRelationshipType, ContactStatus } from '../../types';
import { Badge } from '../common/Badge';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';
import { ContactDetailView } from './ContactDetailView';

export const ContactsView: React.FC = () => {
  const {
    contacts,
    selectedContactId,
    setSelectedContactId,
    openQuickAdd,
    openAIWithPrompt,
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // If a contact is selected, show the ContactDetailView
  if (selectedContactId) {
    const selectedContact = contacts.find((c) => c.id === selectedContactId);
    if (selectedContact) {
      return (
        <ContactDetailView
          contact={selectedContact}
          onBack={() => setSelectedContactId(null)}
        />
      );
    }
  }

  // Filtered contacts list
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.organizationName && c.organizationName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRel =
        relationshipFilter === 'all' || c.relationshipType === relationshipFilter;

      const matchesStatus =
        statusFilter === 'all' || c.status === statusFilter;

      const matchesAssigned =
        assignedFilter === 'all' || c.assignedTo === assignedFilter;

      return matchesSearch && matchesRel && matchesStatus && matchesAssigned;
    });
  }, [contacts, searchQuery, relationshipFilter, statusFilter, assignedFilter]);

  const uniqueAssignees = Array.from(new Set(contacts.map((c) => c.assignedTo)));

  const getRelationshipBadgeVariant = (type: ContactRelationshipType) => {
    switch (type) {
      case 'Major Donor':
        return 'success';
      case 'Foundation Officer':
        return 'purple';
      case 'Board Member':
        return 'indigo';
      case 'Corporate Partner':
        return 'teal';
      case 'Volunteer Leader':
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
              Contacts & Key Relationships
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filteredContacts.length} of {contacts.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Donors, board members, foundation officers, corporate liaisons, and community allies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAIWithPrompt('Show me donors who haven\'t been contacted recently.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Donor Insights</span>
          </button>
          <button
            onClick={() => openQuickAdd('contact')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, organization, title, email, or tag..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Dropdown filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Relationship type */}
          <select
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Relationship Types</option>
            <option value="Individual Donor">Individual Donor</option>
            <option value="Major Donor">Major Donor</option>
            <option value="Board Member">Board Member</option>
            <option value="Foundation Officer">Foundation Officer</option>
            <option value="Corporate Partner">Corporate Partner</option>
            <option value="Volunteer Leader">Volunteer Leader</option>
            <option value="Community Partner">Community Partner</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Prospective">Prospective</option>
            <option value="Lapsed">Lapsed</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Assigned Staff */}
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Assigned Staff</option>
            {uniqueAssignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>

          {/* View mode switcher */}
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

      {/* Main List Rendering (Table or Cards) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Name & Title</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Last Contact</th>
                  <th className="py-3 px-4 text-right">Lifetime Giving</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No contacts found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => setSelectedContactId(contact.id)}
                      className="hover:bg-indigo-50/20 cursor-pointer transition-colors group"
                    >
                      {/* Name & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${contact.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {contact.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1.5">
                              <span>{contact.name}</span>
                              {contact.googleWorkspace?.gmailThreadsCount ? (
                                <span className="text-[10px] text-red-600 font-mono" title={`${contact.googleWorkspace.gmailThreadsCount} Gmail threads`}>
                                  · ✉ {contact.googleWorkspace.gmailThreadsCount}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {contact.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="py-3 px-4">
                        {contact.organizationName ? (
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{contact.organizationName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Individual</span>
                        )}
                      </td>

                      {/* Relationship */}
                      <td className="py-3 px-4">
                        <Badge
                          variant={getRelationshipBadgeVariant(contact.relationshipType)}
                          size="sm"
                        >
                          {contact.relationshipType}
                        </Badge>
                      </td>

                      {/* Last Contact */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {contact.lastContactDate || 'None'}
                      </td>

                      {/* Lifetime Giving */}
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        ${contact.lifetimeGiving.toLocaleString()}
                      </td>

                      {/* Assigned To */}
                      <td className="py-3 px-4 text-slate-600">
                        {contact.assignedTo}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            contact.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : contact.status === 'Prospective'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              contact.status === 'Active'
                                ? 'bg-emerald-500'
                                : contact.status === 'Prospective'
                                ? 'bg-sky-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          {contact.status}
                        </span>
                      </td>

                      {/* Action Chevron */}
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
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContactId(contact.id)}
              className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm p-4.5 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-full ${contact.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                      {contact.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                        {contact.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {contact.title}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getRelationshipBadgeVariant(contact.relationshipType)} size="sm">
                    {contact.relationshipType}
                  </Badge>
                </div>

                {contact.organizationName && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium mb-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{contact.organizationName}</span>
                  </div>
                )}

                <div className="space-y-1 text-xs text-slate-600 mb-3">
                  <div className="flex items-center gap-1.5 truncate text-[11px]">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{contact.phone}</span>
                  </div>
                </div>

                {/* AI Snippet */}
                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 line-clamp-2 border border-slate-100">
                  <Sparkles className="w-3 h-3 text-teal-600 inline mr-1" />
                  {contact.aiSummary}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Lifetime Giving</span>
                  <span className="font-bold text-slate-900">${contact.lifetimeGiving.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Assigned</span>
                  <span className="text-slate-700 font-medium">{contact.assignedTo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
