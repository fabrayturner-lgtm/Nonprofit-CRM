import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  DollarSign,
  Search,
  Filter,
  Plus,
  Heart,
  Building2,
  Calendar,
  FileSpreadsheet,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Gift, GiftType, GiftStatus } from '../../types';
import { Badge } from '../common/Badge';
import { GiftDetailModal } from './GiftDetailModal';
import { ThankDonorModal } from './ThankDonorModal';

export const GiftsView: React.FC = () => {
  const {
    gifts,
    kpiStats,
    selectedGiftId,
    setSelectedGiftId,
    thankModalGift,
    setThankModalGift,
    openQuickAdd,
    openAIWithPrompt,
    navigateToContact,
    navigateToOrg,
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [thankedFilter, setThankedFilter] = useState<string>('all');
  const [activeGiftModal, setActiveGiftModal] = useState<Gift | null>(null);

  // Sync selectedGiftId if navigating into a specific gift
  React.useEffect(() => {
    if (selectedGiftId) {
      const target = gifts.find((g) => g.id === selectedGiftId);
      if (target) {
        setActiveGiftModal(target);
      }
    }
  }, [selectedGiftId, gifts]);

  const handleCloseDetailModal = () => {
    setActiveGiftModal(null);
    setSelectedGiftId(null);
  };

  // Filtered gifts with comprehensive null-safety
  const filteredGifts = useMemo(() => {
    return gifts.filter((g) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (g.donorName || '').toLowerCase().includes(query) ||
        (g.organizationName && g.organizationName.toLowerCase().includes(query)) ||
        (g.campaign || '').toLowerCase().includes(query) ||
        (g.fund || '').toLowerCase().includes(query);

      const matchesType =
        typeFilter === 'all' ||
        g.type === typeFilter ||
        (typeFilter === 'Individual' &&
          (g.type === 'Individual' || g.type === 'Individual Gift' || g.type === 'Major Gift')) ||
        (typeFilter === 'Organizational' &&
          (g.type === 'Organizational' || g.type === 'Corporate Match')) ||
        (typeFilter === 'Recurring' &&
          (g.type === 'Recurring' || g.type === 'Recurring Gift'));

      const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
      const matchesCampaign = campaignFilter === 'all' || g.campaign === campaignFilter;
      const matchesThanked =
        thankedFilter === 'all' ||
        (thankedFilter === 'thanked' && g.thanked) ||
        (thankedFilter === 'unthanked' && !g.thanked);

      return matchesSearch && matchesType && matchesStatus && matchesCampaign && matchesThanked;
    });
  }, [gifts, searchQuery, typeFilter, statusFilter, campaignFilter, thankedFilter]);

  const uniqueCampaigns = Array.from(new Set(gifts.map((g) => g.campaign).filter(Boolean)));

  const getGiftTypeBadgeVariant = (type: GiftType) => {
    switch (type) {
      case 'Individual':
      case 'Individual Gift':
        return 'indigo';
      case 'Major Gift':
        return 'success';
      case 'Grant':
        return 'purple';
      case 'Organizational':
      case 'Corporate Match':
        return 'teal';
      case 'Recurring':
      case 'Recurring Gift':
        return 'info';
      case 'Pledge':
        return 'warning';
      case 'In-Kind':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Gifts, Pledges & Fundraising Ledger
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filteredGifts.length} gifts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Nonprofit gift stewardship, foundation grants, in-kind receipts, and pledge management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAIWithPrompt('Which donors need a thank-you letter or follow-up?')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100/80 text-[#1e3a8a] border border-blue-200 text-xs font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Stewardship Audit</span>
          </button>
          <button
            onClick={() => openQuickAdd('gift')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-medium text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-lime-300" />
            <span>Record Gift</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards (6 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Gifts YTD
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            ${(kpiStats?.totalGiftsYTD ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Received & Cleared</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            This Month (Aug)
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            ${(kpiStats?.giftsThisMonth ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">+12% vs July</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Pledged Total
          </span>
          <div className="text-xl font-bold text-indigo-700 mt-1">
            ${(kpiStats?.pledgedAmount ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">Committed for 2026</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Outstanding Pledges
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {(kpiStats?.outstandingPledges ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Due Q4 2026</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Average Gift
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            ${(kpiStats?.averageGiftSize ?? kpiStats?.averageGift ?? 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Across all funds</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Contributions
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {kpiStats?.totalGiftCount ?? 0}
          </div>
          <span className="text-[10px] text-indigo-600 font-medium">100% Tax Receipted</span>
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
            placeholder="Search gifts by donor, organization, campaign, or fund..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Gift Types</option>
            <option value="Individual">Individual</option>
            <option value="Grant">Grant</option>
            <option value="Organizational">Organizational</option>
            <option value="Recurring">Recurring</option>
            <option value="Pledge">Pledge</option>
            <option value="In-Kind">In-Kind</option>
          </select>

          {/* Campaign */}
          <select
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Campaigns</option>
            {uniqueCampaigns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="Received">Received</option>
            <option value="Pledged">Pledged</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Thanked filter */}
          <select
            value={thankedFilter}
            onChange={(e) => setThankedFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Acknowledged</option>
            <option value="thanked">Thanked</option>
            <option value="unthanked">Needs Thank-You</option>
          </select>
        </div>
      </div>

      {/* Gifts Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 select-none">
              <tr>
                <th className="py-3 px-4">Donor / Funder</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Campaign & Designated Fund</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Thank-you Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGifts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No gifts found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredGifts.map((gift) => (
                  <tr
                    key={gift.id}
                    onClick={() => setActiveGiftModal(gift)}
                    className="hover:bg-teal-50/20 cursor-pointer transition-colors group"
                  >
                    {/* Donor / Organization */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-teal-700">
                        {gift.donorName}
                      </div>
                      {gift.organizationName && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{gift.organizationName}</span>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {gift.giftDate}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                      ${gift.amount.toLocaleString()}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4">
                      <Badge variant={getGiftTypeBadgeVariant(gift.type)} size="sm">
                        {gift.type}
                      </Badge>
                    </td>

                    {/* Campaign & Fund */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{gift.campaign}</p>
                      <p className="text-[11px] text-slate-500">{gift.fund}</p>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4 text-slate-600">
                      {gift.paymentMethod}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <Badge variant={gift.status === 'Received' ? 'success' : 'warning'} size="sm">
                        {gift.status}
                      </Badge>
                    </td>

                    {/* Thank-you Action Button */}
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!gift.thanked ? (
                        <button
                          onClick={() => setThankModalGift(gift)}
                          className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[11px] border border-indigo-200 transition-colors shadow-2xs"
                        >
                          Thank Donor
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Thanked
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredGifts.length} gifts</span>
          <span className="flex items-center gap-1.5 text-indigo-700 font-medium">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Auto-synced with Google Sheets Ledger</span>
          </span>
        </div>
      </div>

      {/* Gift Detail Modal */}
      <GiftDetailModal
        gift={activeGiftModal}
        isOpen={!!activeGiftModal}
        onClose={handleCloseDetailModal}
      />

      {/* Thank Donor Modal */}
      <ThankDonorModal
        gift={thankModalGift}
        isOpen={!!thankModalGift}
        onClose={() => setThankModalGift(null)}
      />
    </div>
  );
};
