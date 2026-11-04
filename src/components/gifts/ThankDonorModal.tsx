import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Mail,
  Printer,
  Sparkles,
  CheckCircle2,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { Gift } from '../../types';
import { Modal } from '../common/Modal';
import { useCRM } from '../../context/CRMContext';

interface ThankDonorModalProps {
  gift: Gift | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ThankDonorModal: React.FC<ThankDonorModalProps> = ({
  gift,
  isOpen,
  onClose,
}) => {
  const { thankDonor, currentUser } = useCRM();

  const [channel, setChannel] = useState<'email' | 'letter'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (gift) {
      const formattedAmt = (gift.amount || 0).toLocaleString();
      setSubject(`Deepest Gratitude for your $${formattedAmt} gift to MAPLE Inc.`);
      setMessage(
`Dear ${gift.donorName},

On behalf of everyone at MAPLE Inc. and the older adults and families we serve, thank you so very much for your generous gift of $${formattedAmt} received on ${gift.giftDate} in support of our ${gift.fund}.

Your commitment directly empowers our mission—Making Aging People Lives Easier—providing vital home accessibility modifications, isolation-prevention companions, nutrition assistance, and caregiver respite for seniors in our community. We are deeply grateful for your continuous partnership and belief in dignified aging.

A formal tax acknowledgment receipt has been filed in accordance with 501(c)(3) regulations (Tax ID: 94-2819281). No goods or services were provided in exchange for this contribution.

With warm regards and heartfelt appreciation,

${currentUser.name}
${currentUser.role}
MAPLE Inc. — Making Aging People Lives Easier`
      );
      setIsSent(false);
    }
  }, [gift, currentUser]);

  if (!gift) return null;

  const handleSend = () => {
    // Trigger celebratory confetti in MAPLE brand colors: navy, lime green, warm gold
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#1e3a8a', '#65a30d', '#d97706', '#84cc16'],
    });

    thankDonor(gift.id);
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thank Donor & Issue Acknowledgment"
      subtitle={`Gift of $${(gift.amount || 0).toLocaleString()} from ${gift.donorName} (${gift.fund}) · MAPLE Inc.`}
      maxWidth="2xl"
      actions={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSent}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-semibold text-xs shadow-xs transition-colors disabled:bg-emerald-600"
            >
              {isSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-lime-300" />
                  <span>Sent & Logged!</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-lime-300" />
                  <span>Send via Gmail & Mark Thanked</span>
                </>
              )}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Channel Switcher */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Acknowledgment Format:</span>
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setChannel('email')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  channel === 'email' ? 'bg-[#1e3a8a] text-white font-semibold shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gmail Draft</span>
              </button>
              <button
                onClick={() => setChannel('letter')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                  channel === 'letter' ? 'bg-[#1e3a8a] text-white font-semibold shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Printable Letter</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#1e3a8a] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Personalized Draft</span>
          </div>
        </div>

        {/* Email Subject Line */}
        {channel === 'email' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
            />
          </div>
        )}

        {/* Message Body Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Thank-you Message Content
          </label>
          <textarea
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-800 leading-relaxed resize-none"
          />
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <span>Stewardship rule: Tax acknowledgment recorded automatically in Google Drive.</span>
          <span className="font-semibold font-mono text-[11px]">501(c)(3) Compliant</span>
        </div>
      </div>
    </Modal>
  );
};
