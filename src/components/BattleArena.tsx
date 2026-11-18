import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Swords,
  XCircle,
  Flag,
  Award,
  Share2,
  RotateCcw
} from 'lucide-react';
import { BattleMode, BattleReplayStep, BotTier, Language, Opponent, Problem, SubmissionResult, User } from '../types';
import { ProblemDescription } from './ProblemDescription';
import { CodeEditor } from './CodeEditor';
import { TestResultsPanel } from './TestResultsPanel';
import { ShareResultModal } from './ShareResultModal';
import { executeCode } from '../services/codeRunner';
import { BOT_PROFILES, createOpponent, createHumanOpponent } from '../services/battleEngine';
import { calculateElo } from '../services/storage';

interface BattleArenaProps {
  problem: Problem;
  mode: BattleMode;
  botTier?: BotTier;
  durationMinutes: number;
  roomCode?: string;
  currentUser: User;
  onBattleEnd: (result: {
    outcome: 'victory' | 'defeat' | 'draw';
    userScore: number;
    opponentScore: number;
    userTimeSeconds: number;
    opponentTimeSeconds: number;
    ratingDelta: number;
    languageUsed: Language;
    replaySteps?: BattleReplayStep[];
  }) => void;
  onExitArena: () => void;
  onRematch: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({
  problem,
  mode,
  botTier = 'Skilled',
  durationMinutes,
  roomCode,
  currentUser,
  onBattleEnd,
  onExitArena,
  onRematch
}) => {
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentUser.preferredLanguage || 'javascript');
  const [code, setCode] = useState<string>(problem.starterCode[currentUser.preferredLanguage || 'javascript']);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<SubmissionResult | null>(null);
  const [mobilePane, setMobilePane] = useState<'problem' | 'editor'>('editor');

  const [opponent, setOpponent] = useState<Opponent>(() => {
    if (mode === 'bot') {
      return createOpponent(botTier, problem.testCases.length);
    } else if (mode === 'ranked') {
      const ladderNames = ['Alex Chen', 'Sarah Jenkins', 'Rohan Sharma', 'Kenji Sato'];
      const randName = ladderNames[Math.floor(Math.random() * ladderNames.length)];
      return createHumanOpponent(randName, currentUser.rating + Math.floor(Math.random() * 60 - 30), currentUser.rankTier, problem.testCases.length);
    } else {
      return createHumanOpponent(roomCode ? `Opponent (${roomCode})` : 'Player 2', 1500, 'Gold', problem.testCases.length);
    }
  });

  const [battleOutcome, setBattleOutcome] = useState<'victory' | 'defeat' | 'draw' | null>(null);
  const [outcomeStats, setOutcomeStats] = useState<any>(null);
  const [opponentActivityLog, setOpponentActivityLog] = useState<string>('Match started');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const opponentSimRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const battleEndedRef = useRef<boolean>(false);

