import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { CRMTask, TaskPriority, TaskStatus } from '../../types';
import { Badge } from '../common/Badge';
import { TaskDetailModal } from './TaskDetailModal';

export const TasksView: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    completeTask,
    openQuickAdd,
    openAIWithPrompt,
    navigateToContact,
    navigateToOrg,
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [activeModalTask, setActiveModalTask] = useState<CRMTask | null>(null);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.relatedToName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesAssignee = assigneeFilter === 'all' || t.assignedTo === assigneeFilter;

      return matchesSearch && matchesPriority && matchesStatus && matchesAssignee;
    });
  }, [tasks, searchQuery, priorityFilter, statusFilter, assigneeFilter]);

  const uniqueAssignees = Array.from(new Set(tasks.map((t) => t.assignedTo)));

  // KPI calculations
  const myOpenTasks = tasks.filter((t) => t.status !== 'Completed');
  const urgentTasks = tasks.filter((t) => t.status !== 'Completed' && t.priority === 'Urgent');
  const dueThisWeek = tasks.filter((t) => t.status !== 'Completed' && t.dueDate.startsWith('2026-08'));
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Tasks & Follow-up Dashboard
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {myOpenTasks.length} open
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized stewardship follow-ups, grant proposal deadlines, and board action items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAIWithPrompt('What are my most important tasks today?')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Task Prioritizer</span>
          </button>
          <button
            onClick={() => openQuickAdd('task')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Task KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Open Tasks
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {myOpenTasks.length} Active
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Requiring action</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Urgent Priorities
          </span>
          <div className="text-xl font-bold text-rose-600 mt-1">
            {urgentTasks.length} Critical
          </div>
          <span className="text-[10px] text-rose-700 font-medium">Major donors & grants</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Due This Week
          </span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {dueThisWeek.length} Scheduled
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Ahead of deadlines</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Completed Tasks
          </span>
          <div className="text-xl font-bold text-emerald-600 mt-1">
            {completedTasks.length} Resolved
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">100% stewardship record</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, description, or linked contact..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Assignee */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Staff Assignees</option>
            {uniqueAssignees.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-4 w-10 text-center">Done</th>
                <th className="py-3 px-4">Task Description</th>
                <th className="py-3 px-4">Linked CRM Record</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No tasks found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isCompleted = task.status === 'Completed';
                  return (
                    <tr
                      key={task.id}
                      onClick={() => setActiveModalTask(task)}
                      className="hover:bg-indigo-50/20 cursor-pointer transition-colors group"
                    >
                      {/* Done Checkbox */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => completeTask(task.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50'
                          }`}
                        >
                          {isCompleted && '✓'}
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3 px-4">
                        <div
                          className={`font-semibold ${
                            isCompleted
                              ? 'line-through text-slate-400'
                              : 'text-slate-900 group-hover:text-indigo-600'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {task.description}
                        </div>
                      </td>

                      {/* Linked Record */}
                      <td
                        className="py-3 px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (task.relatedToType === 'Contact') {
                            navigateToContact(task.relatedToId);
                          } else if (task.relatedToType === 'Organization') {
                            navigateToOrg(task.relatedToId);
                          }
                        }}
                      >
                        <span className="text-indigo-700 hover:underline font-semibold flex items-center gap-1">
                          <span>{task.relatedToName}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {task.dueDate}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <Badge
                          variant={task.priority === 'Urgent' ? 'danger' : task.priority === 'High' ? 'warning' : 'default'}
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                      </td>

                      {/* Assigned */}
                      <td className="py-3 px-4 text-slate-700">
                        {task.assignedTo}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>

                      {/* Chevron */}
                      <td className="py-3 px-4 text-center">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 inline-block" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={activeModalTask}
        isOpen={!!activeModalTask}
        onClose={() => setActiveModalTask(null)}
      />
    </div>
  );
};
