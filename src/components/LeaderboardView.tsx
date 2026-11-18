import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ entries, currentUserId }) => {
  const [filterPeriod, setFilterPeriod] = useState<'global' | 'weekly' | 'monthly'>('global');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const periodEntries = entries.map((e) => {
    if (filterPeriod === 'weekly') {
      return {
        ...e,
        rating: Math.max(800, Math.round(e.rating * 0.28 + e.streak * 18)),
        battlesWon: Math.max(1, Math.round(e.battlesWon * 0.2)),
        solvedCount: Math.max(1, Math.round(e.solvedCount * 0.25))
      };
    }
    if (filterPeriod === 'monthly') {
      return {
        ...e,
        rating: Math.max(800, Math.round(e.rating * 0.65 + e.battlesWon * 3)),
        battlesWon: Math.max(1, Math.round(e.battlesWon * 0.55)),
        solvedCount: Math.max(1, Math.round(e.solvedCount * 0.6))
      };
    }
    return e;
  });

  const sortedPeriodEntries = [...periodEntries]
    .sort((a, b) => b.rating - a.rating)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  const currentUserEntry = sortedPeriodEntries.find((e) => e.isCurrentUser || e.id === currentUserId);

  const filteredEntries = sortedPeriodEntries.filter((e) => {
    const matchesSearch =
      e.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'All' || e.rankTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const renderRankCell = (rank: number) => {
    if (rank === 1) {
      return <span className="font-mono font-semibold text-[#E8AE38] tabular-nums">1</span>;
    }
    if (rank === 2) {
      return <span className="font-mono font-semibold text-[#F1F0EE] tabular-nums">2</span>;
    }
    if (rank === 3) {
      return <span className="font-mono font-semibold text-[#39BDE0] tabular-nums">3</span>;
    }
    return <span className="font-mono text-[#B9C2CC] tabular-nums">{rank}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#294357] pb-5">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F1F0EE]">
            Leaderboard
          </h1>
          <p className="text-sm text-[#B9C2CC]">
            Rankings ordered by competitive Elo rating, solved problems, and battle win rate.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#10283D] border border-[#294357] rounded-md">
          {([
            { id: 'global', label: 'Global' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterPeriod(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                filterPeriod === tab.id
                  ? 'bg-[#27C5E8] text-[#07121E]'
                  : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Standing Summary */}
      {currentUserEntry && (
        <div className="rounded-md bg-[#112D43] border border-[#294357] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[#F1F0EE]">
            <span className="text-[#B9C2CC] text-xs mr-2">Your standing ({filterPeriod}):</span>
            <span className="font-medium">{currentUserEntry.displayName}</span>
            <span className="text-xs font-mono text-[#B9C2CC] ml-2">@{currentUserEntry.username}</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs tabular-nums">
            <div>
              <span className="text-[#B9C2CC] mr-1.5">Rank</span>
              <span className="font-semibold text-[#27C5E8]">#{currentUserEntry.rank}</span>
            </div>
            <div>
              <span className="text-[#B9C2CC] mr-1.5">Rating</span>
              <span className="font-semibold text-[#E8AE38]">{currentUserEntry.rating} LP</span>
            </div>
            <div>
              <span className="text-[#B9C2CC] mr-1.5">Win rate</span>
              <span className="font-semibold text-[#F1F0EE]">{currentUserEntry.winRate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Division Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#B9C2CC] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#10283D] border border-[#294357] rounded-md pl-9 pr-3 py-2 text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/60 focus:outline-none focus:border-[#27C5E8]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="tier-filter" className="text-xs text-[#B9C2CC] font-medium">
            Division:
          </label>
          <select
            id="tier-filter"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#10283D] border border-[#294357] text-[#F1F0EE] text-xs rounded-md px-3 py-2 focus:outline-none focus:border-[#27C5E8] cursor-pointer"
          >
            <option value="All">All divisions</option>
            <option value="Grandmaster">Grandmaster</option>
            <option value="Diamond">Diamond</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-md border border-[#294357] bg-[#112D43] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10283D] border-b border-[#294357] text-xs font-medium text-[#B9C2CC]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Competitor</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-right">Solved</th>
                <th className="py-3 px-4 text-right">Wins</th>
                <th className="py-3 px-4 text-right">Win rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294357]">
              {filteredEntries.map((player) => {
                const isYou = player.isCurrentUser || player.id === currentUserId;

                return (
                  <tr
                    key={player.id}
                    className={`transition-colors ${
                      isYou ? 'bg-[#10283D]' : 'hover:bg-[#10283D]/50'
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      {renderRankCell(player.rank)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded ${player.avatarBg} flex items-center justify-center text-[11px] font-mono font-semibold shrink-0`}>
                          {player.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-[#F1F0EE]">
                            {player.displayName}{' '}
                            {isYou && <span className="text-xs text-[#27C5E8] font-normal">(You)</span>}
                          </div>
                          <div className="text-[11px] text-[#B9C2CC] font-mono">
                            @{player.username} · {player.rankTier}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#E8AE38] tabular-nums">
                      {player.rating} LP
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[#F1F0EE] tabular-nums">
                      {player.solvedCount}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[#F1F0EE] tabular-nums">
                      {player.battlesWon}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[#27C5E8] tabular-nums">
                      {player.winRate}%
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-[#B9C2CC]">
                    No competitors match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
