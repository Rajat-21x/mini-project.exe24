import { AvailableBattle, AuthAccount, BattleHistoryItem, BattleReplayStep, DailyMission, Difficulty, LeaderboardEntry, User } from '../types';
import { PROBLEMS } from '../data/problems';

const STORAGE_KEYS = {
  CURRENT_USER: 'cba_current_user',
  ACCOUNTS: 'cba_accounts',
  AUTH_SESSION: 'cba_auth_session',
  REMEMBERED_EMAIL: 'cba_remembered_email',
  ATTEMPTED_PROBLEMS: 'cba_attempted_problems',
  AVAILABLE_BATTLES: 'cba_available_battles',
  BATTLE_HISTORY: 'cba_battle_history',
  LEADERBOARD: 'cba_leaderboard',
  DAILY_MISSIONS: 'cba_daily_missions'
};

export const INITIAL_CURRENT_USER: User = {
  id: 'user-dhiraj-001',
  username: 'dhiraj_kumar',
  displayName: 'Dhiraj Kumar',
  email: 'dhiraj.kumar@cba.edu',
  avatar: 'DK',
  avatarBg: 'bg-[#10283D] border border-[#27C5E8]/50 text-[#27C5E8]',
  rating: 1650,
  rankTier: 'Diamond',
  battlesWon: 28,
  battlesLost: 6,
  problemsSolved: ['two-sum', 'valid-palindrome', 'valid-parentheses', 'binary-search', 'maximum-subarray'],
  streak: 5,
  preferredLanguage: 'javascript',
  bio: 'BCA 5th Semester · Software Engineering & Algorithms',
  achievements: ['First Match Win', 'Quick Solver', '5-Match Win Streak', 'Problem Solver'],
  createdAt: '2026-09-01'
};

export const INITIAL_LEADERBOARD_BOTS: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'user-001',
    username: 'alex_coder',
    displayName: 'Alex Chen',
    avatar: 'AC',
    avatarBg: 'bg-[#10283D] border border-[#E8AE38]/60 text-[#E8AE38]',
    rating: 2180,
    rankTier: 'Grandmaster',
    battlesWon: 94,
    battlesTotal: 108,
    winRate: 87,
    solvedCount: 42,
    streak: 12
  },
  {
    rank: 2,
    id: 'user-002',
    username: 'sarah_algo',
    displayName: 'Sarah Jenkins',
    avatar: 'SJ',
    avatarBg: 'bg-[#10283D] border border-[#B9C2CC]/60 text-[#F1F0EE]',
    rating: 2045,
    rankTier: 'Grandmaster',
    battlesWon: 81,
    battlesTotal: 96,
    winRate: 84,
    solvedCount: 38,
    streak: 8
  },
  {
    rank: 3,
    id: 'user-dhiraj-001',
    username: 'dhiraj_kumar',
    displayName: 'Dhiraj Kumar',
    avatar: 'DK',
    avatarBg: 'bg-[#10283D] border border-[#27C5E8]/60 text-[#27C5E8]',
    rating: 1650,
    rankTier: 'Diamond',
    battlesWon: 28,
    battlesTotal: 34,
    winRate: 82,
    solvedCount: 5,
    streak: 5,
    isCurrentUser: true
  },
  {
    rank: 4,
    id: 'user-003',
    username: 'byteninja',
    displayName: 'Rohan Sharma',
    avatar: 'RS',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#39BDE0]',
    rating: 1590,
    rankTier: 'Diamond',
    battlesWon: 45,
    battlesTotal: 60,
    winRate: 75,
    solvedCount: 29,
    streak: 3
  },
  {
    rank: 5,
    id: 'user-004',
    username: 'ada_coder',
    displayName: 'Ada Lovelace Jr',
    avatar: 'AL',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#39BDE0]',
    rating: 1480,
    rankTier: 'Platinum',
    battlesWon: 38,
    battlesTotal: 55,
    winRate: 69,
    solvedCount: 22,
    streak: 2
  },
  {
    rank: 6,
    id: 'user-005',
    username: 'matrix_neo',
    displayName: 'Neo Anderson',
    avatar: 'NA',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#B9C2CC]',
    rating: 1390,
    rankTier: 'Platinum',
    battlesWon: 31,
    battlesTotal: 49,
    winRate: 63,
    solvedCount: 18,
    streak: 1
  },
  {
    rank: 7,
    id: 'user-006',
    username: 'code_samurai',
    displayName: 'Kenji Sato',
    avatar: 'KS',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#B9C2CC]',
    rating: 1240,
    rankTier: 'Gold',
    battlesWon: 22,
    battlesTotal: 40,
    winRate: 55,
    solvedCount: 15,
    streak: 0
  },
  {
    rank: 8,
    id: 'user-007',
    username: 'debug_queen',
    displayName: 'Elena Rostova',
    avatar: 'ER',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#B9C2CC]',
    rating: 1110,
    rankTier: 'Silver',
    battlesWon: 14,
    battlesTotal: 30,
    winRate: 46,
    solvedCount: 11,
    streak: 0
  }
];

