/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ContactsView } from './components/contacts/ContactsView';
import { GiftsView } from './components/gifts/GiftsView';
import { OrganizationsView } from './components/organizations/OrganizationsView';
import { GovernanceView } from './components/governance/GovernanceView';
import { TasksView } from './components/tasks/TasksView';
import { AIAssistantDrawer } from './components/ai/AIAssistantDrawer';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import { X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab } = useCRM();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F9FAFB] font-sans text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile / Tablet Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 flex flex-col w-64 shadow-2xl">
            <Sidebar />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-[-44px] p-2 bg-slate-900 text-white rounded-r-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#F8FAFC]">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] pb-12">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'contacts' && <ContactsView />}
          {activeTab === 'gifts' && <GiftsView />}
          {activeTab === 'organizations' && <OrganizationsView />}
          {activeTab === 'governance' && <GovernanceView />}
          {activeTab === 'tasks' && <TasksView />}
        </main>
      </div>

      {/* Drawers & Global Modals */}
      <AIAssistantDrawer />
      <QuickAddModal />
      <GlobalSearchModal />
      <NotificationsDrawer />
    </div>
  );
};

export default function App() {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
}

