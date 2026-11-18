import { BotTier, Opponent } from '../types';

export const BOT_PROFILES: Record<
  BotTier,
  {
    name: string;
    avatar: string;
    avatarBg: string;
    rating: number;
    tier: string;
    minTimeSec: number;
    maxTimeSec: number;
    errorChance: number;
  }
> = {
  Novice: {
    name: 'Practice Bot (Novice)',
    avatar: 'NB',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#B9C2CC]',
    rating: 1050,
    tier: 'Bronze',
    minTimeSec: 180,
    maxTimeSec: 260,
    errorChance: 0.35
  },
  Skilled: {
    name: 'Practice Bot (Intermediate)',
    avatar: 'IB',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#27C5E8]',
    rating: 1540,
    tier: 'Platinum',
    minTimeSec: 100,
    maxTimeSec: 170,
    errorChance: 0.15
  },
  Grandmaster: {
    name: 'Practice Bot (Advanced)',
    avatar: 'AB',
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#E8AE38]',
    rating: 2150,
    tier: 'Grandmaster',
    minTimeSec: 55,
    maxTimeSec: 90,
    errorChance: 0.05
  }
};

export function createOpponent(tier: BotTier, totalTestCases: number): Opponent {
  const profile = BOT_PROFILES[tier];
  return {
    id: 'bot-' + Date.now(),
    name: profile.name,
    avatar: profile.avatar,
    avatarBg: profile.avatarBg,
    rating: profile.rating + Math.floor(Math.random() * 40 - 20),
    tier: profile.tier,
    isBot: true,
    botDifficulty: tier,
    testsPassed: 0,
    totalTests: totalTestCases,
    status: 'thinking',
    codeLength: 0,
    progressPercent: 5
  };
}

export function createHumanOpponent(name: string, rating: number, tier: string, totalTests: number): Opponent {
  const initials =
    name
      .replace(/\(.*?\)/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || 'P')
      .join('') || 'P2';

  return {
    id: 'human-' + Date.now(),
    name,
    avatar: initials,
    avatarBg: 'bg-[#10283D] border border-[#294357] text-[#E8AE38]',
    rating,
    tier,
    isBot: false,
    testsPassed: 0,
    totalTests,
    status: 'thinking',
    codeLength: 0,
    progressPercent: 0
  };
}