export const INITIAL_BATTLE_HISTORY: BattleHistoryItem[] = [
  {
    id: 'battle-001',
    timestamp: '2026-11-10T14:32:00Z',
    problemId: 'two-sum',
    problemTitle: 'Two Sum',
    difficulty: 'Easy',
    opponentName: 'Practice Bot (Intermediate)',
    opponentRating: 1420,
    isBot: true,
    result: 'victory',
    userScore: 890,
    opponentScore: 720,
    userTimeSeconds: 145,
    opponentTimeSeconds: 210,
    ratingChange: 26,
    languageUsed: 'javascript'
  },
  {
    id: 'battle-002',
    timestamp: '2026-11-09T18:15:00Z',
    problemId: 'valid-palindrome',
    problemTitle: 'Valid Palindrome',
    difficulty: 'Easy',
    opponentName: 'Sarah Jenkins',
    opponentRating: 1980,
    isBot: false,
    result: 'defeat',
    userScore: 650,
    opponentScore: 940,
    userTimeSeconds: 230,
    opponentTimeSeconds: 88,
    ratingChange: -14,
    languageUsed: 'javascript'
  },
  {
    id: 'battle-003',
    timestamp: '2026-11-08T11:05:00Z',
    problemId: 'valid-parentheses',
    problemTitle: 'Valid Parentheses',
    difficulty: 'Easy',
    opponentName: 'Rohan Sharma',
    opponentRating: 1560,
    isBot: false,
    result: 'victory',
    userScore: 920,
    opponentScore: 840,
    userTimeSeconds: 120,
    opponentTimeSeconds: 165,
    ratingChange: 28,
    languageUsed: 'python'
  }
];

export const INITIAL_AVAILABLE_BATTLES: AvailableBattle[] = [
  {
    id: 'room-101',
    roomCode: 'ARENA-4821',
    hostName: 'Rohan Sharma',
    hostRating: 1590,
    problemId: 'maximum-subarray',
    problemTitle: 'Maximum Subarray',
    difficulty: 'Medium',
    durationMinutes: 10,
    createdAt: '2 mins ago'
  },
  {
    id: 'room-102',
    roomCode: 'ARENA-7390',
    hostName: 'Ada Lovelace Jr',
    hostRating: 1480,
    problemId: 'two-sum',
    problemTitle: 'Two Sum',
    difficulty: 'Easy',
    durationMinutes: 5,
    createdAt: '5 mins ago'
  },
  {
    id: 'room-103',
    roomCode: 'ARENA-9104',
    hostName: 'Alex Chen',
    hostRating: 2180,
    problemId: 'trapping-rain-water',
    problemTitle: 'Trapping Rain Water',
    difficulty: 'Hard',
    durationMinutes: 15,
    createdAt: '8 mins ago'
  }
];

export function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CURRENT_USER;
}

export function saveStoredUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error(e);
  }
}

// --- Session & Local Account Auth ---
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `cba_${Math.abs(hash).toString(16)}`;
}

export function getRegisteredAccounts(): AuthAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  const defaultAccount: AuthAccount = {
    id: INITIAL_CURRENT_USER.id,
    fullName: INITIAL_CURRENT_USER.displayName,
    username: INITIAL_CURRENT_USER.username,
    email: INITIAL_CURRENT_USER.email || 'dhiraj.kumar@cba.edu',
    passwordHash: simpleHash('password123'),
    createdAt: INITIAL_CURRENT_USER.createdAt
  };
  return [defaultAccount];
}

