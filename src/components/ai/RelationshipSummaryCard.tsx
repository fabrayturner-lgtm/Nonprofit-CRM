import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface RelationshipSummaryCardProps {
  title?: string;
  summaryText: string;
  entityName: string;
  onRefresh?: () => void;
  className?: string;
}

export const RelationshipSummaryCard: React.FC<RelationshipSummaryCardProps> = ({
  title = 'AI Relationship & Intelligence Summary',
  summaryText,
  entityName,
  onRefresh,
  className = '',
}) => {
  return (
    <div
      className={`rounded-xl bg-gradient-to-br from-teal-50/70 via-white to-sky-50/50 border border-teal-200/80 p-5 shadow-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
              {title}
            </h4>
            <p className="text-[10px] text-teal-800 font-medium">
              Grounded in CRM communications, gifts & Google Workspace logs
            </p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 text-slate-400 hover:text-teal-700 hover:bg-white rounded transition-colors text-[11px] flex items-center gap-1 font-medium"
            title="Re-generate summary"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>

      <div className="text-xs text-slate-700 leading-relaxed font-normal pl-8 border-l-2 border-teal-400/60 my-2">
        {summaryText}
      </div>

      <div className="pl-8 pt-1 flex items-center gap-3 text-[10px] text-slate-400">
        <span>Entity: <strong className="text-slate-600 font-medium">{entityName}</strong></span>
        <span>·</span>
        <span>Last AI synthesis: Today</span>
      </div>
    </div>
  );
};
