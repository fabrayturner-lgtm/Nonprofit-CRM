export type NavigationTab = 
  | 'dashboard'
  | 'contacts'
  | 'gifts'
  | 'organizations'
  | 'governance'
  | 'tasks';

export type ContactRelationshipType = 
  | 'Individual Donor'
  | 'Major Donor'
  | 'Board Member'
  | 'Foundation Officer'
  | 'Corporate Partner'
  | 'Volunteer Leader'
  | 'Community Partner'
  | 'Advisor'
  | string;

export type ContactStatus = 'Active' | 'Prospective' | 'Lapsed' | 'Inactive' | 'Term Ending Soon' | string;

export interface Contact {
  id: string;
  name: string;
  avatarColor: string;
  title: string;
  organizationId?: string;
  organizationName?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  relationshipType: ContactRelationshipType;
  status: ContactStatus;
  assignedTo: string;
  lifetimeGiving: number;
  lastContactDate?: string;
  notes: string;
  aiSummary: string;
  preferredChannel?: 'Email' | 'Phone' | 'In-Person' | 'Mail' | string;
  boardRoles?: string[];
  committeeIds?: string[];
  tags: string[];
  googleWorkspace?: {
    gmailThreadsCount?: number;
    hasDriveFolder?: boolean;
    nextCalendarEvent?: string;
  };
}

export type OrganizationType = 
  | 'Foundation'
  | 'Corporation'
  | 'Nonprofit'
  | 'Nonprofit Partner'
  | 'Government Agency'
  | 'Community Group'
  | 'Family Foundation'
  | string;

export type OrgType = OrganizationType;

export type OrganizationRelationshipStatus = 
  | 'Active Partner'
  | 'Active Funder'
  | 'Major Funder'
  | 'Grant Prospect'
  | 'Grant Applicant'
  | 'Corporate Sponsor'
  | 'Past Funder'
  | 'Community Ally'
  | 'Community Partner'
  | 'Prospective Funder'
  | string;

export type OrgRelationshipStatus = OrganizationRelationshipStatus;

export interface Grant {
  id: string;
  title: string;
  amount?: number;
  amountRequested?: number;
  amountAwarded?: number;
  stage: 'Drafting' | 'Submitted' | 'Under Review' | 'Awarded' | 'Reporting' | 'Completed' | string;
  deadline: string;
  assignedTo: string;
  program?: string;
  programArea?: string;
  organizationId?: string;
  notes?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'Grant Agreement' | 'Form 990' | 'Proposal' | 'MOU' | 'Impact Report' | 'Meeting Minutes' | string;
  date: string;
  size: string;
  googleDriveUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  logoLetter: string;
  logoColor: string;
  type: OrganizationType;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  primaryContactId?: string;
  primaryContactName?: string;
  relationshipStatus: OrganizationRelationshipStatus;
  totalGiving: number;
  lastContactDate?: string;
  assignedTo: string;
  status?: 'Active' | 'Prospective' | 'Lapsed' | 'Archived' | string;
  description?: string;
  notes?: string;
  aiSummary: string;
  programFocus?: string[];
  tags?: string[];
  grants?: Grant[];
  documents?: DocumentItem[];
  googleDriveFolderName?: string;
}

export type GiftType = 
  | 'Individual Gift'
  | 'Individual'
  | 'Major Gift'
  | 'Grant'
  | 'Corporate Match'
  | 'Organizational'
  | 'Pledge'
  | 'Recurring Gift'
  | 'Recurring'
  | 'In-Kind'
  | string;

export type GiftPaymentMethod = 
  | 'ACH / Bank Transfer'
  | 'Credit Card'
  | 'Credit Card / Online'
  | 'Check'
  | 'Stock Transfer'
  | 'DAF (Donor Advised Fund)'
  | 'In-Kind Goods'
  | string;

export type GiftStatus = 'Received' | 'Pledged' | 'Pending Settlement' | 'Written Off' | string;