export function isSessionAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (raw === null) return true; // Default signed in on initial load to keep existing workspace seamless
    return raw === 'true';
  } catch {
    return true;
  }
}

export function setSessionAuthenticated(val: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, String(val));
  } catch (e) {
    console.error(e);
  }
}

export function getRememberedEmail(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL) || '';
  } catch {
    return '';
  }
}

export function registerAccount(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}): { ok: boolean; error?: string; user?: User } {
  const accounts = getRegisteredAccounts();
  const normalizedEmail = data.email.trim().toLowerCase();
  const normalizedUsername = data.username.trim().toLowerCase();

  if (accounts.some((a) => a.email.toLowerCase() === normalizedEmail)) {
    return { ok: false, error: 'An account with this email already exists.' };
  }
  if (accounts.some((a) => a.username.toLowerCase() === normalizedUsername)) {
    return { ok: false, error: 'That username is already taken.' };
  }

  const initials = data.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || 'U';

  const newAccount: AuthAccount = {
    id: 'user-' + Date.now(),
    fullName: data.fullName.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash: simpleHash(data.password),
    createdAt: new Date().toISOString().split('T')[0]
  };

  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([...accounts, newAccount]));
  } catch (e) {
    console.error(e);
  }

  const newUser: User = {
    id: newAccount.id,
    username: newAccount.username,
    displayName: newAccount.fullName,
    email: newAccount.email,
    avatar: initials,
    avatarBg: 'bg-[#10283D] border border-[#27C5E8]/50 text-[#27C5E8]',
    rating: 1200,
    rankTier: 'Gold',
    battlesWon: 0,
    battlesLost: 0,
    problemsSolved: [],
    streak: 0,
    preferredLanguage: 'javascript',
    bio: 'Competitive Programmer on Coding Battle Arena',
    achievements: ['New Challenger'],
    createdAt: newAccount.createdAt
  };

  saveStoredUser(newUser);
  setSessionAuthenticated(true);
  return { ok: true, user: newUser };
}

export function loginAccount(
  email: string,
  password: string,
  rememberMe: boolean
): { ok: boolean; error?: string; user?: User } {
  const accounts = getRegisteredAccounts();
  const normalizedEmail = email.trim().toLowerCase();
  const account = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

  if (!account) {
    return { ok: false, error: 'No account found with this email address.' };
  }

  if (account.passwordHash !== simpleHash(password)) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }

  if (rememberMe) {
    localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, normalizedEmail);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
  }

  const currentStored = getStoredUser();
  let loggedUser: User;
  if (currentStored.id === account.id || currentStored.email?.toLowerCase() === normalizedEmail) {
    loggedUser = currentStored;
  } else {
    const initials = account.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('') || 'U';
    loggedUser = {
      ...INITIAL_CURRENT_USER,
      id: account.id,
      username: account.username,
      displayName: account.fullName,
      email: account.email,
      avatar: initials,
      rating: account.id === INITIAL_CURRENT_USER.id ? INITIAL_CURRENT_USER.rating : 1200,
      rankTier: account.id === INITIAL_CURRENT_USER.id ? INITIAL_CURRENT_USER.rankTier : 'Gold',
      battlesWon: account.id === INITIAL_CURRENT_USER.id ? INITIAL_CURRENT_USER.battlesWon : 0,
      battlesLost: account.id === INITIAL_CURRENT_USER.id ? INITIAL_CURRENT_USER.battlesLost : 0,
      problemsSolved: account.id === INITIAL_CURRENT_USER.id ? INITIAL_CURRENT_USER.problemsSolved : [],
      streak: account.id === INITIAL_CURRENT_USER.id ? INITIAL_CURRENT_USER.streak : 0,
      createdAt: account.createdAt
    };
  }

  saveStoredUser(loggedUser);
  setSessionAuthenticated(true);
  return { ok: true, user: loggedUser };
}

// --- Attempted Problems Tracking ---
export function getAttemptedProblemIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTED_PROBLEMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return ['reverse-string', 'longest-substring-without-repeating'];
}

