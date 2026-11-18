import React, { useState } from 'react';
import { Swords, Bot, Users, Clock, Shield, Plus, Trophy } from 'lucide-react';
import { AvailableBattle, BattleMode, BotTier, Difficulty, Problem, User } from '../types';
import { BOT_PROFILES } from '../services/battleEngine';
import { PROBLEMS } from '../data/problems';
import { createAvailableBattle, getAvailableBattles } from '../services/storage';

interface BattleLobbyProps {
  currentUser: User;
  onStartBattle: (config: {
    mode: BattleMode;
    botTier?: BotTier;
    durationMinutes: number;
    problem: Problem;
    roomCode?: string;
  }) => void;
}

export const BattleLobby: React.FC<BattleLobbyProps> = ({ currentUser, onStartBattle }) => {
  const [selectedMode, setSelectedMode] = useState<BattleMode>('bot');
  const [selectedBotTier, setSelectedBotTier] = useState<BotTier>('Skilled');
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'Random'>('Random');
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  const [generatedRoomCode, setGeneratedRoomCode] = useState<string>(
    'ROOM-' + Math.floor(1000 + Math.random() * 9000)
  );
  const [availableBattles, setAvailableBattles] = useState<AvailableBattle[]>(() => getAvailableBattles());
  const [createdNotice, setCreatedNotice] = useState<string | null>(null);

  const pickProblem = (diff: Difficulty | 'Random'): Problem => {
    let pool = PROBLEMS;
    if (diff !== 'Random') {
      pool = PROBLEMS.filter((p) => p.difficulty === diff);
    }
    return pool[Math.floor(Math.random() * pool.length)] || PROBLEMS[0];
  };

  const handleLaunch = () => {
    const chosenProblem = pickProblem(selectedDifficulty);
    onStartBattle({
      mode: selectedMode,
      botTier: selectedMode === 'bot' ? selectedBotTier : undefined,
      durationMinutes: selectedDuration,
      problem: chosenProblem,
      roomCode: selectedMode === 'room' ? roomCodeInput.trim() || generatedRoomCode : undefined
    });
  };

  const handleCreateBattleRoom = () => {
    const chosenProblem = pickProblem(selectedDifficulty);
    const newCode = 'ROOM-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedRoomCode(newCode);
    const updated = createAvailableBattle({
      roomCode: newCode,
      hostName: currentUser.displayName,
      hostRating: currentUser.rating,
      problemId: chosenProblem.id,
      problemTitle: chosenProblem.title,
      difficulty: chosenProblem.difficulty,
      durationMinutes: selectedDuration
    });
    setAvailableBattles(updated);
    setCreatedNotice(`Room ${newCode} created for ${chosenProblem.title}.`);
    setTimeout(() => setCreatedNotice(null), 3500);
  };

  const handleJoinAvailable = (battle: AvailableBattle) => {
    const prob = PROBLEMS.find((p) => p.id === battle.problemId) || PROBLEMS[0];
    onStartBattle({
      mode: 'room',
      durationMinutes: battle.durationMinutes,
      problem: prob,
      roomCode: battle.roomCode
    });
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    const match = availableBattles.find(
      (b) => b.roomCode.toLowerCase() === roomCodeInput.trim().toLowerCase()
    );
    const prob = match ? PROBLEMS.find((p) => p.id === match.problemId) || PROBLEMS[0] : pickProblem(selectedDifficulty);
    onStartBattle({
      mode: 'room',
      durationMinutes: match ? match.durationMinutes : selectedDuration,
      problem: prob,
      roomCode: roomCodeInput.trim().toUpperCase()
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#294357] pb-5">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F1F0EE]">
            Coding Battles
          </h1>
          <p className="text-sm text-[#B9C2CC]">
            Compete with other developers and improve your problem-solving skills.
          </p>
        </div>

        <div className="text-xs text-[#B9C2CC] font-mono tabular-nums">
          <span>{currentUser.displayName}</span>
          <span className="mx-2">·</span>
          <span className="text-[#E8AE38] font-semibold">{currentUser.rating} LP</span>
          <span className="mx-2">·</span>
          <span>{currentUser.rankTier}</span>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setSelectedMode('bot')}
          className={`p-4 rounded-md border text-left transition-colors ${
            selectedMode === 'bot'
              ? 'bg-[#10283D] border-[#27C5E8]'
              : 'bg-[#112D43] border-[#294357] hover:border-[#39BDE0]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Bot className="w-4 h-4 text-[#27C5E8]" />
            {selectedMode === 'bot' && (
              <span className="text-xs font-medium text-[#27C5E8]">Selected</span>
            )}
          </div>
          <h2 className="text-sm font-semibold text-[#F1F0EE]">Practice Bot Duel</h2>
          <p className="text-xs text-[#B9C2CC] mt-1 leading-relaxed">
            Timed 1v1 match against a local algorithmic opponent scaled to your chosen tier.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('ranked')}
          className={`p-4 rounded-md border text-left transition-colors ${
            selectedMode === 'ranked'
              ? 'bg-[#10283D] border-[#27C5E8]'
              : 'bg-[#112D43] border-[#294357] hover:border-[#39BDE0]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-4 h-4 text-[#E8AE38]" />
            {selectedMode === 'ranked' && (
              <span className="text-xs font-medium text-[#27C5E8]">Selected</span>
            )}
          </div>
          <h2 className="text-sm font-semibold text-[#F1F0EE]">Ranked Queue</h2>
          <p className="text-xs text-[#B9C2CC] mt-1 leading-relaxed">
            Elo-rated head-to-head match contributing to your global leaderboard standing.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('room')}
          className={`p-4 rounded-md border text-left transition-colors ${
            selectedMode === 'room'
              ? 'bg-[#10283D] border-[#27C5E8]'
              : 'bg-[#112D43] border-[#294357] hover:border-[#39BDE0]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-[#27C5E8]" />
            {selectedMode === 'room' && (
              <span className="text-xs font-medium text-[#27C5E8]">Selected</span>
            )}
          </div>
          <h2 className="text-sm font-semibold text-[#F1F0EE]">Custom Battle Room</h2>
          <p className="text-xs text-[#B9C2CC] mt-1 leading-relaxed">
            Create a room code or join an open challenge from the available lobbies list.
          </p>
        </button>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 cols: Match Setup & Join by Code */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-md bg-[#112D43] border border-[#294357] p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#294357] pb-3">
              <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
                Match configuration
              </h2>
              <span className="text-xs font-mono text-[#B9C2CC]">
                Local match simulation (Socket.io server not configured)
              </span>
            </div>

            {selectedMode === 'bot' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#B9C2CC] block">
                  Bot difficulty tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(['Novice', 'Skilled', 'Grandmaster'] as BotTier[]).map((tier) => {
                    const profile = BOT_PROFILES[tier];
                    const isSelected = selectedBotTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setSelectedBotTier(tier)}
                        className={`p-3 rounded-md border text-left flex items-center gap-3 transition-colors ${
                          isSelected
                            ? 'bg-[#10283D] border-[#27C5E8]'
                            : 'bg-[#07121E] border-[#294357] hover:border-[#39BDE0]/60'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded ${profile.avatarBg} flex items-center justify-center text-xs font-mono font-semibold shrink-0`}>
                          {profile.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#F1F0EE]">
                            {tier === 'Skilled' ? 'Intermediate' : tier === 'Grandmaster' ? 'Advanced' : tier}
                          </div>
                          <div className="text-[11px] text-[#B9C2CC] font-mono tabular-nums">
                            {profile.rating} LP
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#B9C2CC] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E8AE38]" />
                  <span>Time limit</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { min: 5, label: '5 min' },
                    { min: 10, label: '10 min' },
                    { min: 15, label: '15 min' }
                  ].map((opt) => (
                    <button
                      key={opt.min}
                      type="button"
                      onClick={() => setSelectedDuration(opt.min)}
                      className={`py-2 px-3 rounded-md border text-xs font-medium transition-colors ${
                        selectedDuration === opt.min
                          ? 'bg-[#27C5E8] border-[#27C5E8] text-[#07121E]'
                          : 'bg-[#07121E] border-[#294357] text-[#B9C2CC] hover:text-[#F1F0EE]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-[#B9C2CC] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#27C5E8]" />
                  <span>Problem difficulty</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Random', 'Easy', 'Medium', 'Hard'] as (Difficulty | 'Random')[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-2 px-2 rounded-md border text-xs font-medium text-center transition-colors ${
                        selectedDifficulty === diff
                          ? 'bg-[#27C5E8] border-[#27C5E8] text-[#07121E]'
                          : 'bg-[#07121E] border-[#294357] text-[#B9C2CC] hover:text-[#F1F0EE]'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#294357] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCreateBattleRoom}
                className="px-4 py-2 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#27C5E8]" />
                <span>Create lobby</span>
              </button>

              <button
                type="button"
                onClick={handleLaunch}
                className="px-5 py-2 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] font-medium text-xs transition-colors flex items-center gap-2"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Start battle</span>
              </button>
            </div>

            {createdNotice && (
              <div className="p-3 rounded-md bg-[#10283D] border border-[#27C5E8]/50 text-xs text-[#27C5E8]">
                {createdNotice} It is now listed under open lobbies.
              </div>
            )}
          </div>

          <form
            onSubmit={handleJoinByCode}
            className="rounded-md bg-[#112D43] border border-[#294357] p-5 space-y-3"
          >
            <h2 className="text-sm font-semibold text-[#F1F0EE]">
              Join by room code
            </h2>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                placeholder={`Enter room code (e.g. ${generatedRoomCode})`}
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                className="flex-1 bg-[#07121E] border border-[#294357] rounded-md px-3 py-2 text-xs font-mono text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8] uppercase"
              />
              <button
                type="submit"
                disabled={!roomCodeInput.trim()}
                className="px-4 py-2 rounded-md border border-[#294357] bg-[#10283D] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors disabled:opacity-50"
              >
                Join room
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 cols: Available Lobbies & Rules */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-md bg-[#112D43] border border-[#294357] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#10283D] border-b border-[#294357] flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
                Open lobbies
              </h2>
              <span className="text-xs font-mono text-[#B9C2CC] tabular-nums">
                {availableBattles.length} open
              </span>
            </div>

            <div className="divide-y divide-[#294357]">
              {availableBattles.map((battle) => (
                <div key={battle.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#F1F0EE] truncate">
                      {battle.problemTitle}
                    </div>
                    <div className="text-xs text-[#B9C2CC] font-mono tabular-nums mt-0.5">
                      <span className="text-[#27C5E8]">{battle.roomCode}</span> · {battle.hostName} ({battle.hostRating} LP) · {battle.durationMinutes}m
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleJoinAvailable(battle)}
                    className="px-3 py-1 rounded border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors shrink-0"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md bg-[#112D43] border border-[#294357] p-5 space-y-2.5">
            <h2 className="font-heading text-base font-semibold text-[#F1F0EE]">
              Match rules
            </h2>
            <ul className="space-y-1.5 text-xs text-[#B9C2CC] list-disc pl-4 leading-relaxed">
              <li>Both competitors receive the same problem statement and test suite.</li>
              <li>A countdown timer tracks the match; faster accepted submissions earn higher speed scores.</li>
              <li>Passing all test cases and clicking Submit wins the match immediately.</li>
              <li>If time expires, the competitor with more passing test cases wins.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
