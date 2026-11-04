import React from 'react';
import {
  CheckSquare,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { CRMTask } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useCRM } from '../../context/CRMContext';

interface TaskDetailModalProps {
  task: CRMTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const { completeTask, navigateToContact, navigateToOrg } = useCRM();

  if (!task) return null;

  const isCompleted = task.status === 'Completed';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task & Follow-up Item"
      subtitle={`Task ID: ${task.id} · MAPLE Inc. Action Item`}
      maxWidth="lg"
      actions={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => {
              completeTask(task.id);
              onClose();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
              isCompleted
                ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isCompleted ? 'Mark Incomplete' : '✓ Mark Completed'}
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant={task.priority === 'Urgent' ? 'danger' : 'warning'} size="sm">
              {task.priority} Priority
            </Badge>
            <Badge variant={isCompleted ? 'success' : 'default'} size="sm">
              {task.status}
            </Badge>
          </div>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {task.title}
          </h3>
        </div>

        {/* Description */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          {task.description}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Due Date</span>
            <span className="font-bold text-slate-900 font-mono mt-0.5 block">{task.dueDate}</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Staff</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{task.assignedTo}</span>
          </div>
        </div>

        {/* Related Record */}
        <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-teal-800 block">Linked Record</span>
            <span className="text-xs font-bold text-slate-900">{task.relatedToName}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              if (task.relatedToType === 'Contact') {
                navigateToContact(task.relatedToId);
              } else if (task.relatedToType === 'Organization') {
                navigateToOrg(task.relatedToId);
              }
            }}
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
          >
            <span>Open Record</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