export function markProblemAttempted(problemId: string): string[] {
  const current = getAttemptedProblemIds();
  const updated = [problemId, ...current.filter((id) => id !== problemId)].slice(0, 6);
  try {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTED_PROBLEMS, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

// --- Available Battles ---
export function getAvailableBattles(): AvailableBattle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AVAILABLE_BATTLES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_AVAILABLE_BATTLES;
}

export function createAvailableBattle(battle: Omit<AvailableBattle, 'id' | 'createdAt'>): AvailableBattle[] {
  const current = getAvailableBattles();
  const newBattle: AvailableBattle = {
    ...battle,
    id: 'room-' + Date.now(),
    createdAt: 'Just now'
  };
  const updated = [newBattle, ...current.filter((b) => b.roomCode !== battle.roomCode)];
  try {
    localStorage.setItem(STORAGE_KEYS.AVAILABLE_BATTLES, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
  return updated;
}

export function getStoredBattleHistory(): BattleHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BATTLE_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_BATTLE_HISTORY;
}

export function addBattleHistoryItem(item: BattleHistoryItem): void {
  const current = getStoredBattleHistory();
  const updated = [item, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.BATTLE_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

export function getReplayStepsForBattle(item: BattleHistoryItem): BattleReplayStep[] {
  if (item.replaySteps && item.replaySteps.length > 0) {
    return item.replaySteps;
  }

  const prob = PROBLEMS.find((p) => p.id === item.problemId) || PROBLEMS[0];
  const lang = item.languageUsed || 'javascript';
  const totalTests = prob.testCases.length;
  const targetTime = item.userTimeSeconds || 140;
  const starterCode = prob.starterCode[lang] || prob.starterCode.javascript;

  const draftCode = starterCode.replace(
    /return\s*\[\];|return\s*false;|return\s*-1;|return\s*0;/g,
    `// Draft step: constructing main loop\n    return null;`
  );

  const bugCode = starterCode.replace(
    /const complement = target - nums\[i\];|cleaned\.split\(''\)\.reverse\(\)\.join\(''\)/g,
    `// Debugging edge cases\n    // Test run exposed mismatch on hidden case`
  );

  const finalCode = prob.starterCode[lang] || prob.starterCode.javascript;

  return [
    {
      stepNumber: 1,
      timestampSeconds: 0,
      author: 'user',
      type: 'initial_code',
      title: 'Match Start & Boilerplate Loaded',
      code: starterCode,
      testsPassed: 0,
      totalTests,
      status: 'in_progress',
      log: 'Initialized code buffer with problem function signature.'
    },
    {
      stepNumber: 2,
      timestampSeconds: Math.round(targetTime * 0.22),
      author: 'user',
      type: 'draft_logic',
      title: 'Drafted Algorithm Strategy',
      code: draftCode,
      testsPassed: 0,
      totalTests,
      status: 'in_progress',
      log: 'Constructed data structure setup & main iterative loop.'
    },
    {
      stepNumber: 3,
      timestampSeconds: Math.round(targetTime * 0.45),
      author: 'user',
      type: 'run_tests',
      title: 'First Test Run (Sample Cases)',
      code: bugCode,
      testsPassed: Math.max(1, totalTests - 2),
      totalTests,
      runtimeMs: 6,
      status: 'failed',
      log: `Executed test suite: ${Math.max(1, totalTests - 2)}/${totalTests} passed. Failed on edge cases.`
    },
    {
      stepNumber: 4,
      timestampSeconds: Math.round(targetTime * 0.65),
      author: 'opponent',
      type: 'draft_logic',
      title: `Opponent Activity: ${item.opponentName}`,
      code: `// ${item.opponentName}'s concurrent activity\n// Running optimization pass on complexity...\n// Passed 2/${totalTests} test cases`,
      testsPassed: 2,
      totalTests,
      status: 'in_progress',
      log: `${item.opponentName} submitted intermediate test run (${item.opponentRating} LP).`
    },
    {
      stepNumber: 5,
      timestampSeconds: Math.round(targetTime * 0.8),
      author: 'user',
      type: 'fix_bug',
      title: 'Edge-Case Bug Fix & Complexity Polish',
      code: finalCode,
      testsPassed: totalTests,
      totalTests,
      runtimeMs: 4,
      status: 'passed',
      log: `All ${totalTests}/${totalTests} unit test cases passed successfully!`
    },
    {
      stepNumber: 6,
      timestampSeconds: targetTime,
      author: 'user',
      type: 'submission',
      title: item.result === 'victory' ? 'Victory Submission Accepted' : 'Match Final Evaluation',
      code: finalCode,
      testsPassed: item.result === 'victory' ? totalTests : Math.max(1, totalTests - 1),
      totalTests,
      runtimeMs: 3,
      status: item.result === 'victory' ? 'accepted' : 'failed',
      log:
        item.result === 'victory'
          ? `Verified! Full test suite accepted. Gained ${item.ratingChange >= 0 ? `+${item.ratingChange}` : item.ratingChange} LP.`
          : `Match concluded. Rating change: ${item.ratingChange} LP.`
    }
  ];
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    const list: LeaderboardEntry[] = raw ? JSON.parse(raw) : INITIAL_LEADERBOARD_BOTS;
    const user = getStoredUser();

    let foundUser = false;
    const updated = list.map((item) => {
      if (item.isCurrentUser || item.id === user.id) {
        foundUser = true;
        const total = user.battlesWon + user.battlesLost;
        return {
          ...item,
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          avatarBg: user.avatarBg,
          rating: user.rating,
          rankTier: user.rankTier,
          battlesWon: user.battlesWon,
          battlesTotal: total,
          winRate: total > 0 ? Math.round((user.battlesWon / total) * 100) : 0,
          solvedCount: user.problemsSolved.length,
          streak: user.streak,
          isCurrentUser: true
        };
      }
      return { ...item, isCurrentUser: false };
    });

    if (!foundUser) {
      const total = user.battlesWon + user.battlesLost;
      updated.push({
        rank: updated.length + 1,
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        avatarBg: user.avatarBg,
        rating: user.rating,
        rankTier: user.rankTier,
        battlesWon: user.battlesWon,
        battlesTotal: total,
        winRate: total > 0 ? Math.round((user.battlesWon / total) * 100) : 0,
        solvedCount: user.problemsSolved.length,
        streak: user.streak,
        isCurrentUser: true
      });
    }

    updated.sort((a, b) => b.rating - a.rating);
    return updated.map((entry, index) => ({ ...entry, rank: index + 1 }));
  } catch (e) {
    console.error(e);
  }
  return INITIAL_LEADERBOARD_BOTS;
}

export function saveLeaderboard(board: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(board));
  } catch (e) {
    console.error(e);
  }
}

export function calculateElo(userRating: number, opponentRating: number, result: 'victory' | 'defeat' | 'draw'): number {
  const K = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - userRating) / 400));
  const actualScore = result === 'victory' ? 1 : result === 'draw' ? 0.5 : 0;
  return Math.round(K * (actualScore - expectedScore));
}

