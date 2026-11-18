import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Award,
  Check
} from 'lucide-react';
import { DailyMission } from '../types';

interface DailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: DailyMission[];
  onClaimReward: (missionId: string) => void;
  onSelectProblem?: (problemId: string) => void;
  onGoToBattle?: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  isOpen,
  onClose,
  missions,
  onClaimReward,
  onSelectProblem,
  onGoToBattle
}) => {
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07121E]/85">
      <div className="max-w-xl w-full bg-[#112D43] border border-[#294357] rounded-md shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#10283D] border-b border-[#294357] flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#F1F0EE]">
              Daily missions
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#B9C2CC] mt-1">
              <span>{completedCount}/{missions.length} completed</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-mono text-[#E8AE38] tabular-nums">
                <Clock className="w-3 h-3" />
                <span>Resets in {timeUntilReset}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#B9C2CC] hover:text-[#F1F0EE] rounded transition-colors"
            aria-label="Close daily missions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missions List */}
        <div className="p-5 overflow-y-auto divide-y divide-[#294357] flex-1 bg-[#07121E]/50">
          {missions.map((mission) => {
            const isCompleted = mission.completed;
            const isClaimed = mission.claimed;
            const canClaim = isCompleted && !isClaimed;

            return (
              <div key={mission.id} className="py-4 first:pt-1 last:pb-1 space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-[#27C5E8]">{mission.category}</span>
                      <span className="text-[#B9C2CC] text-xs">·</span>
                      <h3 className="text-sm font-medium text-[#F1F0EE]">{mission.title}</h3>
                    </div>
                    <p className="text-xs text-[#B9C2CC] leading-relaxed">
                      {mission.description}
                    </p>
                    <div className="flex items-center gap-3 pt-0.5 font-mono text-xs">
                      <span className="font-semibold text-[#E8AE38] tabular-nums">
                        +{mission.rewardLp} LP
                      </span>
                      {mission.rewardAchievement && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#B9C2CC] font-sans">
                          <Award className="w-3.5 h-3.5 text-[#27C5E8]" />
                          <span>Achievement: {mission.rewardAchievement}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {isClaimed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Claimed</span>
                      </span>
                    ) : canClaim ? (
                      <button
                        type="button"
                        onClick={() => onClaimReward(mission.id)}
                        className="px-3.5 py-1.5 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] font-medium text-xs transition-colors"
                      >
                        Claim reward
                      </button>
                    ) : (
                      <>
                        <span className="text-xs font-mono text-[#B9C2CC] tabular-nums">
                          {mission.currentCount}/{mission.targetCount}
                        </span>
                        {mission.targetProblemId && onSelectProblem ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectProblem(mission.targetProblemId!);
                              onClose();
                            }}
                            className="text-xs font-medium text-[#27C5E8] hover:text-[#39BDE0]"
                          >
                            Solve problem
                          </button>
                        ) : mission.targetType === 'win_battle' && onGoToBattle ? (
                          <button
                            type="button"
                            onClick={() => {
                              onGoToBattle();
                              onClose();
                            }}
                            className="text-xs font-medium text-[#27C5E8] hover:text-[#39BDE0]"
                          >
                            Go to battles
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#07121E] border border-[#294357] h-1.5 rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isClaimed
                        ? 'bg-emerald-500/70'
                        : isCompleted
                        ? 'bg-[#27C5E8]'
                        : 'bg-[#E8AE38]'
                    }`}
                    style={{
                      width: `${Math.min(100, (mission.currentCount / mission.targetCount) * 100)}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#294357] bg-[#10283D] flex items-center justify-between text-xs text-[#B9C2CC]">
          <span>Daily missions reset at midnight local time.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
