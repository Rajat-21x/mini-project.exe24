import React, { useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import {
  X,
  Download,
  Copy,
  Check,
  Award,
  Clock,
  Code2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { BattleHistoryItem, User } from '../types';

interface ShareResultModalProps {
  battle: BattleHistoryItem | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareResultModal: React.FC<ShareResultModalProps> = ({
  battle,
  currentUser,
  isOpen,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  if (!isOpen || !battle) return null;

  const isVictory = battle.result === 'victory';
  const isDefeat = battle.result === 'defeat';

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        quality: 0.95,
        backgroundColor: '#07121E'
      });

      const link = document.createElement('a');
      link.download = `coding-battle-${battle.problemId}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image with html-to-image, falling back to canvas:', err);
      fallbackCanvasExport();
    } finally {
      setIsExporting(false);
    }
  };

  const fallbackCanvasExport = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#07121E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#112D43';
    ctx.fillRect(36, 36, canvas.width - 72, canvas.height - 72);
    ctx.strokeStyle = '#294357';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    ctx.fillStyle = '#27C5E8';
    ctx.fillRect(36, 36, canvas.width - 72, 4);

    ctx.fillStyle = '#27C5E8';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('Coding Battle Arena · Match Summary', 72, 95);

    ctx.fillStyle = isVictory ? '#34D399' : isDefeat ? '#F87171' : '#E8AE38';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText(isVictory ? 'Match Won' : isDefeat ? 'Match Lost' : 'Draw', 72, 165);

    ctx.fillStyle = '#F1F0EE';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(`${battle.problemTitle} (${battle.difficulty})`, 72, 230);

    ctx.fillStyle = '#B9C2CC';
    ctx.font = '20px monospace';
    ctx.fillText(`Competitor: ${currentUser.displayName} (@${currentUser.username})`, 72, 295);
    ctx.fillText(`Opponent: ${battle.opponentName} (${battle.opponentRating} LP)`, 72, 335);
    ctx.fillText(`Duration: ${formatTime(battle.userTimeSeconds)} · Language: ${battle.languageUsed.toUpperCase()}`, 72, 375);
    ctx.fillText(`Score: ${battle.userScore} vs ${battle.opponentScore}`, 72, 415);

    ctx.fillStyle = battle.ratingChange >= 0 ? '#E8AE38' : '#F87171';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(
      `Rating Change: ${battle.ratingChange >= 0 ? `+${battle.ratingChange}` : battle.ratingChange} LP (Current: ${currentUser.rating} LP)`,
      72,
      495
    );

    ctx.fillStyle = '#B9C2CC';
    ctx.font = '18px monospace';
    ctx.fillText(`Match #${battle.id.slice(-6)} · Coding Battle Arena`, 72, 600);

    const link = document.createElement('a');
    link.download = `coding-battle-${battle.problemId}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: '#07121E'
      });
      if (blob && navigator.clipboard && (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      }
    } catch (e) {
      console.warn('Clipboard image write failed:', e);
      handleCopyText();
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    const text = `Coding Battle Arena Match Result
Problem: ${battle.problemTitle} (${battle.difficulty})
Result: ${battle.result === 'victory' ? 'Won' : battle.result === 'defeat' ? 'Lost' : 'Draw'} (${battle.ratingChange >= 0 ? `+${battle.ratingChange}` : battle.ratingChange} LP)
Matchup: ${currentUser.displayName} vs ${battle.opponentName}
Duration: ${formatTime(battle.userTimeSeconds)} · Score: ${battle.userScore} pts
Language: ${battle.languageUsed.toUpperCase()}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const opponentInitials = battle.opponentName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('') || 'OP';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#07121E]/85">
      <div className="max-w-2xl w-full bg-[#112D43] border border-[#294357] rounded-md shadow-xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#10283D] border-b border-[#294357] flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-[#F1F0EE]">
              Match summary card
            </h2>
            <span className="text-xs text-[#B9C2CC]">
              Save or copy an image summary of this match.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#B9C2CC] hover:text-[#F1F0EE] rounded transition-colors"
            aria-label="Close share modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Card Preview */}
        <div className="p-6 overflow-y-auto bg-[#07121E]/80 flex-1">
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-md bg-[#07121E] border border-[#294357] border-t-2 border-t-[#27C5E8] p-6 sm:p-7 text-[#F1F0EE] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#294357] pb-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-[#27C5E8]" />
                <div>
                  <span className="text-sm font-heading font-semibold text-[#F1F0EE] block">
                    Coding Battle Arena
                  </span>
                  <span className="text-[11px] text-[#B9C2CC] block font-mono">
                    1v1 Match Performance Summary
                  </span>
                </div>
              </div>

              <div
                className={`px-2.5 py-1 rounded border text-xs font-mono font-medium flex items-center gap-1.5 ${
                  isVictory
                    ? 'bg-[#10283D] border-emerald-500/40 text-emerald-400'
                    : isDefeat
                    ? 'bg-[#10283D] border-rose-500/40 text-rose-400'
                    : 'bg-[#10283D] border-[#294357] text-[#E8AE38]'
                }`}
              >
                {isVictory && <Award className="w-3.5 h-3.5" />}
                <span>{battle.result === 'victory' ? 'Won' : battle.result === 'defeat' ? 'Lost' : 'Draw'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-md bg-[#112D43] border border-[#294357]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded ${currentUser.avatarBg} flex items-center justify-center text-xs font-mono font-semibold shrink-0`}
                >
                  {currentUser.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-[#27C5E8] font-mono">Competitor</div>
                  <div className="font-medium text-sm text-[#F1F0EE] truncate">
                    {currentUser.displayName}
                  </div>
                  <div className="text-xs font-mono text-[#B9C2CC] tabular-nums">
                    <span className="text-[#E8AE38] font-semibold">{currentUser.rating} LP</span> · {currentUser.rankTier}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 text-right">
                <div className="min-w-0">
                  <div className="text-[11px] text-[#B9C2CC] font-mono">Opponent</div>
                  <div className="font-medium text-sm text-[#F1F0EE] truncate">
                    {battle.opponentName}
                  </div>
                  <div className="text-xs font-mono text-[#B9C2CC] tabular-nums">
                    {battle.opponentRating} LP
                  </div>
                </div>
                <div className="w-10 h-10 rounded bg-[#10283D] border border-[#294357] flex items-center justify-center text-xs font-mono font-semibold text-[#B9C2CC] shrink-0">
                  {opponentInitials}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading text-lg font-semibold text-[#F1F0EE]">
                    {battle.problemTitle}
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      battle.difficulty === 'Easy'
                        ? 'text-emerald-400'
                        : battle.difficulty === 'Medium'
                        ? 'text-[#E8AE38]'
                        : 'text-rose-400'
                    }`}
                  >
                    · {battle.difficulty}
                  </span>
                  <span className="text-xs font-mono text-[#B9C2CC] uppercase">
                    · {battle.languageUsed}
                  </span>
                </div>
              </div>

              <div className="rounded-md bg-[#10283D] border border-[#294357] grid grid-cols-3 divide-x divide-[#294357]">
                <div className="p-3">
                  <div className="text-[11px] text-[#B9C2CC]">Duration</div>
                  <div className="text-sm font-semibold text-[#F1F0EE] font-mono tabular-nums flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#27C5E8]" />
                    <span>{formatTime(battle.userTimeSeconds)}</span>
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[11px] text-[#B9C2CC]">Score</div>
                  <div className="text-sm font-semibold text-[#E8AE38] font-mono tabular-nums mt-0.5">
                    {battle.userScore} pts
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[11px] text-[#B9C2CC]">Rating change</div>
                  <div className="text-sm font-semibold font-mono tabular-nums mt-0.5 flex items-center gap-0.5">
                    {battle.ratingChange >= 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={battle.ratingChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {battle.ratingChange >= 0 ? `+${battle.ratingChange}` : battle.ratingChange} LP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#294357] flex items-center justify-between text-[11px] text-[#B9C2CC] font-mono">
              <span>Match #{battle.id.slice(-6)}</span>
              <span>{new Date(battle.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#10283D] border-t border-[#294357] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] text-xs font-medium transition-colors"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied text</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#27C5E8]" />
                  <span>Copy summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] text-xs font-medium transition-colors disabled:opacity-50"
            >
              {copiedImage ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied image</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#27C5E8]" />
                  <span>Copy image</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] font-medium text-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Saving PNG...' : 'Save as PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
