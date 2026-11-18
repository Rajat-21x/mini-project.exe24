import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Play, Share2, X, Clock } from 'lucide-react';
import { BattleHistoryItem, User } from '../types';
import { BattleReplayModal } from './BattleReplayModal';
import { ShareResultModal } from './ShareResultModal';

interface BattleHistoryViewProps {
  history: BattleHistoryItem[];
  currentUser: User;
}

type HistoryFilter = 'all' | 'victory' | 'defeat' | 'draw';

export const BattleHistoryView: React.FC<BattleHistoryViewProps> = ({
  history,
  currentUser
}) => {
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [selectedDetailBattle, setSelectedDetailBattle] = useState<BattleHistoryItem | null>(null);
  const [selectedReplayBattle, setSelectedReplayBattle] = useState<BattleHistoryItem | null>(null);
  const [selectedShareBattle, setSelectedShareBattle] = useState<BattleHistoryItem | null>(null);

  const totalBattles = currentUser.battlesWon + currentUser.battlesLost;
  const winRate = totalBattles > 0 ? Math.round((currentUser.battlesWon / totalBattles) * 100) : 0;

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.result === filter;
  });

  const formatResultLabel = (res: BattleHistoryItem['result']) => {
    if (res === 'victory') return 'Won';
    if (res === 'defeat') return 'Lost';
    return 'Draw';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#294357] pb-5">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F1F0EE]">
            Battle History
          </h1>
          <p className="text-sm text-[#B9C2CC]">
            Select any match row to view details, open step-by-step code replay, or save a match summary image.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#10283D] border border-[#294357] rounded-md">
          {([
            { id: 'all', label: 'All' },
            { id: 'victory', label: 'Won' },
            { id: 'defeat', label: 'Lost' },
            { id: 'draw', label: 'Draw' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                filter === tab.id
                  ? 'bg-[#27C5E8] text-[#07121E]'
                  : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Unified Stats Strip */}
      <div className="rounded-md bg-[#112D43] border border-[#294357] grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#294357]">
        <div className="px-4 py-3.5">
          <div className="text-xs text-[#B9C2CC]">Total matches</div>
          <div className="text-lg font-semibold text-[#F1F0EE] font-mono tabular-nums mt-0.5">
            {totalBattles}{' '}
            <span className="text-xs font-normal text-[#B9C2CC]">
              ({currentUser.battlesWon}W / {currentUser.battlesLost}L)
            </span>
          </div>
        </div>

        <div className="px-4 py-3.5">
          <div className="text-xs text-[#B9C2CC]">Win rate</div>
          <div className="text-lg font-semibold text-[#27C5E8] font-mono tabular-nums mt-0.5">
            {winRate}%
          </div>
        </div>

        <div className="px-4 py-3.5">
          <div className="text-xs text-[#B9C2CC]">Current streak</div>
          <div className="text-lg font-semibold text-[#E8AE38] font-mono tabular-nums mt-0.5">
            {currentUser.streak} wins
          </div>
        </div>

        <div className="px-4 py-3.5">
          <div className="text-xs text-[#B9C2CC]">Rating</div>
          <div className="text-lg font-semibold text-[#E8AE38] font-mono tabular-nums mt-0.5">
            {currentUser.rating} LP{' '}
            <span className="text-xs font-normal text-[#B9C2CC]">· {currentUser.rankTier}</span>
          </div>
        </div>
      </div>

      {/* Match History Table */}
      <div className="rounded-md border border-[#294357] bg-[#112D43] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10283D] border-b border-[#294357] text-xs font-medium text-[#B9C2CC]">
              <tr>
                <th className="py-3 px-4">Battle ID</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Opponent</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Duration</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-center">Result</th>
                <th className="py-3 px-4 text-right">Rating</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294357]">
              {filteredHistory.map((item) => {
                const isVictory = item.result === 'victory';
                const isDefeat = item.result === 'defeat';

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedDetailBattle(item)}
                    className="hover:bg-[#10283D]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono text-[#B9C2CC] whitespace-nowrap">
                      {item.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-[#F1F0EE]">{item.problemTitle}</div>
                      <div className="text-[11px] text-[#B9C2CC] font-mono">
                        {item.difficulty} · {item.languageUsed.toUpperCase()}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-[#F1F0EE]">{item.opponentName}</div>
                      <div className="text-[11px] text-[#B9C2CC] font-mono tabular-nums">
                        {item.opponentRating} LP
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[#B9C2CC] whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-center font-mono text-[#F1F0EE] tabular-nums whitespace-nowrap">
                      {Math.floor(item.userTimeSeconds / 60)}m {item.userTimeSeconds % 60}s
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                      <span className="text-[#E8AE38] font-semibold">{item.userScore}</span>
                      <span className="text-[#B9C2CC] mx-1">:</span>
                      <span className="text-[#B9C2CC]">{item.opponentScore}</span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-medium">
                      <span
                        className={
                          isVictory
                            ? 'text-emerald-400'
                            : isDefeat
                            ? 'text-rose-400'
                            : 'text-[#E8AE38]'
                        }
                      >
                        {formatResultLabel(item.result)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-medium tabular-nums whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          item.ratingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.ratingChange >= 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>{item.ratingChange >= 0 ? `+${item.ratingChange}` : item.ratingChange}</span>
                      </span>
                    </td>

                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReplayBattle(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] hover:text-[#27C5E8] font-medium text-xs transition-colors"
                          title="Watch battle replay"
                        >
                          <Play className="w-3 h-3" />
                          <span>Replay</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedShareBattle(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] hover:text-[#27C5E8] font-medium text-xs transition-colors"
                          title="Share result card"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-[#B9C2CC]">
                    No battles match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Detail Modal */}
      {selectedDetailBattle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07121E]/85">
          <div className="max-w-lg w-full bg-[#112D43] border border-[#294357] rounded-md p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#294357] pb-4">
              <div>
                <div className="text-xs font-mono text-[#B9C2CC]">
                  Match {selectedDetailBattle.id}
                </div>
                <h2 className="font-heading text-xl font-semibold text-[#F1F0EE] mt-0.5">
                  {selectedDetailBattle.problemTitle}
                </h2>
                <div className="text-xs text-[#B9C2CC] mt-1 font-mono">
                  {new Date(selectedDetailBattle.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailBattle(null)}
                className="p-1 text-[#B9C2CC] hover:text-[#F1F0EE]"
                aria-label="Close match details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-md bg-[#07121E] border border-[#294357] space-y-1">
                <div className="text-[#27C5E8] font-medium">You · {currentUser.displayName}</div>
                <div className="text-lg font-semibold font-mono text-[#E8AE38] tabular-nums">
                  {selectedDetailBattle.userScore} pts
                </div>
                <div className="text-[#B9C2CC] font-mono flex items-center gap-1 tabular-nums">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(selectedDetailBattle.userTimeSeconds / 60)}m {selectedDetailBattle.userTimeSeconds % 60}s</span>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-[#07121E] border border-[#294357] space-y-1">
                <div className="text-[#B9C2CC] font-medium truncate">
                  {selectedDetailBattle.opponentName}
                </div>
                <div className="text-lg font-semibold font-mono text-[#F1F0EE] tabular-nums">
                  {selectedDetailBattle.opponentScore} pts
                </div>
                <div className="text-[#B9C2CC] font-mono tabular-nums">
                  Rating: {selectedDetailBattle.opponentRating} LP
                </div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#10283D] border border-[#294357] flex items-center justify-between text-xs font-mono">
              <span className="text-[#B9C2CC]">
                Result: <strong className="text-[#F1F0EE]">{formatResultLabel(selectedDetailBattle.result)}</strong>
              </span>
              <span className={selectedDetailBattle.ratingChange >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {selectedDetailBattle.ratingChange >= 0
                  ? `+${selectedDetailBattle.ratingChange}`
                  : selectedDetailBattle.ratingChange}{' '}
                LP
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#294357]">
              <button
                type="button"
                onClick={() => {
                  const target = selectedDetailBattle;
                  setSelectedDetailBattle(null);
                  setSelectedShareBattle(target);
                }}
                className="px-4 py-2 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = selectedDetailBattle;
                  setSelectedDetailBattle(null);
                  setSelectedReplayBattle(target);
                }}
                className="px-4 py-2 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Watch replay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <BattleReplayModal
        battle={selectedReplayBattle}
        isOpen={!!selectedReplayBattle}
        onClose={() => setSelectedReplayBattle(null)}
      />

      <ShareResultModal
        battle={selectedShareBattle}
        currentUser={currentUser}
        isOpen={!!selectedShareBattle}
        onClose={() => setSelectedShareBattle(null)}
      />
    </div>
  );
};
