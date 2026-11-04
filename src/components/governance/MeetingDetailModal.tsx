import React from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  FileText,
  Users,
  ExternalLink,
} from 'lucide-react';
import { GovernanceMeeting } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { GoogleWorkspaceBadge } from '../common/GoogleWorkspaceBadge';

interface MeetingDetailModalProps {
  meeting: GovernanceMeeting | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({
  meeting,
  isOpen,
  onClose,
}) => {
  if (!meeting) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Governance Meeting Details"
      subtitle={`${meeting.title} · MAPLE Inc. Governance Calendar`}
      maxWidth="2xl"
      actions={
        <div className="flex items-center justify-between w-full">
          {meeting.googleMeetLink && (
            <a
              href={meeting.googleMeetLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Google Meet Call</span>
            </a>
          )}
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
        {/* Date & Location */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Date</span>
            <span className="font-bold text-slate-900 font-mono mt-0.5 block">{meeting.date}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Time</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{meeting.time}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Type</span>
            <span className="font-semibold text-purple-800 mt-0.5 block">{meeting.type}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Location</span>
            <span className="font-semibold text-slate-800 truncate mt-0.5 block">{meeting.location}</span>
          </div>
        </div>

        {/* Agenda */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Meeting Agenda & Orders of Business
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {(meeting.agenda || meeting.agendaItems || []).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-teal-600 font-bold">{idx + 1}.</span>
                <span>{typeof item === 'string' ? item : (item as any)?.title || ''}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        {(meeting.actionItems || []).length > 0 && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Governance Action Items & Resolutions
            </h4>
            <div className="space-y-1 text-xs">
              {(meeting.actionItems || []).map((act, idx) => {
                const title = typeof act === 'string' ? act : (act as any)?.title || '';
                return (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-amber-50/60 rounded-lg border border-amber-100 text-amber-950 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Google Workspace Integration */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GoogleWorkspaceBadge type="calendar" label="Google Calendar Event Synced" />
            <span>Invitations sent to all board directors</span>
          </div>
          {meeting.minutesDocUrl && (
            <span className="text-teal-700 font-semibold flex items-center gap-1 cursor-pointer hover:underline">
              <FileText className="w-3.5 h-3.5" />
              <span>Minutes Doc</span>
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};