export function getRankTier(rating: number): User['rankTier'] {
  if (rating >= 2000) return 'Grandmaster';
  if (rating >= 1700) return 'Diamond';
  if (rating >= 1400) return 'Platinum';
  if (rating >= 1200) return 'Gold';
  if (rating >= 1000) return 'Silver';
  return 'Bronze';
}

export function getTodayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDailyMissions(): DailyMission[] {
  const todayKey = getTodayDateKey();
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.DAILY_MISSIONS}_${todayKey}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const targetProblem = PROBLEMS[dayOfYear % PROBLEMS.length] || PROBLEMS[0];

  const generatedMissions: DailyMission[] = [
    {
      id: `mission-algo-${todayKey}`,
      title: `Solve ${targetProblem.title}`,
      description: `Solve today's featured ${targetProblem.difficulty} problem in Practice or Battle mode.`,
      category: 'Practice',
      targetType: 'solve_problem',
      targetProblemId: targetProblem.id,
      targetProblemTitle: targetProblem.title,
      targetCount: 1,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewardLp: 50,
      rewardAchievement: 'Daily Problem Solver',
      iconName: 'Code'
    },
    {
      id: `mission-battle-${todayKey}`,
      title: 'Win a Coding Battle',
      description: 'Win 1 competitive coding battle against any bot or rival today.',
      category: 'Battles',
      targetType: 'win_battle',
      targetCount: 1,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewardLp: 40,
      rewardAchievement: 'Daily Duel Winner',
      iconName: 'Swords'
    },
    {
      id: `mission-polyglot-${todayKey}`,
      title: 'Multi-Language Practice',
      description: 'Execute and pass test cases using a secondary language template.',
      category: 'Languages',
      targetType: 'use_language',
      targetCount: 1,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewardLp: 35,
      rewardAchievement: 'Multi-Language Solver',
      iconName: 'Terminal'
    },
    {
      id: `mission-speed-${todayKey}`,
      title: 'Complete Two Submissions',
      description: 'Complete 2 accepted problem submissions or battle wins today.',
      category: 'Consistency',
      targetType: 'any_submission',
      targetCount: 2,
      currentCount: 0,
      completed: false,
      claimed: false,
      rewardLp: 60,
      rewardAchievement: 'Consistent Solver',
      iconName: 'Zap'
    }
  ];

  try {
    localStorage.setItem(`${STORAGE_KEYS.DAILY_MISSIONS}_${todayKey}`, JSON.stringify(generatedMissions));
  } catch (e) {
    console.error(e);
  }

  return generatedMissions;
}

