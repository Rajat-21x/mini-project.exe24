import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BattleLobby } from './components/BattleLobby';
import { BattleArena } from './components/BattleArena';
import { PracticeArena } from './components/PracticeArena';
import { LeaderboardView } from './components/LeaderboardView';
import { BattleHistoryView } from './components/BattleHistoryView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { ProjectPresentationModal } from './components/ProjectPresentationModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import {
  BattleHistoryItem,
  BattleMode,
  BattleReplayStep,
  BotTier,
  DailyMission,
  Language,
  LeaderboardEntry,
  NavTab,
  Problem,
  User
} from './types';
import {
  getStoredUser,
  saveStoredUser,
  getStoredBattleHistory,
  addBattleHistoryItem,
  getLeaderboard,
  getRankTier,
  getDailyMissions,
  updateDailyMissionProgress,
  claimDailyMissionReward,
  isSessionAuthenticated,
  setSessionAuthenticated,
  getAttemptedProblemIds,
  markProblemAttempted
} from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionAuthenticated());
  const [currentUser, setCurrentUser] = useState<User>(() => getStoredUser());
  const [battleHistory, setBattleHistory] = useState<BattleHistoryItem[]>(() => getStoredBattleHistory());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard());
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => getDailyMissions());
  const [attemptedProblemIds, setAttemptedProblemIds] = useState<string[]>(() => getAttemptedProblemIds());
  const [practiceTargetProblemId, setPracticeTargetProblemId] = useState<string | undefined>(undefined);

  // Active Battle State
  const [activeBattleConfig, setActiveBattleConfig] = useState<{
    problem: Problem;
    mode: BattleMode;
    botTier?: BotTier;
    durationMinutes: number;
    roomCode?: string;
  } | null>(null);
  const [rematchKey, setRematchKey] = useState<number>(0);

  // Modals
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isDailyMissionsOpen, setIsDailyMissionsOpen] = useState(false);

  // Keep dark navy document theme active
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleNavigate = (tab: NavTab) => {
    setActiveBattleConfig(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProblem = (problemId: string) => {
    setActiveBattleConfig(null);
    markProblemAttempted(problemId);
    setAttemptedProblemIds(getAttemptedProblemIds());
    setPracticeTargetProblemId(problemId);
    setCurrentTab('problems');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch a new battle
  const handleStartBattle = (config: {
    mode: BattleMode;
    botTier?: BotTier;
    durationMinutes: number;
    problem: Problem;
    roomCode?: string;
  }) => {
    setActiveBattleConfig(config);
    setRematchKey((k) => k + 1);
  };

  // Rematch in BattleArena
  const handleRematch = () => {
    setRematchKey((k) => k + 1);
  };

  // Exit / return from battle arena
  const handleExitArena = () => {
    setActiveBattleConfig(null);
  };

  // Handle completed battle
  const handleBattleEnd = (result: {
    outcome: 'victory' | 'defeat' | 'draw';
    userScore: number;
    opponentScore: number;
    userTimeSeconds: number;
    opponentTimeSeconds: number;
    ratingDelta: number;
    languageUsed: Language;
    replaySteps?: BattleReplayStep[];
  }) => {
    if (!activeBattleConfig) return;

    const newRating = Math.max(800, currentUser.rating + result.ratingDelta);
    const newTier = getRankTier(newRating);
    const isWin = result.outcome === 'victory';

    const updatedUser: User = {
      ...currentUser,
      rating: newRating,
      rankTier: newTier,
      battlesWon: isWin ? currentUser.battlesWon + 1 : currentUser.battlesWon,
      battlesLost: !isWin && result.outcome !== 'draw' ? currentUser.battlesLost + 1 : currentUser.battlesLost,
      streak: isWin ? currentUser.streak + 1 : 0,
      problemsSolved:
        isWin && !currentUser.problemsSolved.includes(activeBattleConfig.problem.id)
          ? [...currentUser.problemsSolved, activeBattleConfig.problem.id]
          : currentUser.problemsSolved
    };

    setCurrentUser(updatedUser);
    saveStoredUser(updatedUser);
    markProblemAttempted(activeBattleConfig.problem.id);
    setAttemptedProblemIds(getAttemptedProblemIds());

    const historyItem: BattleHistoryItem = {
      id: 'match-' + Date.now().toString().slice(-6),
      timestamp: new Date().toISOString(),
      problemId: activeBattleConfig.problem.id,
      problemTitle: activeBattleConfig.problem.title,
      difficulty: activeBattleConfig.problem.difficulty,
      opponentName:
        activeBattleConfig.mode === 'bot'
          ? `Practice Bot (${activeBattleConfig.botTier === 'Grandmaster' ? 'Advanced' : activeBattleConfig.botTier === 'Novice' ? 'Novice' : 'Intermediate'})`
          : activeBattleConfig.roomCode
          ? `Rival (${activeBattleConfig.roomCode})`
          : 'Ranked Competitor',
      opponentRating:
        activeBattleConfig.botTier === 'Grandmaster'
          ? 2150
          : activeBattleConfig.botTier === 'Novice'
          ? 1050
          : 1540,
      isBot: activeBattleConfig.mode === 'bot',
      result: result.outcome,
      userScore: result.userScore,
      opponentScore: result.opponentScore,
      userTimeSeconds: result.userTimeSeconds,
      opponentTimeSeconds: result.opponentTimeSeconds,
      ratingChange: result.ratingDelta,
      languageUsed: result.languageUsed,
      replaySteps: result.replaySteps
    };

    addBattleHistoryItem(historyItem);
    setBattleHistory(getStoredBattleHistory());

    if (result.outcome === 'victory') {
      updateDailyMissionProgress('win_battle');
      updateDailyMissionProgress('solve_problem', activeBattleConfig.problem.id);
    }
    if (result.languageUsed !== 'javascript') {
      updateDailyMissionProgress('use_language', result.languageUsed);
    }
    setDailyMissions(getDailyMissions());
    setLeaderboard(getLeaderboard());
  };

  // Practice problem solved
  const handleProblemSolved = (problemId: string) => {
    markProblemAttempted(problemId);
    setAttemptedProblemIds(getAttemptedProblemIds());

    if (!currentUser.problemsSolved.includes(problemId)) {
      const updatedUser: User = {
        ...currentUser,
        problemsSolved: [...currentUser.problemsSolved, problemId]
      };
      setCurrentUser(updatedUser);
      saveStoredUser(updatedUser);
      setLeaderboard(getLeaderboard());
    }

    updateDailyMissionProgress('solve_problem', problemId);
    setDailyMissions(getDailyMissions());
  };

  // Claim Daily Mission Reward
  const handleClaimMissionReward = (missionId: string) => {
    const { user: updatedUser } = claimDailyMissionReward(missionId);
    setCurrentUser(updatedUser);
    setDailyMissions(getDailyMissions());
    setLeaderboard(getLeaderboard());
  };

  const handleGoToBattleFromMission = () => {
    setActiveBattleConfig(null);
    setCurrentTab('battles');
  };

  // Save updated user profile
  const handleSaveUser = (updated: User) => {
    setCurrentUser(updated);
    saveStoredUser(updated);
    setLeaderboard(getLeaderboard());
  };

  // Logout & Login handlers
  const handleLogout = () => {
    setSessionAuthenticated(false);
    setIsAuthenticated(false);
    setActiveBattleConfig(null);
    setCurrentTab('auth');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setSessionAuthenticated(true);
    setLeaderboard(getLeaderboard());
    setCurrentTab('dashboard');
  };

  const targetMissionProblemId = dailyMissions.find((m) => m.targetProblemId)?.targetProblemId;

  return (
    <div className="min-h-screen flex flex-col bg-[#07121E] text-[#F1F0EE] selection:bg-[#27C5E8]/25 selection:text-[#F1F0EE]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            battleHistory={battleHistory}
            leaderboard={leaderboard}
            attemptedProblemIds={attemptedProblemIds}
            missions={dailyMissions}
            onNavigate={handleNavigate}
            onOpenProblem={handleOpenProblem}
            onOpenDailyMissions={() => setIsDailyMissionsOpen(true)}
            onClaimMissionReward={handleClaimMissionReward}
            onOpenPresentation={() => setIsProjectInfoOpen(true)}
          />
        )}

        {currentTab === 'problems' && (
          <PracticeArena
            currentUser={currentUser}
            onProblemSolved={handleProblemSolved}
            dailyMissionProblemId={targetMissionProblemId}
            initialProblemId={practiceTargetProblemId}
          />
        )}

        {currentTab === 'battles' && (
          activeBattleConfig ? (
            <BattleArena
              key={rematchKey}
              problem={activeBattleConfig.problem}
              mode={activeBattleConfig.mode}
              botTier={activeBattleConfig.botTier}
              durationMinutes={activeBattleConfig.durationMinutes}
              roomCode={activeBattleConfig.roomCode}
              currentUser={currentUser}
              onBattleEnd={handleBattleEnd}
              onExitArena={handleExitArena}
              onRematch={handleRematch}
            />
          ) : (
            <BattleLobby
              currentUser={currentUser}
              onStartBattle={handleStartBattle}
            />
          )
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            entries={leaderboard}
            currentUserId={currentUser.id}
          />
        )}

        {currentTab === 'history' && (
          <BattleHistoryView
            history={battleHistory}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            battleHistory={battleHistory}
            leaderboard={leaderboard}
            onSaveUser={handleSaveUser}
            onOpenAuth={() => handleNavigate('auth')}
          />
        )}

        {currentTab === 'auth' && (
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            onCancel={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      {/* Clean Footer (hidden during active full-height code workspace) */}
      {!activeBattleConfig && (
        <footer className="border-t border-[#294357] bg-[#07121E] py-6 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B9C2CC]">
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-[#F1F0EE]">Coding Battle Arena</span>
              <span>·</span>
              <span>BCA 5th Semester Project · Dhiraj Kumar</span>
            </div>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className="hover:text-[#27C5E8] transition-colors"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('problems')}
                className="hover:text-[#27C5E8] transition-colors"
              >
                Problems
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('battles')}
                className="hover:text-[#27C5E8] transition-colors"
              >
                Battles
              </button>
              <button
                type="button"
                onClick={() => setIsProjectInfoOpen(true)}
                className="hover:text-[#27C5E8] transition-colors"
              >
                Project brief
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <DailyMissionsModal
        isOpen={isDailyMissionsOpen}
        onClose={() => setIsDailyMissionsOpen(false)}
        missions={dailyMissions}
        onClaimReward={handleClaimMissionReward}
        onSelectProblem={handleOpenProblem}
        onGoToBattle={handleGoToBattleFromMission}
      />

      <ProjectPresentationModal
        isOpen={isProjectInfoOpen}
        onClose={() => setIsProjectInfoOpen(false)}
      />
    </div>
  );
}
