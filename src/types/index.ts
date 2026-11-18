export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'javascript' | 'python' | 'cpp' | 'java';
export type BotTier = 'Novice' | 'Skilled' | 'Grandmaster';
export type BattleMode = 'bot' | 'ranked' | 'room' | 'local2p';
export type BattleResult = 'victory' | 'defeat' | 'draw' | 'in_progress';
export type NavTab = 'dashboard' | 'problems' | 'battles' | 'leaderboard' | 'history' | 'profile' | 'auth';

export interface TestCase {
  id: number;
  input: string;
  expected: string;
  params: any[];
  isHidden?: boolean;
  explanation?: string;
}

export interface Problem {
  id: string;
  problemCode: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  maxScore: number;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<Language, string>;
  testCases: TestCase[];
  hints: string[];
  timeLimitMs: number;
}

export interface TestResult {
  testCaseId: number;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  stdout?: string;
  runtimeMs: number;
  error?: string;
  isHidden?: boolean;
}

export interface SubmissionResult {
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded';
  totalPassed: number;
  totalTests: number;
  runtimeMs: number;
  memoryMb: number;
  testResults: TestResult[];
  error?: string;
  engineMode: 'browser-js' | 'client-transpiler' | 'simulated-preview' | 'judge0-api';
  engineNote: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar: string;
  avatarBg: string;
  rating: number; // Elo rating / Total Score
  rankTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';
  battlesWon: number;
  battlesLost: number;
  problemsSolved: string[]; // Problem IDs
  streak: number;
  preferredLanguage: Language;
  bio: string;
  achievements: string[];
  createdAt: string;
}

export interface AuthAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Opponent {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  rating: number;
  tier: string;
  isBot: boolean;
  botDifficulty?: BotTier;
  testsPassed: number;
  totalTests: number;
  status: 'thinking' | 'typing' | 'running_tests' | 'submitted' | 'failed';
  codeLength: number;
  progressPercent: number;
  submittedAt?: number;
}

export interface AvailableBattle {
  id: string;
  roomCode: string;
  hostName: string;
  hostRating: number;
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  durationMinutes: number;
  createdAt: string;
}

export interface BattleReplayStep {
  stepNumber: number;
  timestampSeconds: number;
  author: 'user' | 'opponent';
  type: 'initial_code' | 'draft_logic' | 'run_tests' | 'fix_bug' | 'submission';
  title: string;
  code: string;
  testsPassed: number;
  totalTests: number;
  runtimeMs?: number;
  status: 'passed' | 'failed' | 'in_progress' | 'accepted';
  log: string;
}

export interface BattleHistoryItem {
  id: string;
  timestamp: string;
  problemId: string;
  problemTitle: string;
  difficulty: Difficulty;
  opponentName: string;
  opponentRating: number;
  isBot: boolean;
  result: 'victory' | 'defeat' | 'draw';
  userScore: number;
  opponentScore: number;
  userTimeSeconds: number;
  opponentTimeSeconds: number;
  ratingChange: number;
  languageUsed: Language;
  replaySteps?: BattleReplayStep[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  avatarBg: string;
  rating: number;
  rankTier: string;
  battlesWon: number;
  battlesTotal: number;
  winRate: number;
  solvedCount: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category:
    | 'Practice'
    | 'Battles'
    | 'Languages'
    | 'Consistency'
    | 'Daily Challenge'
    | 'Speed Duel'
    | 'Polyglot'
    | 'Precision';
  targetType: 'solve_problem' | 'win_battle' | 'use_language' | 'any_submission';
  targetProblemId?: string;
  targetProblemTitle?: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardLp: number;
  rewardAchievement?: string;
  iconName?: string;
}
