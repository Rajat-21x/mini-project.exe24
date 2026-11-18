import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Code2
} from 'lucide-react';
import { BattleHistoryItem } from '../types';
import { getReplayStepsForBattle } from '../services/storage';

interface BattleReplayModalProps {
  battle: BattleHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BattleReplayModal: React.FC<BattleReplayModalProps> = ({
  battle,
  isOpen,
  onClose
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const playbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = battle ? getReplayStepsForBattle(battle) : [];
  const currentStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [battle?.id, isOpen]);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const stepDuration = 2500 / playbackSpeed;
      playbackTimerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, stepDuration);
    }

    return () => {
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, playbackSpeed, steps.length]);

  if (!isOpen || !battle || !currentStep) return null;

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalTimeSeconds = battle.userTimeSeconds || 140;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#07121E]/85">
      <div className="max-w-4xl w-full bg-[#112D43] border border-[#294357] rounded-md shadow-xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#10283D] border-b border-[#294357] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-heading text-lg font-semibold text-[#F1F0EE] truncate">
                Battle Replay · {battle.problemTitle}
              </h2>
              <span
                className={`text-xs font-mono font-medium ${
                  battle.result === 'victory'
                    ? 'text-emerald-400'
                    : battle.result === 'defeat'
                    ? 'text-rose-400'
                    : 'text-[#E8AE38]'
                }`}
              >
                {battle.result === 'victory' ? 'Won' : battle.result === 'defeat' ? 'Lost' : 'Draw'} (
                {battle.ratingChange >= 0 ? `+${battle.ratingChange}` : battle.ratingChange} LP)
              </span>
            </div>
            <div className="text-xs text-[#B9C2CC] flex items-center gap-2 mt-0.5">
              <span>vs {battle.opponentName}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">
                {formatSeconds(battle.userTimeSeconds)} elapsed
              </span>
              <span>·</span>
              <span className="uppercase font-mono text-[#27C5E8]">
                {battle.languageUsed}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#B9C2CC] hover:text-[#F1F0EE] rounded transition-colors shrink-0"
            aria-label="Close battle replay"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Playback Controls */}
        <div className="px-6 py-3 bg-[#07121E] border-b border-[#294357] space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#B9C2CC] tabular-nums w-12 text-right">
              {formatSeconds(currentStep.timestampSeconds)}
            </span>

            <div className="relative flex-1 h-1.5 bg-[#10283D] border border-[#294357] rounded-sm overflow-hidden">
              <div
                className="h-full bg-[#27C5E8] transition-all duration-300"
                style={{
                  width: `${(currentStepIndex / Math.max(1, steps.length - 1)) * 100}%`
                }}
              />
            </div>

            <span className="text-xs font-mono text-[#B9C2CC] tabular-nums w-12">
              {formatSeconds(totalTimeSeconds)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {steps.map((st, idx) => {
                const isCurrent = currentStepIndex === idx;
                const isOpponent = st.author === 'opponent';

                return (
                  <button
                    key={st.stepNumber}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(idx);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 border ${
                      isCurrent
                        ? 'bg-[#E8AE38] text-[#07121E] border-[#E8AE38]'
                        : isOpponent
                        ? 'bg-[#10283D] text-[#E8AE38] border-[#E8AE38]/40 hover:border-[#E8AE38]'
                        : 'bg-[#10283D] border-[#294357] text-[#B9C2CC] hover:text-[#F1F0EE] hover:border-[#27C5E8]'
                    }`}
                  >
                    <span className="font-mono">#{st.stepNumber}</span>
                    <span className="hidden sm:inline">
                      {st.type === 'run_tests'
                        ? 'Tests'
                        : st.type === 'submission'
                        ? 'Submit'
                        : st.author === 'opponent'
                        ? 'Opponent'
                        : 'Edit'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <div className="flex items-center gap-0.5 p-0.5 bg-[#10283D] border border-[#294357] rounded text-[10px] font-mono">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-[#27C5E8] text-[#07121E]'
                        : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded text-[#B9C2CC] hover:text-[#F1F0EE] hover:bg-[#10283D] transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleStepBack}
                disabled={currentStepIndex === 0}
                className="p-1.5 rounded text-[#B9C2CC] hover:text-[#F1F0EE] hover:bg-[#10283D] transition-colors disabled:opacity-40"
                title="Previous step"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-[#07121E]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-[#07121E]" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleStepForward}
                disabled={currentStepIndex === steps.length - 1}
                className="p-1.5 rounded text-[#B9C2CC] hover:text-[#F1F0EE] hover:bg-[#10283D] transition-colors disabled:opacity-40"
                title="Next step"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Step Info Strip */}
        <div className="px-6 py-2.5 bg-[#10283D] border-b border-[#294357] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`font-mono font-medium ${
                currentStep.author === 'opponent' ? 'text-[#E8AE38]' : 'text-[#27C5E8]'
              }`}
            >
              Step {currentStep.stepNumber} of {steps.length}
            </span>
            <span className="text-[#294357]">·</span>
            <span className="font-medium text-sm text-[#F1F0EE]">
              {currentStep.title}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {currentStep.type === 'run_tests' || currentStep.type === 'submission' || currentStep.type === 'fix_bug' ? (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  currentStep.status === 'passed' || currentStep.status === 'accepted'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {currentStep.status === 'passed' || currentStep.status === 'accepted' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>
                  {currentStep.testsPassed}/{currentStep.totalTests} tests
                </span>
                {currentStep.runtimeMs && <span>· {currentStep.runtimeMs}ms</span>}
              </span>
            ) : (
              <span className="text-[#B9C2CC] font-sans text-xs">Drafting code</span>
            )}
          </div>
        </div>

        {/* Code Snapshot */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#07121E]/75">
          <div className="p-3 bg-[#10283D] border border-[#294357] rounded-md text-xs text-[#F1F0EE] flex items-start gap-2.5">
            <Terminal className="w-4 h-4 text-[#27C5E8] shrink-0 mt-0.5" />
            <div className="flex-1 font-mono text-[11px] leading-relaxed">
              <span className="text-[#E8AE38]">[{formatSeconds(currentStep.timestampSeconds)}]</span>{' '}
              {currentStep.log}
            </div>
          </div>

          <div className="rounded-md border border-[#294357] bg-[#07121E] overflow-hidden">
            <div className="px-4 py-2 bg-[#10283D] border-b border-[#294357] flex items-center justify-between text-xs text-[#B9C2CC] font-mono">
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-[#27C5E8]" />
                <span className="font-medium text-[#F1F0EE]">
                  {currentStep.author === 'opponent' ? `${battle.opponentName} snapshot` : 'Your code snapshot'}
                </span>
              </div>
              <span className="text-[11px] tabular-nums">
                {currentStep.code.split('\n').length} lines · {battle.languageUsed.toUpperCase()}
              </span>
            </div>

            <div className="flex font-mono text-xs overflow-x-auto max-h-[320px] p-2.5 bg-[#07121E] text-[#F1F0EE]">
              <div className="select-none pr-3 pl-1 text-right text-[#B9C2CC]/40 border-r border-[#294357]">
                {currentStep.code.split('\n').map((_, i) => (
                  <div key={i} className="leading-relaxed">
                    {i + 1}
                  </div>
                ))}
              </div>

              <pre className="pl-3 leading-relaxed text-[#F1F0EE] whitespace-pre">
                {currentStep.code}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#294357] bg-[#10283D] flex items-center justify-between text-xs">
          <div className="text-[#B9C2CC]">
            Use the step buttons or playback controls to inspect each submission.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-1.5 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] font-medium disabled:opacity-40 transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleStepForward}
              disabled={currentStepIndex === steps.length - 1}
              className="px-4 py-1.5 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] font-medium disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
