import React from 'react';
import {
  Heart,
  Calendar,
  DollarSign,
  User,
  Building2,
  FileCheck,
  Mail,
  Receipt,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Gift } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useCRM } from '../../context/CRMContext';

interface GiftDetailModalProps {
  gift: Gift | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GiftDetailModal: React.FC<GiftDetailModalProps> = ({
  gift,
  isOpen,
  onClose,
}) => {
  const { navigateToContact, navigateToOrg, setThankModalGift } = useCRM();

  if (!gift) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gift & Contribution Details"
      subtitle={`Transaction ID: ${gift.id} · MAPLE Inc. Official Contribution Record`}
      maxWidth="2xl"
      actions={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Receipt className="w-4 h-4 text-slate-400" />
            <span>Tax Receipt: <strong className="text-slate-800 font-semibold">{gift.taxReceiptStatus || (gift.receiptSent ? 'Sent' : 'Issued & Pending Delivery')}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            {!gift.thanked ? (
              <button
                onClick={() => {
                  onClose();
                  setThankModalGift(gift);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Thank Donor</span>
              </button>
            ) : (
              <span className="px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                ✓ Donor Thanked
              </span>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Amount Hero Box */}
        <div className="bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-slate-900 text-white p-5 rounded-xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-lime-300 tracking-wider">
              Contribution Amount · MAPLE Inc.
            </span>
            <div className="text-3xl font-black text-white mt-0.5">
              ${(gift.amount || 0).toLocaleString()}
            </div>
            <p className="text-xs text-blue-100/80 mt-1">
              Received on {gift.giftDate} · {gift.paymentMethod}
            </p>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="indigo" size="md">{gift.type}</Badge>
            <div>
              <Badge variant={gift.status === 'Received' ? 'success' : 'warning'} size="sm">
                {gift.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Donor & Organization Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Donor Information
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#1e3a8a] shrink-0" />
              <button
                onClick={() => {
                  onClose();
                  navigateToContact(gift.donorId);
                }}
                className="text-xs font-bold text-[#1e3a8a] hover:underline text-left"
              >
                {gift.donorName}
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Institutional Entity
            </span>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              {gift.organizationId ? (
                <button
                  onClick={() => {
                    onClose();
                    navigateToOrg(gift.organizationId!);
                  }}
                  className="text-xs font-bold text-blue-800 hover:underline text-left"
                >
                  {gift.organizationName}
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic">Individual Contribution</span>
              )}
            </div>
          </div>
        </div>

        {/* Campaign & Fund Allocation */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Fundraising Attribution
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Campaign:</span>
              <strong className="text-slate-900 font-semibold">{gift.campaign}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Designated Fund:</span>
              <strong className="text-slate-900 font-semibold">{gift.fund}</strong>
            </div>
          </div>
        </div>

        {/* Notes */}
        {gift.notes && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Gift Notes & Recognition Restrictions
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">{gift.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
