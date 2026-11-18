import React from 'react';
import { ArrowRight, CheckCircle2, Swords, Code2 } from 'lucide-react';
import { BattleHistoryItem, DailyMission, LeaderboardEntry, NavTab, Problem, User } from '../types';
import { PROBLEMS } from '../data/problems';
import { DailyMissionsBanner } from './DailyMissionsBanner';

interface DashboardViewProps {
  currentUser: User;
  battleHistory: BattleHistoryItem[];
  leaderboard: LeaderboardEntry[];
  attemptedProblemIds: string[];
  missions: DailyMission[];
  onNavigate: (tab: NavTab) => void;
  onOpenProblem: (problemId: string) => void;
  onOpenDailyMissions: () => void;
  onClaimMissionReward: (missionId: string) => void;
  onOpenPresentation: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  battleHistory,
  leaderboard,
  attemptedProblemIds,
  missions,
  onNavigate,
  onOpenProblem,
  onOpenDailyMissions,
  onClaimMissionReward,
  onOpenPresentation
}) => {
  const totalBattles = currentUser.battlesWon + currentUser.battlesLost;
  const winRate = totalBattles > 0 ? Math.round((currentUser.battlesWon / totalBattles) * 100) : 0;
  const userRankEntry = leaderboard.find((e) => e.isCurrentUser || e.id === currentUser.id);
  const globalRank = userRankEntry ? userRankEntry.rank : leaderboard.length + 1;

  // Build recently attempted + unsolved problem queue
  const queueProblems: Problem[] = [];
  attemptedProblemIds.forEach((id) => {
    const found = PROBLEMS.find((p) => p.id === id);
    if (found && !queueProblems.some((qp) => qp.id === found.id)) {
      queueProblems.push(found);
    }
  });
  PROBLEMS.forEach((p) => {
    if (queueProblems.length < 5 && !currentUser.problemsSolved.includes(p.id) && !queueProblems.some((qp) => qp.id === p.id)) {
      queueProblems.push(p);
    }
  });

  const recentBattles = battleHistory.slice(0, 4);
  const topFiveUsers = leaderboard.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 w-full">
      {/* Compact Workspace Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#294357] pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F1F0EE] tracking-tight">
            Welcome back, {currentUser.displayName}
          </h1>
          <p className="text-sm text-[#B9C2CC] leading-relaxed">
            Practice problems, track your progress and participate in coding battles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('problems')}
            className="px-4 py-2 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Start practicing</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('battles')}
            className="px-4 py-2 rounded-md border border-[#294357] bg-[#10283D] hover:border-[#27C5E8] text-[#F1F0EE] hover:text-[#27C5E8] text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Swords className="w-3.5 h-3.5 text-[#27C5E8]" />
            <span>New battle</span>
          </button>
          <button
            type="button"
            onClick={onOpenPresentation}
            className="px-3 py-2 text-xs text-[#B9C2CC] hover:text-[#27C5E8] transition-colors"
          >
            Project brief
          </button>
        </div>
      </section>

      {/* Compact Single-Strip Performance Overview */}
      <section aria-label="Competitor statistics">
        <div className="rounded-md bg-[#112D43] border border-[#294357] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#294357]">
          <div className="px-4 py-3.5">
            <div className="text-xs text-[#B9C2CC]">Problems solved</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-[#F1F0EE] mt-0.5">
              {currentUser.problemsSolved.length}
              <span className="text-xs font-normal text-[#B9C2CC]"> / {PROBLEMS.length}</span>
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="text-xs text-[#B9C2CC]">Current rating</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-[#E8AE38] mt-0.5">
              {currentUser.rating} <span className="text-xs font-normal text-[#B9C2CC]">LP</span>
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="text-xs text-[#B9C2CC]">Global rank</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-[#27C5E8] mt-0.5">
              #{globalRank}
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="text-xs text-[#B9C2CC]">Battles played</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-[#F1F0EE] mt-0.5">
              {totalBattles}
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="text-xs text-[#B9C2CC]">Battles won</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-[#F1F0EE] mt-0.5">
              {currentUser.battlesWon}
            </div>
          </div>

          <div className="px-4 py-3.5">
            <div className="text-xs text-[#B9C2CC]">Win rate</div>
            <div className="text-lg font-semibold font-mono tabular-nums text-[#27C5E8] mt-0.5">
              {winRate}%
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Practice Queue & Daily Missions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recommended / Recent Problems */}
          <div className="rounded-md bg-[#112D43] border border-[#294357] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#10283D] border-b border-[#294357] flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
                Recommended problems
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('problems')}
                className="text-xs font-medium text-[#27C5E8] hover:text-[#39BDE0] flex items-center gap-1"
              >
                <span>All problems</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#294357]">
              {queueProblems.slice(0, 5).map((prob) => {
                const isSolved = currentUser.problemsSolved.includes(prob.id);
                return (
                  <div
                    key={prob.id}
                    className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-[#10283D]/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#F1F0EE]">
                        <span className="font-mono text-xs text-[#B9C2CC]">{prob.problemCode}</span>
                        <span className="truncate">{prob.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#B9C2CC] mt-0.5">
                        <span>{prob.category}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            prob.difficulty === 'Easy'
                              ? 'text-emerald-400'
                              : prob.difficulty === 'Medium'
                              ? 'text-[#E8AE38]'
                              : 'text-rose-400'
                          }
                        >
                          {prob.difficulty}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{prob.maxScore} pts</span>
                        {isSolved && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-400 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Solved
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenProblem(prob.id)}
                      className="px-3 py-1.5 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors whitespace-nowrap shrink-0"
                    >
                      {isSolved ? 'Review' : 'Solve'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Challenges */}
          {missions.length > 0 && (
            <DailyMissionsBanner
              missions={missions}
              onOpenModal={onOpenDailyMissions}
              onClaimReward={onClaimMissionReward}
              onSelectProblem={onOpenProblem}
            />
          )}
        </div>

        {/* Right 5 cols: Recent Battles & Top 5 Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Battles */}
          <div className="rounded-md bg-[#112D43] border border-[#294357] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#10283D] border-b border-[#294357] flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
                Recent battles
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('history')}
                className="text-xs font-medium text-[#27C5E8] hover:text-[#39BDE0] flex items-center gap-1"
              >
                <span>Match history</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentBattles.length > 0 ? (
              <div className="divide-y divide-[#294357]">
                {recentBattles.map((item) => (
                  <div
                    key={item.id}
                    className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-[#10283D]/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#F1F0EE] truncate">
                        {item.problemTitle}
                        <span className="text-[#B9C2CC] font-normal"> vs {item.opponentName}</span>
                      </div>
                      <div className="text-xs text-[#B9C2CC] font-mono tabular-nums mt-0.5 flex items-center gap-2">
                        <span>{item.userScore} : {item.opponentScore}</span>
                        <span aria-hidden="true">·</span>
                        <span>{Math.floor(item.userTimeSeconds / 60)}m {item.userTimeSeconds % 60}s</span>
                        <span aria-hidden="true">·</span>
                        <span className={item.ratingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {item.ratingChange >= 0 ? `+${item.ratingChange}` : item.ratingChange} LP
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-mono font-medium shrink-0 ${
                        item.result === 'victory'
                          ? 'text-emerald-400'
                          : item.result === 'defeat'
                          ? 'text-rose-400'
                          : 'text-[#E8AE38]'
                      }`}
                    >
                      {item.result === 'victory' ? 'Won' : item.result === 'defeat' ? 'Lost' : 'Draw'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-6 text-center text-xs text-[#B9C2CC]">
                No recent battles recorded yet.
              </div>
            )}
          </div>

          {/* Top 5 Leaderboard */}
          <div className="rounded-md bg-[#112D43] border border-[#294357] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#10283D] border-b border-[#294357] flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
                Top competitors
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('leaderboard')}
                className="text-xs font-medium text-[#27C5E8] hover:text-[#39BDE0] flex items-center gap-1"
              >
                <span>Leaderboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#294357]">
              {topFiveUsers.map((entry) => {
                const isYou = entry.isCurrentUser || entry.id === currentUser.id;
                return (
                  <div
                    key={entry.id}
                    className={`px-5 py-2.5 flex items-center justify-between gap-3 ${
                      isYou ? 'bg-[#10283D]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-6 font-mono text-xs font-semibold tabular-nums ${
                          entry.rank === 1
                            ? 'text-[#E8AE38]'
                            : entry.rank === 2
                            ? 'text-[#F1F0EE]'
                            : entry.rank === 3
                            ? 'text-[#39BDE0]'
                            : 'text-[#B9C2CC]'
                        }`}
                      >
                        #{entry.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#F1F0EE] truncate">
                          {entry.displayName}{' '}
                          {isYou && <span className="text-xs text-[#27C5E8] font-normal">(You)</span>}
                        </div>
                        <div className="text-xs text-[#B9C2CC] font-mono tabular-nums">
                          {entry.battlesWon} wins · {entry.winRate}% win rate
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs font-semibold text-[#E8AE38] tabular-nums shrink-0">
                      {entry.rating} LP
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 bg-[#10283D]/60 border-t border-[#294357] flex items-center justify-between text-xs text-[#B9C2CC]">
              <span>Your rank: <strong className="text-[#F1F0EE] font-mono">#{globalRank}</strong></span>
              <span className="font-mono text-[#E8AE38]">{currentUser.rankTier}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
