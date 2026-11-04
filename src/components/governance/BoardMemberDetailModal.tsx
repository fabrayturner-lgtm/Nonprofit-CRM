import React from 'react';
import {
  ShieldCheck,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { BoardMember } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useCRM } from '../../context/CRMContext';

interface BoardMemberDetailModalProps {
  boardMember: BoardMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BoardMemberDetailModal: React.FC<BoardMemberDetailModalProps> = ({
  boardMember,
  isOpen,
  onClose,
}) => {
  const { navigateToContact } = useCRM();

  if (!boardMember) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Board Director Governance Profile"
      subtitle={`${boardMember.boardRole} · MAPLE Inc. Board of Directors`}
      maxWidth="2xl"
      actions={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => {
              onClose();
              navigateToContact(boardMember.contactId);
            }}
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5" />
            <span>Open Full CRM Contact Record</span>
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
      <div className="space-y-5">
        {/* Header Hero */}
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-700 text-white font-bold text-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-purple-950">{boardMember.name}</h3>
              <p className="text-xs text-purple-800 font-medium">{boardMember.boardRole}</p>
            </div>
          </div>
          <Badge variant="purple" size="md">{boardMember.status}</Badge>
        </div>

        {/* Governance Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Board Term</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">Term #{boardMember.termNumber}</span>
            <span className="text-[10px] text-slate-500">{boardMember.startDate} - {boardMember.termEnd}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Attendance Rate</span>
            <span className="text-sm font-bold text-emerald-700 mt-0.5 block">{boardMember.attendanceRate}%</span>
            <span className="text-[10px] text-slate-500">Stated Meetings</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Annual Board Giving</span>
            <span className="text-sm font-bold text-teal-700 mt-0.5 block">${(boardMember.annualGiving || boardMember.lifetimeGiving || 0).toLocaleString()}</span>
            <span className="text-[10px] text-teal-600 font-medium">100% Board Give/Get</span>
          </div>
        </div>

        {/* Committee Memberships */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Assigned Board Committees
          </h4>
          <div className="flex flex-wrap gap-2">
            {(boardMember.committees || []).map((comm, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
              >
                {comm}
              </span>
            ))}
          </div>
        </div>

        {/* Governance Notes */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Director Background & Governance Focus
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">{boardMember.notes}</p>
        </div>
      </div>
    </Modal>
  );
};