export interface Gift {
  id: string;
  donorId: string;
  donorName: string;
  donorType?: 'Individual' | 'Organization' | string;
  organizationId?: string;
  organizationName?: string;
  giftDate: string;
  amount: number;
  type: GiftType;
  campaign: string;
  fund: string;
  paymentMethod: GiftPaymentMethod;
  status: GiftStatus;
  thanked: boolean;
  thankedDate?: string;
  receiptSent?: boolean;
  taxReceiptStatus?: 'Sent' | 'Pending' | 'Exempt' | string;
  receiptNumber?: string;
  assignedTo?: string;
  notes?: string;
  recurringFrequency?: 'Monthly' | 'Quarterly' | 'Annually' | string;
  googleDriveReceiptDoc?: string;
}

export type BoardRole = 
  | 'Board Chair'
  | 'Vice Chair'
  | 'Treasurer'
  | 'Secretary'
  | 'Director'
  | 'Committee Chair'
  | 'Ex-Officio'
  | string;

export interface BoardMember {
  id: string;
  contactId: string;
  name: string;
  title?: string;
  boardRole: BoardRole;
  committeeIds?: string[];
  committees?: string[];
  startDate: string;
  termEnd: string;
  termNumber: number;
  status: 'Active' | 'Emeritus' | 'Leave of Absence' | 'Term Ending Soon' | string;
  email?: string;
  contactEmail?: string;
  contactPhone?: string;
  annualGiving?: number;
  lifetimeGiving?: number;
  attendanceRate: number;
  bio?: string;
  tasksCount?: number;
  notes?: string;
}

export interface Committee {
  id: string;
  name: string;
  description: string;
  chairName: string;
  chairId?: string;
  members?: string[];
  memberIds?: string[];
  meetingCadence?: string;
  nextMeeting?: string;
  nextMeetingDate?: string;
}

export interface GovernanceMeeting {
  id: string;
  title: string;
  type: 'Board of Directors' | 'Executive Committee' | 'Finance Committee' | 'Governance Committee' | 'Development Committee' | 'Annual Meeting' | 'Program Committee' | string;
  date: string;
  time: string;
  location: string;
  attendeesCount?: number;
  status?: 'Scheduled' | 'Completed' | 'Draft' | string;
  googleMeetLink?: string;
  googleCalendarEventId?: string;
  agenda?: string[];
  agendaItems?: string[];
  actionItems?: any[];
  notes?: string;
  minutesDocUrl?: string;
  minutesDocument?: string;
}

export type TaskPriority = 'Low' | 'Normal' | 'High' | 'Urgent' | string;
export type TaskStatus = 'Open' | 'Not Started' | 'In Progress' | 'Waiting' | 'Completed' | string;
export type TaskRelatedType = 
  | 'Contact'
  | 'Organization'
  | 'Gift'
  | 'Grant'
  | 'Board Member'
  | 'Committee'
  | 'Meeting'
  | 'Campaign'
  | string;

export interface CRMTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string;
  relatedToType: TaskRelatedType;
  relatedToId: string;
  relatedToName: string;
  notes?: string;
  createdAt?: string;
  completedAt?: string;
  activityHistory?: { date: string; note: string; user: string }[];
}

export interface ActivityItem {
  id: string;
  type: 'Email' | 'Phone Call' | 'Meeting' | 'Note' | 'Gift' | 'Task' | 'Grant Update' | string;
  date: string;
  title: string;
  description: string;
  author: string;
  contactId?: string;
  contactName?: string;
  organizationId?: string;
  organizationName?: string;
  giftId?: string;
  googleWorkspaceSource?: 'Gmail' | 'Google Calendar' | 'Google Drive' | 'Google Forms' | 'CRM Direct' | string;
}

export interface NotificationItem {
  id: string;
  type: 'task' | 'meeting' | 'gift' | 'governance' | 'donor' | 'followup' | string;
  title: string;
  message?: string;
  description?: string;
  timestamp?: string;
  time?: string;
  read: boolean;
  linkId?: string;
  actionTab?: NavigationTab;
  actionId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  orgName: string;
  googleNonprofitVerified: boolean;
}