  const replayStepsRef = useRef<BattleReplayStep[]>([
    {
      stepNumber: 1,
      timestampSeconds: 0,
      author: 'user',
      type: 'initial_code',
      title: 'Match Start & Starter Template',
      code: problem.starterCode[currentUser.preferredLanguage || 'javascript'] || problem.starterCode.javascript,
      testsPassed: 0,
      totalTests: problem.testCases.length,
      status: 'in_progress',
      log: 'Initialized editor with starter code.'
    }
  ]);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setCode(problem.starterCode[lang] || '');
  };

  const handleResetCode = () => {
    setCode(problem.starterCode[selectedLanguage] || '');
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!battleEndedRef.current) {
            handleTimeExpiry();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (battleOutcome) return;

    let elapsed = 0;
    const botCfg = botTier ? BOT_PROFILES[botTier] : BOT_PROFILES.Skilled;
    const targetFinishTime = Math.floor(
      botCfg.minTimeSec + Math.random() * (botCfg.maxTimeSec - botCfg.minTimeSec)
    );

    opponentSimRef.current = setInterval(() => {
      elapsed += 2;
      if (battleEndedRef.current) return;

      setOpponent((prev) => {
        const progress = Math.min(100, Math.round((elapsed / targetFinishTime) * 100));
        let nextStatus = prev.status;
        let testsPassed = prev.testsPassed;

        if (progress > 15 && progress < 45) {
          nextStatus = 'typing';
          setOpponentActivityLog('Opponent writing solution');
        } else if (progress >= 45 && progress < 70) {
          nextStatus = 'running_tests';
          testsPassed = Math.min(problem.testCases.length - 1, Math.floor((progress / 100) * problem.testCases.length));
          setOpponentActivityLog(`Opponent ran tests: ${testsPassed}/${problem.testCases.length} passed`);

          if (!replayStepsRef.current.some((s) => s.title.includes('Opponent Activity'))) {
            replayStepsRef.current.push({
              stepNumber: replayStepsRef.current.length + 1,
              timestampSeconds: elapsed,
              author: 'opponent',
              type: 'run_tests',
              title: `Opponent Activity: ${prev.name}`,
              code: `// ${prev.name} progress\n// Passed ${testsPassed}/${problem.testCases.length} test cases`,
              testsPassed,
              totalTests: problem.testCases.length,
              status: 'in_progress',
              log: `${prev.name} ran test cases (${testsPassed}/${problem.testCases.length} passed).`
            });
          }
        } else if (progress >= 70 && progress < 95) {
          nextStatus = 'typing';
          testsPassed = Math.max(testsPassed, problem.testCases.length - 1);
          setOpponentActivityLog('Opponent reviewing edge cases');
        } else if (progress >= 95) {
          nextStatus = 'submitted';
          testsPassed = problem.testCases.length;
          setOpponentActivityLog('Opponent submitted accepted solution');
          if (!battleEndedRef.current) {
            handleFinishBattle('defeat', elapsed);
          }
        }

        return {
          ...prev,
          progressPercent: progress,
          status: nextStatus,
          testsPassed
        };
      });
    }, 2000);

    return () => {
      if (opponentSimRef.current) clearInterval(opponentSimRef.current);
    };
  }, [battleOutcome, botTier]);

  const handleTimeExpiry = () => {
    const userPassed = testResult?.totalPassed || 0;
    const oppPassed = opponent.testsPassed;

    let result: 'victory' | 'defeat' | 'draw' = 'draw';
    if (userPassed > oppPassed) result = 'victory';
    else if (userPassed < oppPassed) result = 'defeat';

    handleFinishBattle(result, totalSeconds);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await executeCode(problem, code, selectedLanguage);
      setTestResult(res);

      replayStepsRef.current.push({
        stepNumber: replayStepsRef.current.length + 1,
        timestampSeconds: totalSeconds - secondsRemaining,
        author: 'user',
        type: 'run_tests',
        title: `Test Run (${res.totalPassed}/${problem.testCases.length} Passed)`,
        code,
        testsPassed: res.totalPassed,
        totalTests: problem.testCases.length,
        runtimeMs: res.runtimeMs,
        status: res.status === 'Accepted' ? 'passed' : 'failed',
        log: `Executed test cases: ${res.totalPassed}/${problem.testCases.length} passed.`
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);
    try {
      const res = await executeCode(problem, code, selectedLanguage);
      setTestResult(res);

      replayStepsRef.current.push({
        stepNumber: replayStepsRef.current.length + 1,
        timestampSeconds: totalSeconds - secondsRemaining,
        author: 'user',
        type: 'submission',
        title: res.status === 'Accepted' ? 'Accepted Submission' : 'Submission Evaluation',
        code,
        testsPassed: res.totalPassed,
        totalTests: problem.testCases.length,
        runtimeMs: res.runtimeMs,
        status: res.status === 'Accepted' ? 'accepted' : 'failed',
        log:
          res.status === 'Accepted'
            ? 'All test cases passed. Solution accepted.'
            : `Evaluated submission: ${res.totalPassed}/${problem.testCases.length} passed.`
      });

      if (res.status === 'Accepted' && res.totalPassed === problem.testCases.length) {
        const userTime = totalSeconds - secondsRemaining;
        handleFinishBattle('victory', userTime);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCustomInput = async (customStr: string) => {
    setIsRunning(true);
    try {
      let parsed = [];
      try {
        parsed = JSON.parse(customStr);
        if (!Array.isArray(parsed)) parsed = [parsed];
      } catch {
        parsed = [customStr];
      }
      const res = await executeCode(problem, code, selectedLanguage, parsed);
      setTestResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSurrender = () => {
    handleFinishBattle('defeat', totalSeconds - secondsRemaining);
  };

  const handleFinishBattle = (
    outcome: 'victory' | 'defeat' | 'draw',
    elapsedSeconds: number
  ) => {
    if (battleEndedRef.current) return;
    battleEndedRef.current = true;

    if (timerRef.current) clearInterval(timerRef.current);
    if (opponentSimRef.current) clearInterval(opponentSimRef.current);

    const delta = calculateElo(currentUser.rating, opponent.rating, outcome);
    const baseScore = outcome === 'victory' ? 800 : outcome === 'draw' ? 500 : 350;
    const speedBonus = Math.max(0, Math.round(((totalSeconds - elapsedSeconds) / totalSeconds) * 200));
    const userFinalScore = baseScore + speedBonus;
    const oppFinalScore = outcome === 'victory' ? Math.round(userFinalScore * 0.75) : userFinalScore + 80;

    setOutcomeStats({
      outcome,
      userScore: userFinalScore,
      opponentScore: oppFinalScore,
      userTimeSeconds: elapsedSeconds,
      opponentTimeSeconds: Math.min(totalSeconds, elapsedSeconds + (outcome === 'victory' ? 35 : -20)),
      ratingDelta: delta,
      languageUsed: selectedLanguage
    });

    setBattleOutcome(outcome);

    onBattleEnd({
      outcome,
      userScore: userFinalScore,
      opponentScore: oppFinalScore,
      userTimeSeconds: elapsedSeconds,
      opponentTimeSeconds: Math.min(totalSeconds, elapsedSeconds + (outcome === 'victory' ? 35 : -20)),
      ratingDelta: delta,
      languageUsed: selectedLanguage,
      replaySteps: replayStepsRef.current
    });
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = secondsRemaining < 60;
  const userLiveScore = (testResult?.totalPassed || 0) * Math.round(problem.maxScore / Math.max(1, problem.testCases.length));
  const oppLiveScore = opponent.testsPassed * Math.round(problem.maxScore / Math.max(1, problem.testCases.length));

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] bg-[#07121E] overflow-hidden">
      {/* Match Top Bar */}
      <div className="bg-[#10283D] border-b border-[#294357] px-4 py-2 flex items-center justify-between gap-4 shrink-0">
        {/* Player 1 */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded ${currentUser.avatarBg} flex items-center justify-center text-xs font-mono font-semibold shrink-0`}>
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#27C5E8] truncate">
              {currentUser.displayName} (You)
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#B9C2CC] font-mono tabular-nums">
              <span className="text-[#E8AE38]">{userLiveScore} pts</span>
              <span>·</span>
              <span>
                {testResult ? `${testResult.totalPassed}/${problem.testCases.length} passed` : '0 passed'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Countdown Timer */}
        <div className="flex flex-col items-center justify-center px-2">
          <div
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded border font-mono text-sm font-semibold tabular-nums ${
              isUrgent
                ? 'bg-[#07121E] border-rose-500 text-rose-400'
                : 'bg-[#07121E] border-[#294357] text-[#E8AE38]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeFormatted}</span>
          </div>
          <span className="text-[11px] text-[#B9C2CC] mt-0.5 truncate max-w-[220px] text-center hidden sm:block">
            {opponentActivityLog}
          </span>
        </div>

        {/* Opponent & Forfeit */}
        <div className="flex items-center gap-2.5 min-w-0 justify-end">
          <div className="hidden lg:block text-right min-w-0">
            <div className="text-xs font-medium text-[#F1F0EE] truncate">
              {opponent.name}
            </div>
            <div className="flex items-center justify-end gap-2 text-[11px] text-[#B9C2CC] font-mono tabular-nums">
              <span className="text-[#E8AE38]">{oppLiveScore} pts</span>
              <span>·</span>
              <span>{opponent.testsPassed}/{problem.testCases.length} passed</span>
            </div>
          </div>
          <div className={`hidden sm:flex w-8 h-8 rounded ${opponent.avatarBg} items-center justify-center text-xs font-mono font-semibold shrink-0`}>
            {opponent.avatar}
          </div>

          <button
            type="button"
            onClick={handleSurrender}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#B9C2CC] hover:text-rose-400 bg-[#07121E] border border-[#294357] hover:border-rose-500/50 rounded transition-colors"
            title="Forfeit match"
          >
            <Flag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Forfeit</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="w-full bg-[#07121E] border-b border-[#294357] h-1 flex overflow-hidden">
        <div
          className="bg-[#27C5E8] transition-all duration-300"
          style={{
            width: `${((testResult?.totalPassed || 0) / Math.max(1, problem.testCases.length)) * 50}%`
          }}
        />
        <div className="flex-1 bg-[#10283D]" />
        <div
          className="bg-[#E8AE38] transition-all duration-300 ml-auto"
          style={{
            width: `${(opponent.testsPassed / Math.max(1, problem.testCases.length)) * 50}%`
          }}
        />
      </div>

      {/* Mobile Pane Switcher */}
      <div className="lg:hidden flex items-center justify-center gap-2 px-3 py-2 bg-[#10283D] border-b border-[#294357] text-xs">
        <button
          type="button"
          onClick={() => setMobilePane('problem')}
          className={`flex-1 py-1.5 rounded font-medium ${
            mobilePane === 'problem' ? 'bg-[#27C5E8] text-[#07121E]' : 'bg-[#07121E] text-[#B9C2CC]'
          }`}
        >
          Problem
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('editor')}
          className={`flex-1 py-1.5 rounded font-medium ${
            mobilePane === 'editor' ? 'bg-[#27C5E8] text-[#07121E]' : 'bg-[#07121E] text-[#B9C2CC]'
          }`}
        >
          Editor
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2.5 p-2.5 overflow-hidden">
        <div className={`lg:col-span-5 h-full overflow-hidden ${mobilePane === 'problem' ? 'block' : 'hidden lg:block'}`}>
          <ProblemDescription
            problem={problem}
            isSolved={currentUser.problemsSolved.includes(problem.id)}
          />
        </div>

        <div className={`lg:col-span-7 flex flex-col gap-2.5 h-full overflow-hidden ${mobilePane === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex-1 min-h-[260px] overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              onReset={handleResetCode}
              onRun={handleRunCode}
              onSubmit={handleSubmitSolution}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              disabled={!!battleOutcome}
            />
          </div>

          <div className="h-[225px] shrink-0 overflow-hidden">
            <TestResultsPanel
              problem={problem}
              result={testResult}
              isRunning={isRunning}
              onRunCustomInput={handleRunCustomInput}
            />
          </div>
        </div>
      </div>

      {/* Battle Result Modal */}
      {battleOutcome && outcomeStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07121E]/85">
          <div className="max-w-lg w-full bg-[#112D43] border border-[#294357] rounded-md p-6 shadow-xl space-y-5">
            <div className="text-center space-y-1.5 border-b border-[#294357] pb-4">
              <div className="inline-flex p-2.5 rounded-md bg-[#10283D] border border-[#294357] mx-auto">
                {battleOutcome === 'victory' && <Award className="w-6 h-6 text-[#E8AE38]" />}
                {battleOutcome === 'defeat' && <XCircle className="w-6 h-6 text-rose-400" />}
                {battleOutcome === 'draw' && <Swords className="w-6 h-6 text-[#27C5E8]" />}
              </div>

              <h2 className="font-heading text-2xl font-semibold text-[#F1F0EE]">
                {battleOutcome === 'victory'
                  ? `Winner: ${currentUser.displayName}`
                  : battleOutcome === 'defeat'
                  ? `Winner: ${opponent.name}`
                  : 'Draw Match'}
              </h2>
              <p className="text-xs text-[#B9C2CC]">
                {problem.title} ({problem.difficulty}) · {battleOutcome === 'victory' ? 'Won' : battleOutcome === 'defeat' ? 'Lost' : 'Draw'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-md bg-[#07121E] border border-[#294357] space-y-1">
                <div className="text-[#27C5E8] font-medium">You · {currentUser.displayName}</div>
                <div className="text-lg font-semibold font-mono text-[#E8AE38] tabular-nums">
                  {outcomeStats.userScore} pts
                </div>
                <div className="text-[#B9C2CC] font-mono tabular-nums">
                  Time: {Math.floor(outcomeStats.userTimeSeconds / 60)}m {outcomeStats.userTimeSeconds % 60}s
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-[#07121E] border border-[#294357] space-y-1">
                <div className="text-[#B9C2CC] font-medium truncate">Opponent · {opponent.name}</div>
                <div className="text-lg font-semibold font-mono text-[#F1F0EE] tabular-nums">
                  {outcomeStats.opponentScore} pts
                </div>
                <div className="text-[#B9C2CC] font-mono tabular-nums">
                  Time: {Math.floor(outcomeStats.opponentTimeSeconds / 60)}m {outcomeStats.opponentTimeSeconds % 60}s
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-[#10283D] border border-[#294357] rounded-md flex items-center justify-between font-mono text-xs">
              <span className="text-[#B9C2CC]">Rating change</span>
              <span className="font-semibold text-[#F1F0EE] tabular-nums">
                {currentUser.rating + outcomeStats.ratingDelta} LP{' '}
                <span className={outcomeStats.ratingDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  ({outcomeStats.ratingDelta >= 0 ? `+${outcomeStats.ratingDelta}` : outcomeStats.ratingDelta})
                </span>
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="w-full py-2 px-4 rounded-md border border-[#294357] bg-[#10283D] hover:border-[#27C5E8] text-[#F1F0EE] hover:text-[#27C5E8] text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share match summary</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onRematch}
                  className="py-2 px-4 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rematch</span>
                </button>
                <button
                  type="button"
                  onClick={onExitArena}
                  className="py-2 px-4 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] text-xs font-medium transition-colors"
                >
                  Return to dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {battleOutcome && outcomeStats && (
        <ShareResultModal
          battle={{
            id: `match_${Date.now()}`,
            timestamp: new Date().toISOString(),
            problemId: problem.id,
            problemTitle: problem.title,
            difficulty: problem.difficulty,
            opponentName: opponent.name,
            opponentRating: opponent.rating,
            opponentScore: outcomeStats.opponentScore,
            userScore: outcomeStats.userScore,
            result: battleOutcome,
            ratingChange: outcomeStats.ratingDelta,
            userTimeSeconds: outcomeStats.userTimeSeconds,
            opponentTimeSeconds: outcomeStats.opponentTimeSeconds,
            languageUsed: selectedLanguage,
            isBot: mode === 'bot'
          }}
          currentUser={currentUser}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
