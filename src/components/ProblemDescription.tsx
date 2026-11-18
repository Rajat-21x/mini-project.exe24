import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Problem } from '../types';

interface ProblemDescriptionProps {
  problem: Problem;
  isSolved?: boolean;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, isSolved }) => {
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);

  const getDifficultyClass = (diff: Problem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400';
      case 'Medium':
        return 'text-[#E8AE38]';
      case 'Hard':
        return 'text-rose-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#112D43] border border-[#294357] rounded-md overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#294357] bg-[#10283D]">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <div className="flex items-center gap-2 text-xs text-[#B9C2CC]">
            <span className="font-mono text-[#27C5E8]">{problem.problemCode}</span>
            <span aria-hidden="true">·</span>
            <span className={`font-medium ${getDifficultyClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span aria-hidden="true">·</span>
            <span>{problem.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#E8AE38] tabular-nums">{problem.maxScore} pts</span>
          </div>

          {isSolved && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </span>
          )}
        </div>

        <h1 className="font-heading text-xl font-semibold text-[#F1F0EE]">
          {problem.title}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6 text-sm text-[#F1F0EE] leading-relaxed">
        <div className="whitespace-pre-line max-w-[68ch]">
          {problem.description}
        </div>

        {/* Input / Output Formats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#294357] text-xs">
          <div>
            <div className="text-[#B9C2CC] font-medium mb-1">Input format</div>
            <div className="font-mono text-[#F1F0EE]">{problem.inputFormat}</div>
          </div>
          <div>
            <div className="text-[#B9C2CC] font-medium mb-1">Output format</div>
            <div className="font-mono text-[#F1F0EE]">{problem.outputFormat}</div>
          </div>
        </div>

        {/* Sample Cases */}
        <div className="space-y-3 pt-4 border-t border-[#294357]">
          <h2 className="text-xs font-semibold text-[#F1F0EE]">
            Examples
          </h2>
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="p-3.5 bg-[#07121E] border border-[#294357] rounded-md space-y-1.5 font-mono text-xs"
            >
              <div className="text-[#B9C2CC] font-sans font-medium text-xs mb-1">
                Example {i + 1}
              </div>
              <div>
                <span className="text-[#B9C2CC]">Input: </span>
                <span className="text-[#F1F0EE]">{ex.input}</span>
              </div>
              <div>
                <span className="text-[#B9C2CC]">Output: </span>
                <span className="text-[#27C5E8]">{ex.output}</span>
              </div>
              {ex.explanation && (
                <div className="font-sans text-[#B9C2CC] text-xs pt-1.5 border-t border-[#294357]">
                  <span className="font-medium text-[#F1F0EE]">Explanation: </span>
                  {ex.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="space-y-2 pt-4 border-t border-[#294357]">
          <h2 className="text-xs font-semibold text-[#F1F0EE]">
            Constraints
          </h2>
          <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-[#B9C2CC]">
            {problem.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="pt-4 border-t border-[#294357] text-xs text-[#B9C2CC] space-y-1">
          <div className="font-semibold text-[#F1F0EE]">Execution notes</div>
          <p>
            Implement the provided function signature. Use Run Code to verify against sample and hidden test cases, or Submit to record your solution.
          </p>
        </div>

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-[#294357]">
            <h2 className="text-xs font-semibold text-[#F1F0EE]">
              Hints
            </h2>
            <div className="space-y-1.5">
              {problem.hints.map((hint, idx) => {
                const isOpen = openHintIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-[#294357] bg-[#07121E] rounded-md overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenHintIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors text-left"
                    >
                      <span>Hint {idx + 1}</span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-[#B9C2CC]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#B9C2CC]" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 pt-2 text-xs text-[#B9C2CC] font-sans leading-relaxed border-t border-[#294357]">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
