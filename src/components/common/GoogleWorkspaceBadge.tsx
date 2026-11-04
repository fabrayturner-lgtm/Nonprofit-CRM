import React from 'react';
import { Mail, Calendar, Folder, Video, FileText, CheckCircle2 } from 'lucide-react';

interface GoogleWorkspaceBadgeProps {
  type: 'gmail' | 'calendar' | 'drive' | 'meet' | 'docs' | 'nonprofit-verified';
  count?: number;
  label?: string;
  className?: string;
}

export const GoogleWorkspaceBadge: React.FC<GoogleWorkspaceBadgeProps> = ({
  type,
  count,
  label,
  className = '',
}) => {
  if (type === 'nonprofit-verified') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium ${className}`}
        title="Google for Nonprofits Verified Workspace"
      >
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
        <span className="font-semibold text-sky-900">Google Workspace</span>
        <span className="text-sky-700">· Nonprofits</span>
      </div>
    );
  }

  if (type === 'gmail') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200 ${className}`}
        title="Gmail Thread Sync Active"
      >
        <Mail className="w-3 h-3 text-red-600" />
        <span>Gmail {count !== undefined ? `(${count} threads)` : label || 'Linked'}</span>
      </div>
    );
  }

  if (type === 'calendar') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
        title="Google Calendar Synced"
      >
        <Calendar className="w-3 h-3 text-blue-600" />
        <span>{label || 'Google Calendar'}</span>
      </div>
    );
  }

  if (type === 'drive') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        title="Google Drive Document Repository"
      >
        <Folder className="w-3 h-3 text-emerald-600" />
        <span>{label || 'Google Drive'}</span>
      </div>
    );
  }

  if (type === 'meet') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        title="Google Meet Video Link"
      >
        <Video className="w-3 h-3 text-amber-600" />
        <span>{label || 'Google Meet'}</span>
      </div>
    );
  }

  if (type === 'docs') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
        title="Google Docs / Sheets Integration"
      >
        <FileText className="w-3 h-3 text-indigo-600" />
        <span>{label || 'Google Docs'}</span>
      </div>
    );
  }

  return null;
};
