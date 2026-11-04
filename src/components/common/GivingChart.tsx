import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Gift } from '../../types';

interface GivingChartProps {
  gifts: Gift[];
}

export const GivingChart: React.FC<GivingChartProps> = ({ gifts }) => {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('year');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Month data (August 2026 breakdown by week)
  const monthData = [
    { label: 'Aug 1-7', gifts: 35100, grants: 0, individual: 100, corporate: 35000 },
    { label: 'Aug 8-14', gifts: 37000, grants: 0, individual: 25000, corporate: 12000 },
    { label: 'Aug 15-21', gifts: 65000, grants: 50000, individual: 15000, corporate: 0 },
    { label: 'Aug 22-31', gifts: 35050, grants: 0, individual: 35050, corporate: 0 },
  ];

  // Quarter data (Q1, Q2, Q3 2026)
  const quarterData = [
    { label: 'Q1 (Jan-Mar)', gifts: 64200, grants: 30000, individual: 22200, corporate: 12000 },
    { label: 'Q2 (Apr-Jun)', gifts: 121500, grants: 65000, individual: 36500, corporate: 20000 },
    { label: 'Q3 (Jul-Sep)', gifts: 215150, grants: 125000, individual: 55150, corporate: 35000 },
    { label: 'Q4 (Oct-Dec Projected)', gifts: 145000, grants: 75000, individual: 50000, corporate: 20000 },
  ];

  // Year data (2023, 2024, 2025, 2026 YTD)
  const yearData = [
    { label: 'Jan', gifts: 22000, grants: 15000, individual: 7000 },
    { label: 'Feb', gifts: 18500, grants: 10000, individual: 8500 },
    { label: 'Mar', gifts: 23700, grants: 5000, individual: 18700 },
    { label: 'Apr', gifts: 25200, grants: 0, individual: 25200 },
    { label: 'May', gifts: 48500, grants: 30000, individual: 18500 },
    { label: 'Jun', gifts: 47800, grants: 30000, individual: 17800 },
    { label: 'Jul', gifts: 92100, grants: 75000, individual: 17100 },
    { label: 'Aug', gifts: 172150, grants: 50000, individual: 122150 },
    { label: 'Sep (Proj)', gifts: 45000, grants: 30000, individual: 15000 },
    { label: 'Oct (Proj)', gifts: 85000, grants: 50000, individual: 35000 },
    { label: 'Nov (Proj)', gifts: 95000, grants: 25000, individual: 70000 },
    { label: 'Dec (Proj)', gifts: 140000, grants: 40000, individual: 100000 },
  ];

  const currentData = timeframe === 'month' ? monthData : timeframe === 'quarter' ? quarterData : yearData;

  const totalDisplayed = currentData.reduce((sum, d) => sum + d.gifts, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">Giving Trend & Impact Inflow</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              +18.4% vs 2025
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Total in period: <span className="font-semibold text-slate-800">${totalDisplayed.toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === 'month' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('quarter')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === 'quarter' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              This Quarter
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded-md transition-all ${
                timeframe === 'year' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
              }`}
            >
              This Year
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGifts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorGrants" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#65a30d" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#65a30d" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1 border border-slate-700">
                      <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
                      <div className="flex justify-between gap-4">
                        <span className="text-lime-300 font-medium">Total Giving:</span>
                        <span className="font-bold">${Number(payload[0]?.value || 0).toLocaleString()}</span>
                      </div>
                      {payload[1] && (
                        <div className="flex justify-between gap-4">
                          <span className="text-amber-300 font-medium">Grants:</span>
                          <span>${Number(payload[1]?.value || 0).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="gifts"
              stroke="#1e3a8a"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorGifts)"
              name="Total Gifts"
            />
            <Area
              type="monotone"
              dataKey="grants"
              stroke="#65a30d"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorGrants)"
              name="Institutional Grants"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & quick note */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#1e3a8a] inline-block" />
            <span className="font-medium text-slate-700">Total Giving (All Types)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#65a30d] border-t border-dashed border-[#65a30d] inline-block" />
            <span className="text-slate-600">Grants Portion</span>
          </div>
        </div>
        <span className="text-slate-400 hidden sm:inline">Syncing with Google Sheets ledger</span>
      </div>
    </div>
  );
};
