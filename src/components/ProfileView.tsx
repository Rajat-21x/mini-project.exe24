import React, { useState } from 'react';
import { Award, CheckCircle2, Calendar, Save, Swords } from 'lucide-react';
import { BattleHistoryItem, Language, LeaderboardEntry, User } from '../types';
import { UserProgressChart } from './UserProgressChart';

interface ProfileViewProps {
  currentUser: User;
  battleHistory: BattleHistoryItem[];
  leaderboard: LeaderboardEntry[];
  onSaveUser: (updatedUser: User) => void;
  onOpenAuth: () => void;
}

const AVATAR_CHOICES = ['DK', 'AC', 'CD', 'JS', 'PY', 'AX'];
const AVATAR_STYLES = [
  'bg-[#10283D] border border-[#27C5E8]/60 text-[#27C5E8]',
  'bg-[#10283D] border border-[#E8AE38]/60 text-[#E8AE38]',
  'bg-[#10283D] border border-[#39BDE0]/60 text-[#F1F0EE]',
  'bg-[#07121E] border border-[#294357] text-[#27C5E8]'
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  battleHistory,
  leaderboard,
  onSaveUser,
  onOpenAuth
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(currentUser.preferredLanguage);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarBg, setAvatarBg] = useState(currentUser.avatarBg);
  const [savedToast, setSavedToast] = useState(false);

  const totalBattles = currentUser.battlesWon + currentUser.battlesLost;
  const winRate = totalBattles > 0 ? Math.round((currentUser.battlesWon / totalBattles) * 100) : 0;
  const rankEntry = leaderboard.find((e) => e.isCurrentUser || e.id === currentUser.id);
  const globalRank = rankEntry ? rankEntry.rank : leaderboard.length + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...currentUser,
      displayName: displayName.trim() || currentUser.displayName,
      bio: bio.trim(),
      preferredLanguage,
      avatar,
      avatarBg
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#294357] pb-5">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F1F0EE]">
            Profile
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#B9C2CC] font-mono mt-1">
            <span>@{currentUser.username}</span>
            <span aria-hidden="true">·</span>
            <span>ID: {currentUser.id}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#27C5E8]" />
              Joined {currentUser.createdAt}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAuth}
          className="px-4 py-2 rounded-md border border-[#294357] bg-[#10283D] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors self-start sm:self-auto"
        >
          Switch account
        </button>
      </div>

      {/* GitHub-inspired 2-column Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Identity, Structured Stats, Achievements */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-md bg-[#112D43] border border-[#294357] p-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className={`w-14 h-14 rounded-md ${currentUser.avatarBg} flex items-center justify-center text-lg font-semibold font-mono shrink-0`}>
                {currentUser.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-base font-semibold text-[#F1F0EE] truncate">{currentUser.displayName}</div>
                <div className="text-xs text-[#27C5E8] font-mono">{currentUser.rankTier} division</div>
                <p className="text-xs text-[#B9C2CC] mt-1 line-clamp-2">{currentUser.bio}</p>
              </div>
            </div>

            {/* Clean Tabular Key-Value Stats */}
            <dl className="divide-y divide-[#294357] border-t border-[#294357] text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#B9C2CC]">Total score</dt>
                <dd className="font-mono font-semibold text-[#E8AE38] tabular-nums">{currentUser.rating} LP</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#B9C2CC]">Global rank</dt>
                <dd className="font-mono font-semibold text-[#27C5E8] tabular-nums">#{globalRank}</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#B9C2CC]">Problems solved</dt>
                <dd className="font-mono font-semibold text-[#F1F0EE] tabular-nums">{currentUser.problemsSolved.length}</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#B9C2CC]">Total battles</dt>
                <dd className="font-mono font-semibold text-[#F1F0EE] tabular-nums">{totalBattles}</dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#B9C2CC]">Wins / losses</dt>
                <dd className="font-mono font-semibold tabular-nums">
                  <span className="text-emerald-400">{currentUser.battlesWon}W</span>
                  <span className="text-[#B9C2CC] mx-1">/</span>
                  <span className="text-rose-400">{currentUser.battlesLost}L</span>
                </dd>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <dt className="text-[#B9C2CC]">Win rate</dt>
                <dd className="font-mono font-semibold text-[#27C5E8] tabular-nums">{winRate}%</dd>
              </div>
            </dl>

            {/* Achievements */}
            <div className="pt-4 border-t border-[#294357] space-y-2.5">
              <div className="text-xs font-semibold text-[#F1F0EE]">
                Achievements
              </div>
              <ul className="space-y-1.5">
                {currentUser.achievements.map((ach, idx) => (
                  <li key={idx} className="text-xs text-[#B9C2CC] flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#E8AE38] shrink-0" />
                    <span className="text-[#F1F0EE]">{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-md bg-[#112D43] border border-[#294357] p-5 space-y-3">
            <h2 className="font-heading text-base font-semibold text-[#F1F0EE] border-b border-[#294357] pb-2.5">
              Recent activity
            </h2>
            {battleHistory.length > 0 ? (
              <div className="divide-y divide-[#294357]">
                {battleHistory.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <Swords className="w-3.5 h-3.5 text-[#27C5E8] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#F1F0EE] truncate">
                          {b.result === 'victory' ? 'Won' : b.result === 'defeat' ? 'Lost' : 'Draw'} · {b.problemTitle}
                        </div>
                        <div className="text-[11px] text-[#B9C2CC] font-mono truncate">
                          vs {b.opponentName} · {new Date(b.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className={`font-mono text-xs font-medium tabular-nums shrink-0 ${b.ratingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {b.ratingChange >= 0 ? `+${b.ratingChange}` : b.ratingChange}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#B9C2CC]">
                No recent battle activity recorded.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Progress Chart & Edit Profile Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-md bg-[#112D43] border border-[#294357] p-5">
            <UserProgressChart user={currentUser} battleHistory={battleHistory} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-md bg-[#112D43] border border-[#294357] p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#294357] pb-3">
              <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
                Profile settings
              </h2>
              {savedToast && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Saved
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#B9C2CC]">Monogram and frame</label>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_CHOICES.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setAvatar(ch)}
                    className={`w-8 h-8 rounded font-mono text-xs font-semibold border transition-colors ${
                      avatar === ch
                        ? 'bg-[#27C5E8] text-[#07121E] border-[#27C5E8]'
                        : 'bg-[#07121E] text-[#F1F0EE] border-[#294357] hover:border-[#27C5E8]'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
                <span className="text-[#294357] mx-1">|</span>
                {AVATAR_STYLES.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarBg(st)}
                    className={`w-8 h-8 rounded ${st} flex items-center justify-center text-xs font-mono font-semibold ${
                      avatarBg === st ? 'ring-2 ring-[#27C5E8]' : ''
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-display-name" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                  Display name
                </label>
                <input
                  id="profile-display-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] focus:outline-none focus:border-[#27C5E8]"
                />
              </div>

              <div>
                <label htmlFor="profile-language" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                  Preferred language
                </label>
                <select
                  id="profile-language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] focus:outline-none focus:border-[#27C5E8] cursor-pointer"
                >
                  <option value="javascript">JavaScript (Browser Engine)</option>
                  <option value="python">Python 3 (Local Sandbox)</option>
                  <option value="cpp">C++ (Requires Judge0)</option>
                  <option value="java">Java (Requires Judge0)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="profile-bio" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                Bio
              </label>
              <input
                id="profile-bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] focus:outline-none focus:border-[#27C5E8]"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save changes</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
