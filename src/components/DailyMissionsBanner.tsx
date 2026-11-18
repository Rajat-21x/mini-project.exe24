import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { DailyMission } from '../types';

interface DailyMissionsBannerProps {
  missions: DailyMission[];
  onOpenModal: () => void;
  onClaimReward: (missionId: string) => void;
  onSelectProblem?: (problemId: string) => void;
}

export const DailyMissionsBanner: React.FC<DailyMissionsBannerProps> = ({
  missions,
  onOpenModal,
  onClaimReward,
  onSelectProblem
}) => {
  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="rounded-md bg-[#112D43] border border-[#294357] overflow-hidden">
      <div className="px-5 py-3.5 bg-[#10283D] border-b border-[#294357] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
            Daily missions
          </h2>
          <span className="text-xs font-mono text-[#B9C2CC] tabular-nums">
            ({completedCount}/{missions.length} completed)
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenModal}
          className="text-xs font-medium text-[#27C5E8] hover:text-[#39BDE0] flex items-center gap-1 shrink-0"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-[#294357]">
        {missions.map((m) => {
          const isCompleted = m.completed;
          const isClaimed = m.claimed;
          const canClaim = isCompleted && !isClaimed;

          return (
            <div
              key={m.id}
              className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-[#10283D]/50 transition-colors"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#F1F0EE]">{m.title}</span>
                  <span className="text-xs font-mono text-[#E8AE38] tabular-nums">
                    +{m.rewardLp} LP
                  </span>
                </div>
                <div className="text-xs text-[#B9C2CC] truncate">
                  {m.description}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-[#B9C2CC] tabular-nums">
                  {m.currentCount}/{m.targetCount}
                </span>

                {isClaimed ? (
                  <span className="text-xs font-medium text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Claimed</span>
                  </span>
                ) : canClaim ? (
                  <button
                    type="button"
                    onClick={() => onClaimReward(m.id)}
                    className="px-3 py-1 rounded bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors"
                  >
                    Claim
                  </button>
                ) : m.targetProblemId && onSelectProblem ? (
                  <button
                    type="button"
                    onClick={() => onSelectProblem(m.targetProblemId!)}
                    className="px-3 py-1 rounded border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors"
                  >
                    Solve
                  </button>
                ) : (
                  <span className="text-xs text-[#B9C2CC]">In progress</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
