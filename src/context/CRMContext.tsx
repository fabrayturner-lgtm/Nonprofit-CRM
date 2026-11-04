import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  NavigationTab,
  Contact,
  Organization,
  Gift,
  BoardMember,
  Committee,
  GovernanceMeeting,
  CRMTask,
  ActivityItem,
  NotificationItem,
  UserProfile,
} from '../types';
import {
  CURRENT_USER,
  INITIAL_CONTACTS,
  INITIAL_ORGANIZATIONS,
  INITIAL_GIFTS,
  INITIAL_BOARD_MEMBERS,
  INITIAL_COMMITTEES,
  INITIAL_MEETINGS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  MOCK_AI_KNOWLEDGE_BASE,
} from '../data/mockData';

interface AIHistoryItem {
  id: string;
  query: string;
  response: string;
  timestamp: string;
}

interface CRMContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedContactId: string | null;
  setSelectedContactId: (id: string | null) => void;
  selectedOrgId: string | null;
  setSelectedOrgId: (id: string | null) => void;
  selectedGiftId: string | null;
  setSelectedGiftId: (id: string | null) => void;
  selectedBoardMemberId: string | null;
  setSelectedBoardMemberId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedMeetingId: string | null;
  setSelectedMeetingId: (id: string | null) => void;

  // Jump navigators
  navigateToContact: (id: string) => void;
  navigateToOrg: (id: string) => void;
  navigateToGift: (id: string) => void;
  navigateToTask: (id: string) => void;
  navigateToMeeting: (id: string) => void;
  navigateToBoardMember: (id: string) => void;

  // Data Collections
  contacts: Contact[];
  organizations: Organization[];
  gifts: Gift[];
  boardMembers: BoardMember[];
  committees: Committee[];
  meetings: GovernanceMeeting[];
  tasks: CRMTask[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  currentUser: UserProfile;

  // Operations
  addContact: (contact: Omit<Contact, 'id'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  addOrganization: (org: Omit<Organization, 'id'>) => Organization;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;
  addGift: (gift: Omit<Gift, 'id'>) => Gift;
  updateGift: (id: string, updates: Partial<Gift>) => void;
  markGiftThanked: (giftId: string, notes?: string) => void;
  thankDonor: (giftId: string, notes?: string) => void;
  addTask: (task: Omit<CRMTask, 'id' | 'createdAt' | 'activityHistory'>) => CRMTask;
  updateTask: (id: string, updates: Partial<CRMTask>) => void;
  completeTask: (id: string) => void;
  addActivity: (activity: Omit<ActivityItem, 'id'>) => ActivityItem;
  addMeeting: (meeting: Omit<GovernanceMeeting, 'id'>) => GovernanceMeeting;
  updateMeeting: (id: string, updates: Partial<GovernanceMeeting>) => void;
  markNotificationRead: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Global UI Modals
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  quickAddDefaultTab?: string;
  quickAddType?: string;
  openQuickAdd: (type?: string) => void;
  closeQuickAdd: () => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  // AI Assistant
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  aiHistory: AIHistoryItem[];
  askAI: (query: string) => Promise<string>;
  openAIWithPrompt: (prompt: string) => void;

  // Thank Donor Modal
  thankModalGift: Gift | null;
  setThankModalGift: (gift: Gift | null) => void;

  // KPI Calculations
  kpiStats: {
    totalGiftsYTD: number;
    activeDonorsCount: number;
    openTasksCount: number;
    upcomingMeetingsCount: number;
    totalOrgsCount: number;
    totalContactsCount: number;
    giftsThisMonth: number;
    pledgedAmount: number;
    outstandingPledges: number;
    averageGift: number;
    averageGiftSize: number;
    totalGiftCount: number;
  };
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTabState] = useState<NavigationTab>('dashboard');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [selectedBoardMemberId, setSelectedBoardMemberId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  // Data States
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [gifts, setGifts] = useState<Gift[]>(INITIAL_GIFTS);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>(INITIAL_BOARD_MEMBERS);
  const [committees, setCommittees] = useState<Committee[]>(INITIAL_COMMITTEES);
  const [meetings, setMeetings] = useState<GovernanceMeeting[]>(INITIAL_MEETINGS);
  const [tasks, setTasks] = useState<CRMTask[]>(INITIAL_TASKS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const currentUser = CURRENT_USER;

  // Modal States
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddDefaultTab, setQuickAddDefaultTab] = useState<string | undefined>(undefined);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [thankModalGift, setThankModalGift] = useState<Gift | null>(null);

  // AI Assistant State
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiHistory, setAiHistory] = useState<AIHistoryItem[]>([
    {
      id: 'ai-init-1',
      query: 'Who should I follow up with this week?',
      response: `**Priority Relationship Touchpoints for This Week:**
1. **Jane Smith (ABC Foundation)** — Submit the requested STEM instructor budget breakdown ahead of their grant committee review.
2. **Grace Holloway (North Star Family Office)** — Send thank-you note acknowledging the $25,000 anonymous DAF grant.
3. **Sarah Williams** — Deliver personal Executive Director letter and photo packet for her $15,000 leadership gift.
4. **Eleanor Vance-Pinnacle** — Align on board chair succession timeline prior to the September 24 board meeting.`,
      timestamp: '2 hours ago',
    },
  ]);

  // Tab switcher resets child detail views if switching top-level
  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
  };

  const navigateToContact = (id: string) => {
    setSelectedContactId(id);
    setActiveTabState('contacts');
  };

  const navigateToOrg = (id: string) => {
    setSelectedOrgId(id);
    setActiveTabState('organizations');
  };

  const navigateToGift = (id: string) => {
    setSelectedGiftId(id);
    setActiveTabState('gifts');
  };

  const navigateToTask = (id: string) => {
    setSelectedTaskId(id);
    setActiveTabState('tasks');
  };

  const navigateToMeeting = (id: string) => {
    setSelectedMeetingId(id);
    setActiveTabState('governance');
  };

  const navigateToBoardMember = (id: string) => {
    setSelectedBoardMemberId(id);
    setActiveTabState('governance');
  };

  const openQuickAdd = (type?: string) => {
    setQuickAddDefaultTab(type);
    setQuickAddOpen(true);
  };

  // Operations
  const addContact = (newContactData: Omit<Contact, 'id'>): Contact => {
    const id = `cont-${Date.now()}`;
    const newContact: Contact = { ...newContactData, id };
    setContacts(prev => [newContact, ...prev]);

    // Add activity
    addActivity({
      type: 'Note',
      date: new Date().toISOString().split('T')[0],
      title: `Added new contact: ${newContact.name}`,
      description: `Contact created with role ${newContact.title} (${newContact.relationshipType})`,
      author: currentUser.name,
      contactId: id,
      contactName: newContact.name,
      organizationId: newContact.organizationId,
      organizationName: newContact.organizationName,
    });

    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addOrganization = (newOrgData: Omit<Organization, 'id'>): Organization => {
    const id = `org-${Date.now()}`;
    const newOrg: Organization = { ...newOrgData, id };
    setOrganizations(prev => [newOrg, ...prev]);

    addActivity({
      type: 'Note',
      date: new Date().toISOString().split('T')[0],
      title: `Added organization: ${newOrg.name}`,
      description: `${newOrg.type} record created. Status: ${newOrg.relationshipStatus}`,
      author: currentUser.name,
      organizationId: id,
      organizationName: newOrg.name,
    });

    return newOrg;
  };

  const updateOrganization = (id: string, updates: Partial<Organization>) => {
    setOrganizations(prev => prev.map(o => (o.id === id ? { ...o, ...updates } : o)));
  };

  const addGift = (newGiftData: Omit<Gift, 'id'>): Gift => {
    const id = `gift-${Date.now()}`;
    const newGift: Gift = { ...newGiftData, id };
    setGifts(prev => [newGift, ...prev]);

    // Update contact lifetime giving
    if (newGift.status === 'Received') {
      setContacts(prev =>
        prev.map(c => {
          if (c.id === newGift.donorId) {
            return {
              ...c,
              lifetimeGiving: (c.lifetimeGiving || 0) + newGift.amount,
              lastContactDate: newGift.giftDate,
            };
          }
          return c;
        })
      );

      // Update organization total giving if applicable
      if (newGift.organizationId) {
        setOrganizations(prev =>
          prev.map(o => {
            if (o.id === newGift.organizationId) {
              return {
                ...o,
                totalGiving: (o.totalGiving || 0) + newGift.amount,
                lastContactDate: newGift.giftDate,
              };
            }
            return o;
          })
        );
      }
    }

    // Add activity
    addActivity({
      type: 'Gift',
      date: newGift.giftDate,
      title: `Received $${newGift.amount.toLocaleString()} ${newGift.type}`,
      description: `Recorded gift from ${newGift.donorName} for ${newGift.campaign} (${newGift.fund})`,
      author: currentUser.name,
      contactId: newGift.donorType === 'Individual' ? newGift.donorId : undefined,
      contactName: newGift.donorName,
      organizationId: newGift.organizationId,
      organizationName: newGift.organizationName,
      giftId: id,
    });

    return newGift;
  };

  const updateGift = (id: string, updates: Partial<Gift>) => {
    setGifts(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const markGiftThanked = (giftId: string, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setGifts(prev =>
      prev.map(g => {
        if (g.id === giftId) {
          return {
            ...g,
            thanked: true,
            thankedDate: today,
            notes: notes ? `${g.notes || ''} | Thank-you note sent: ${notes}` : g.notes,
          };
        }
        return g;
      })
    );

    const gift = gifts.find(g => g.id === giftId);
    if (gift) {
      addActivity({
        type: 'Email',
        date: today,
        title: `Sent Thank-You to ${gift.donorName}`,
        description: `Formal acknowledgment sent for $${gift.amount.toLocaleString()} gift (${gift.campaign}) via Gmail.`,
        author: currentUser.name,
        contactId: gift.donorId,
        contactName: gift.donorName,
        organizationId: gift.organizationId,
        organizationName: gift.organizationName,
        giftId: gift.id,
        googleWorkspaceSource: 'Gmail',
      });
    }
  };

  const addTask = (newTaskData: Omit<CRMTask, 'id' | 'createdAt' | 'activityHistory'>): CRMTask => {
    const id = `task-${Date.now()}`;
    const newTask: CRMTask = {
      ...newTaskData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      activityHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          note: 'Task created.',
          user: currentUser.name,
        },
      ],
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<CRMTask>) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          return updated;
        }
        return t;
      })
    );
  };

  const completeTask = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status: 'Completed',
            completedAt: today,
            activityHistory: [
              ...(t.activityHistory || []),
              { date: today, note: 'Marked completed.', user: currentUser.name },
            ],
          };
        }
        return t;
      })
    );
  };

  const addActivity = (activityData: Omit<ActivityItem, 'id'>): ActivityItem => {
    const id = `act-${Date.now()}`;
    const newAct: ActivityItem = { ...activityData, id };
    setActivities(prev => [newAct, ...prev]);
    return newAct;
  };

  const addMeeting = (meetingData: Omit<GovernanceMeeting, 'id'>): GovernanceMeeting => {
    const id = `meet-${Date.now()}`;
    const newMeet: GovernanceMeeting = { ...meetingData, id };
    setMeetings(prev => [newMeet, ...prev]);
    return newMeet;
  };

  const updateMeeting = (id: string, updates: Partial<GovernanceMeeting>) => {
    setMeetings(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // AI Prompt handler with semantic mock fallback
  const askAI = async (query: string): Promise<string> => {
    const cleanQ = query.toLowerCase().trim();
    let bestMatch = MOCK_AI_KNOWLEDGE_BASE.find(k =>
      k.keywords.some(kw => cleanQ.includes(kw))
    );

    // Simulate realistic AI deliberation
    await new Promise(res => setTimeout(res, 600));

    let responseText = '';
    if (bestMatch) {
      responseText = bestMatch.answer;
    } else {
      // Dynamic fallback based on context
      responseText = `**CRM Intelligence Analysis for "${query}":**
- **Contacts in scope**: ${contacts.length} active relationships indexed.
- **Top Funder**: Seattle Community Foundation ($160,000) & ABC Foundation ($125,000).
- **Recent Momentum**: $${gifts.reduce((sum, g) => (g.status === 'Received' ? sum + g.amount : sum), 0).toLocaleString()} raised in tracked gifts.
- **Recommendations**: Continue cultivating major gifts for the upcoming Fall Gala and ensure board term nominations are finalized before the September 24 Stated Meeting.`;
    }

    const newItem: AIHistoryItem = {
      id: `ai-${Date.now()}`,
      query,
      response: responseText,
      timestamp: 'Just now',
    };

    setAiHistory(prev => [newItem, ...prev]);
    return responseText;
  };

  const openAIWithPrompt = (prompt: string) => {
    setAiDrawerOpen(true);
    askAI(prompt);
  };

  // KPI Calculations
  const kpiStats = useMemo(() => {
    const receivedGifts = gifts.filter(g => g.status === 'Received');
    const totalGiftsYTD = receivedGifts.reduce((sum, g) => sum + g.amount, 0);
    const activeDonorsCount = new Set(receivedGifts.map(g => g.donorId)).size;
    const openTasksCount = tasks.filter(t => t.status !== 'Completed').length;
    const upcomingMeetingsCount = meetings.filter(m => m.status === 'Scheduled').length;
    const totalOrgsCount = organizations.length;
    const totalContactsCount = contacts.length;

    // Gifts this month (August 2026 in demo or current month)
    const giftsThisMonth = receivedGifts
      .filter(g => g.giftDate.startsWith('2026-08'))
      .reduce((sum, g) => sum + g.amount, 0);

    const pledgedGifts = gifts.filter(g => g.status === 'Pledged');
    const pledgedAmount = pledgedGifts.reduce((sum, g) => sum + g.amount, 0);
    const outstandingPledges = pledgedGifts.length;
    const averageGift = receivedGifts.length > 0 ? Math.round(totalGiftsYTD / receivedGifts.length) : 0;
    const averageGiftSize = averageGift;
    const totalGiftCount = receivedGifts.length;

    return {
      totalGiftsYTD,
      activeDonorsCount,
      openTasksCount,
      upcomingMeetingsCount,
      totalOrgsCount,
      totalContactsCount,
      giftsThisMonth,
      pledgedAmount,
      outstandingPledges,
      averageGift,
      averageGiftSize,
      totalGiftCount,
    };
  }, [gifts, tasks, meetings, organizations, contacts]);

  return (
    <CRMContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedContactId,
        setSelectedContactId,
        selectedOrgId,
        setSelectedOrgId,
        selectedGiftId,
        setSelectedGiftId,
        selectedBoardMemberId,
        setSelectedBoardMemberId,
        selectedTaskId,
        setSelectedTaskId,
        selectedMeetingId,
        setSelectedMeetingId,
        navigateToContact,
        navigateToOrg,
        navigateToGift,
        navigateToTask,
        navigateToMeeting,
        navigateToBoardMember,
        contacts,
        organizations,
        gifts,
        boardMembers,
        committees,
        meetings,
        tasks,
        activities,
        notifications,
        currentUser,
        addContact,
        updateContact,
        addOrganization,
        updateOrganization,
        addGift,
        updateGift,
        markGiftThanked,
        thankDonor: markGiftThanked,
        addTask,
        updateTask,
        completeTask,
        addActivity,
        addMeeting,
        updateMeeting,
        markNotificationRead,
        markNotificationAsRead: markNotificationRead,
        markAllNotificationsRead,
        quickAddOpen,
        setQuickAddOpen,
        quickAddDefaultTab,
        quickAddType: quickAddDefaultTab,
        openQuickAdd,
        closeQuickAdd: () => setQuickAddOpen(false),
        globalSearchOpen,
        setGlobalSearchOpen,
        notificationsOpen,
        setNotificationsOpen,
        aiDrawerOpen,
        setAiDrawerOpen,
        aiHistory,
        askAI,
        openAIWithPrompt,
        thankModalGift,
        setThankModalGift,
        kpiStats,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
