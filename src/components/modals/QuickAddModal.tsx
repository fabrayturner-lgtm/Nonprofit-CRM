import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Building,
  Heart,
  CheckSquare,
  FileText,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Modal } from '../common/Modal';
import {
  ContactRelationshipType,
  OrgType,
  OrgRelationshipStatus,
  GiftType,
  TaskPriority,
} from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    quickAddOpen,
    quickAddType,
    closeQuickAdd,
    addContact,
    addOrganization,
    addGift,
    addTask,
    addActivity,
    currentUser,
    contacts,
    organizations,
    navigateToContact,
    navigateToOrg,
    navigateToGift,
    navigateToTask,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<
    'contact' | 'organization' | 'gift' | 'task' | 'note' | 'meeting'
  >('contact');

  useEffect(() => {
    if (quickAddType) {
      setActiveTab(quickAddType);
    }
  }, [quickAddType]);

  // Form states
  // 1. Contact Form
  const [contactName, setContactName] = useState('');
  const [contactTitle, setContactTitle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactOrgId, setContactOrgId] = useState('');
  const [contactRelType, setContactRelType] = useState<ContactRelationshipType>('Individual Donor');
  const [contactNotes, setContactNotes] = useState('');

  // 2. Organization Form
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('Foundation');
  const [orgRelStatus, setOrgRelStatus] = useState<OrgRelationshipStatus>('Active Funder');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgPrimaryContact, setOrgPrimaryContact] = useState('');
  const [orgNotes, setOrgNotes] = useState('');

  // 3. Gift Form
  const [giftDonorName, setGiftDonorName] = useState('');
  const [giftOrgId, setGiftOrgId] = useState('');
  const [giftAmount, setGiftAmount] = useState('1000');
  const [giftType, setGiftType] = useState<GiftType>('Individual');
  const [giftCampaign, setGiftCampaign] = useState('2026 Annual Impact Fund');
  const [giftFund, setGiftFund] = useState('Youth Education & Mentorship');
  const [giftMethod, setGiftMethod] = useState('Credit Card / Online');

  // 4. Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('2026-08-30');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('Normal');
  const [taskRelatedName, setTaskRelatedName] = useState('');

  // 5. Note / Activity Form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteType, setNoteType] = useState<'Note' | 'Phone Call' | 'Email' | 'Meeting'>('Note');
  const [noteContactName, setNoteContactName] = useState('');

  const resetAll = () => {
    setContactName('');
    setContactTitle('');
    setContactEmail('');
    setContactPhone('');
    setOrgName('');
    setTaskTitle('');
    setNoteTitle('');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;

    const chosenOrg = organizations.find((o) => o.id === contactOrgId);

    const newContact = addContact({
      name: contactName,
      title: contactTitle || 'Supporter',
      organizationId: contactOrgId || undefined,
      organizationName: chosenOrg ? chosenOrg.name : undefined,
      email: contactEmail || `${contactName.toLowerCase().replace(/\s+/g, '.')}@example.org`,
      phone: contactPhone || '(415) 555-0199',
      address: {
        street: '100 Community Way',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
      },
      relationshipType: contactRelType,
      status: 'Active',
      assignedTo: currentUser.name,
      lifetimeGiving: 0,
      notes: contactNotes || 'Newly created supporter record.',
      aiSummary: `${contactName} was recently added to MAPLE Inc. CRM as ${contactRelType}. Stewardship plan should be initiated.`,
      tags: ['New Contact', '2026 Cohort'],
      avatarColor: 'bg-teal-600',
      preferredChannel: 'Email',
      googleWorkspace: {
        gmailThreadsCount: 0,
        hasDriveFolder: true,
      },
    });

    resetAll();
    closeQuickAdd();
    navigateToContact(newContact.id);
  };

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    const newOrg = addOrganization({
      name: orgName,
      type: orgType,
      relationshipStatus: orgRelStatus,
      website: orgWebsite || `${orgName.toLowerCase().replace(/[^a-z0-9]/g, '')}.org`,
      phone: '(415) 555-8800',
      address: {
        street: '500 Market St Suite 300',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
      },
      primaryContactName: orgPrimaryContact || undefined,
      assignedTo: currentUser.name,
      totalGiving: 0,
      notes: orgNotes || 'Newly added organizational partner.',
      aiSummary: `${orgName} added to CRM as ${orgType}. Ready for relationship development and grant inquiry.`,
      tags: ['New Partner', orgType],
      logoColor: 'bg-purple-600',
      logoLetter: orgName.charAt(0).toUpperCase(),
    });

    resetAll();
    closeQuickAdd();
    navigateToOrg(newOrg.id);
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donor = contacts.find((c) => c.name === giftDonorName) || contacts[0];
    const org = organizations.find((o) => o.id === giftOrgId);

    const newGift = addGift({
      donorId: donor ? donor.id : 'cont-1',
      donorName: giftDonorName || (donor ? donor.name : 'Jane Smith'),
      organizationId: giftOrgId || undefined,
      organizationName: org ? org.name : undefined,
      amount: Number(giftAmount) || 500,
      giftDate: new Date().toISOString().split('T')[0],
      type: giftType,
      campaign: giftCampaign,
      fund: giftFund,
      paymentMethod: giftMethod,
      status: 'Received',
      thanked: false,
      taxReceiptStatus: 'Pending',
      notes: 'Recorded via quick add.',
    });

    resetAll();
    closeQuickAdd();
    navigateToGift(newGift.id);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const newTask = addTask({
      title: taskTitle,
      description: taskDescription || 'Follow up required.',
      dueDate: taskDueDate,
      priority: taskPriority,
      status: 'Open',
      assignedTo: currentUser.name,
      relatedToType: 'Contact',
      relatedToId: 'cont-1',
      relatedToName: taskRelatedName || 'Jane Smith',
    });

    resetAll();
    closeQuickAdd();
    navigateToTask(newTask.id);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    addActivity({
      type: noteType,
      title: noteTitle,
      description: noteDesc || 'Log recorded in CRM.',
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      contactName: noteContactName || 'Jane Smith',
      googleWorkspaceSource: 'CRM Direct',
    });

    resetAll();
    closeQuickAdd();
  };

  return (
    <Modal
      isOpen={quickAddOpen}
      onClose={closeQuickAdd}
      title="Quick Add Record"
      subtitle="Create contacts, organizations, gifts, tasks, or log communications"
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'contact' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Contact</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('organization')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'organization' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-indigo-600" />
            <span>Organization</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gift')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'gift' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Gift</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'task' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('note')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'note' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Activity Log</span>
          </button>
        </div>

        {/* 1. Contact Form */}
        {activeTab === 'contact' && (
          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Eleanor Vance"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Director, Major Donor"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="eleanor@example.org"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="(415) 555-0199"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Affiliation</label>
                <select
                  value={contactOrgId}
                  onChange={(e) => setContactOrgId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">None (Individual)</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship Type</label>
                <select
                  value={contactRelType}
                  onChange={(e) => setContactRelType(e.target.value as ContactRelationshipType)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Individual Donor">Individual Donor</option>
                  <option value="Major Donor">Major Donor</option>
                  <option value="Foundation Officer">Foundation Officer</option>
                  <option value="Board Member">Board Member</option>
                  <option value="Corporate Partner">Corporate Partner</option>
                  <option value="Volunteer Leader">Volunteer Leader</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Stewardship Notes</label>
              <textarea
                rows={2}
                placeholder="Background context, communication preferences..."
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeQuickAdd}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}

        {/* 2. Organization Form */}
        {activeTab === 'organization' && (
          <form onSubmit={handleOrgSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Family Foundation"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as OrgType)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Foundation">Foundation</option>
                  <option value="Corporation">Corporation</option>
                  <option value="Government Agency">Government Agency</option>
                  <option value="Nonprofit Partner">Nonprofit Partner</option>
                  <option value="Community Group">Community Group</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relationship Status</label>
                <select
                  value={orgRelStatus}
                  onChange={(e) => setOrgRelStatus(e.target.value as OrgRelationshipStatus)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Active Funder">Active Funder</option>
                  <option value="Grant Applicant">Grant Applicant</option>
                  <option value="Corporate Sponsor">Corporate Sponsor</option>
                  <option value="Community Partner">Community Partner</option>
                  <option value="Prospective Funder">Prospective Funder</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website</label>
                <input
                  type="text"
                  placeholder="www.horizonfoundation.org"
                  value={orgWebsite}
                  onChange={(e) => setOrgWebsite(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeQuickAdd}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
              >
                Save Organization
              </button>
            </div>
          </form>
        )}

        {/* 3. Gift Form */}
        {activeTab === 'gift' && (
          <form onSubmit={handleGiftSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Donor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Smith"
                  value={giftDonorName}
                  onChange={(e) => setGiftDonorName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount ($) *</label>
                <input
                  type="number"
                  required
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gift Type</label>
                <select
                  value={giftType}
                  onChange={(e) => setGiftType(e.target.value as GiftType)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Individual">Individual</option>
                  <option value="Grant">Grant</option>
                  <option value="Organizational">Organizational</option>
                  <option value="Pledge">Pledge</option>
                  <option value="Recurring">Recurring</option>
                  <option value="In-Kind">In-Kind</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designated Fund</label>
                <input
                  type="text"
                  value={giftFund}
                  onChange={(e) => setGiftFund(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeQuickAdd}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
              >
                Record Gift & Sync Ledger
              </button>
            </div>
          </form>
        )}

        {/* 4. Task Form */}
        {activeTab === 'task' && (
          <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Follow up on Q4 major donor pledge"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Related Contact / Donor</label>
              <input
                type="text"
                placeholder="e.g. Jane Smith"
                value={taskRelatedName}
                onChange={(e) => setTaskRelatedName(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeQuickAdd}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        )}

        {/* 5. Note Form */}
        {activeTab === 'note' && (
          <form onSubmit={handleNoteSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Type</label>
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Note">Note / Memo</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Email">Email Thread</option>
                  <option value="Meeting">Meeting Minutes</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Smith"
                  value={noteContactName}
                  onChange={(e) => setNoteContactName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Summary Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Strategy call regarding fall grant submission"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Details & Outcomes</label>
              <textarea
                rows={3}
                placeholder="Discussion notes, participant reactions, agreed follow-up..."
                value={noteDesc}
                onChange={(e) => setNoteDesc(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeQuickAdd}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
              >
                Log Activity
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