export function saveDailyMissions(missions: DailyMission[]): void {
  const todayKey = getTodayDateKey();
  try {
    localStorage.setItem(`${STORAGE_KEYS.DAILY_MISSIONS}_${todayKey}`, JSON.stringify(missions));
  } catch (e) {
    console.error(e);
  }
}

export function updateDailyMissionProgress(
  type: DailyMission['targetType'],
  value?: string
): { updatedMissions: DailyMission[]; newlyCompleted: DailyMission[] } {
  const currentMissions = getDailyMissions();
  const newlyCompleted: DailyMission[] = [];

  const updatedMissions = currentMissions.map((m) => {
    if (m.completed) return m;

    let shouldIncrement = false;

    if (m.targetType === type) {
      if (type === 'solve_problem') {
        if (!m.targetProblemId || m.targetProblemId === value) {
          shouldIncrement = true;
        }
      } else if (type === 'use_language') {
        if (value && value !== 'javascript') {
          shouldIncrement = true;
        }
      } else {
        shouldIncrement = true;
      }
    } else if (m.targetType === 'any_submission' && (type === 'solve_problem' || type === 'win_battle')) {
      shouldIncrement = true;
    }

    if (shouldIncrement) {
      const nextCount = Math.min(m.targetCount, m.currentCount + 1);
      const isNowCompleted = nextCount >= m.targetCount;
      if (isNowCompleted && !m.completed) {
        newlyCompleted.push({ ...m, currentCount: nextCount, completed: true });
      }
      return {
        ...m,
        currentCount: nextCount,
        completed: isNowCompleted
      };
    }
    return m;
  });

  saveDailyMissions(updatedMissions);
  return { updatedMissions, newlyCompleted };
}

export function claimDailyMissionReward(missionId: string): { user: User; claimedMission: DailyMission | null } {
  const currentMissions = getDailyMissions();
  let targetMission: DailyMission | null = null;

  const updatedMissions = currentMissions.map((m) => {
    if (m.id === missionId && m.completed && !m.claimed) {
      targetMission = { ...m, claimed: true };
      return targetMission;
    }
    return m;
  });

  saveDailyMissions(updatedMissions);

  const currentUser = getStoredUser();
  if (targetMission) {
    const newRating = currentUser.rating + (targetMission as DailyMission).rewardLp;
    const newTier = getRankTier(newRating);
    const updatedAchievements = [...currentUser.achievements];
    if (
      (targetMission as DailyMission).rewardAchievement &&
      !updatedAchievements.includes((targetMission as DailyMission).rewardAchievement!)
    ) {
      updatedAchievements.push((targetMission as DailyMission).rewardAchievement!);
    }

    const updatedUser: User = {
      ...currentUser,
      rating: newRating,
      rankTier: newTier,
      achievements: updatedAchievements
    };

    saveStoredUser(updatedUser);
    return { user: updatedUser, claimedMission: targetMission };
  }

  return { user: currentUser, claimedMission: null };
}
