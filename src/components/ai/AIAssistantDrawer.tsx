import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  Bot,
  User,
  History,
  Lightbulb,
  Building2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCRM } from '../../context/CRMContext';

export const AIAssistantDrawer: React.FC = () => {
  const {
    aiDrawerOpen,
    setAiDrawerOpen,
    aiHistory,
    askAI,
    navigateToContact,
    navigateToOrg,
    navigateToTask,
  } = useCRM();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'Who should I follow up with this week?',
    'Summarize our relationship with ABC Foundation.',
    'Show me donors who haven\'t been contacted recently.',
    'What are my most important tasks today?',
    'Which donors need a thank-you?',
    'What board terms expire this year?',
  ];

  const handleSubmit = async (queryText: string) => {
    if (!queryText.trim() || isTyping) return;
    setInputQuery('');
    setIsTyping(true);
    try {
      await askAI(queryText);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAiDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src="/assets/aistudio/MAPLE_Logo_ab678960.png"
                    alt="MAPLE Inc."
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    MAPLE AI Copilot
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-lime-400 text-lime-950 font-bold">
                      Making Aging People Lives Easier
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Donor stewardship, aging care initiatives & governance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close AI drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggested quick chips */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Suggested Questions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(prompt)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-[#1e3a8a] border border-slate-200 text-slate-700 transition-colors shadow-2xs leading-tight"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat message history container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {aiHistory.map((item) => (
                <div key={item.id} className="space-y-2">
                  {/* User Query */}
                  <div className="flex items-start justify-end gap-2">
                    <div className="bg-[#1e3a8a] text-white p-3 rounded-2xl rounded-tr-xs text-xs max-w-[85%] shadow-xs leading-relaxed">
                      {item.query}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#172554] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      MV
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl rounded-tl-xs text-xs text-slate-800 max-w-[90%] shadow-2xs space-y-2">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {item.response}
                      </div>

                      {/* Deep-link action helpers if recognized */}
                      {item.query.toLowerCase().includes('abc foundation') && (
                        <div className="pt-2 border-t border-slate-200 flex gap-2">
                          <button
                            onClick={() => {
                              setAiDrawerOpen(false);
                              navigateToOrg('org-1');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 hover:text-indigo-800 bg-white px-2 py-1 rounded border border-indigo-200"
                          >
                            <Building2 className="w-3 h-3" />
                            <span>Open ABC Foundation Record</span>
                          </button>
                        </div>
                      )}
                      {item.query.toLowerCase().includes('jane smith') && (
                        <div className="pt-2 border-t border-slate-200 flex gap-2">
                          <button
                            onClick={() => {
                              setAiDrawerOpen(false);
                              navigateToContact('cont-1');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 hover:text-indigo-800 bg-white px-2 py-1 rounded border border-indigo-200"
                          >
                            <Users className="w-3 h-3" />
                            <span>View Jane Smith Contact</span>
                          </button>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                        <span>{item.timestamp}</span>
                        <span className="text-[10px] text-slate-400">Context: CRM + Workspace</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-indigo-400 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-500 ml-1">Analyzing CRM records & timeline...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(inputQuery);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask a question about donors, gifts, tasks..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="p-2.5 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] disabled:opacity-40 text-white transition-colors shrink-0 shadow-xs"
                  aria-label="Send AI Query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
