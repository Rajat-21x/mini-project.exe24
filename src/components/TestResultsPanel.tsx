import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, Cpu, Play, Terminal } from 'lucide-react';
import { Problem, SubmissionResult } from '../types';

interface TestResultsPanelProps {
  problem: Problem;
  result: SubmissionResult | null;
  isRunning: boolean;
  onRunCustomInput: (customInput: string) => void;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  problem,
  result,
  isRunning,
  onRunCustomInput
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'custom'>('tests');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [customInputValue, setCustomInputValue] = useState<string>(
    problem.testCases[0]?.params ? JSON.stringify(problem.testCases[0].params) : ''
  );

  return (
    <div className="flex flex-col h-full bg-[#112D43] border border-[#294357] rounded-md overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-[#294357] bg-[#10283D] px-3.5 py-2 text-xs">
        <div className="flex items-center gap-1 p-0.5 bg-[#07121E] border border-[#294357] rounded">
          <button
            type="button"
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeTab === 'tests'
                ? 'bg-[#10283D] text-[#27C5E8]'
                : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
            }`}
          >
            Test cases ({problem.testCases.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 font-medium rounded transition-colors ${
              activeTab === 'custom'
                ? 'bg-[#10283D] text-[#27C5E8]'
                : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
            }`}
          >
            Custom input
          </button>
        </div>

        {result && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-[#B9C2CC]">
              <Clock className="w-3.5 h-3.5 text-[#27C5E8]" />
              <span className="tabular-nums">{result.runtimeMs}ms</span>
            </span>
            {result.memoryMb > 0 && (
              <span className="flex items-center gap-1 text-[#B9C2CC]">
                <Cpu className="w-3.5 h-3.5 text-[#27C5E8]" />
                <span className="tabular-nums">{result.memoryMb}MB</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Console Body */}
      <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs text-[#F1F0EE] space-y-3 bg-[#07121E]">
        {isRunning && (
          <div className="flex items-center justify-center py-8 gap-2 text-[#B9C2CC] font-sans">
            <div className="w-4 h-4 border-2 border-[#27C5E8] border-t-transparent rounded-full animate-spin" />
            <span>Evaluating test cases...</span>
          </div>
        )}

        {!isRunning && activeTab === 'tests' && (
          <>
            {result ? (
              <div
                className={`p-3 rounded-md border flex flex-wrap items-center justify-between gap-2 ${
                  result.status === 'Accepted'
                    ? 'bg-[#10283D] border-emerald-500/40 text-emerald-300'
                    : 'bg-[#10283D] border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.status === 'Accepted' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-sm">{result.status}</span>
                    <span className="text-[#B9C2CC] text-xs ml-2 tabular-nums">
                      ({result.totalPassed}/{result.totalTests} passed)
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-sans text-[#B9C2CC]">
                  {result.engineNote}
                </div>
              </div>
            ) : (
              <div className="text-[#B9C2CC] py-2 font-sans text-xs">
                Run or submit your code to view test case output and execution timing.
              </div>
            )}

            {/* Case Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {problem.testCases.map((tc, idx) => {
                const caseResult = result?.testResults.find((r) => r.testCaseId === tc.id);
                const isSelected = selectedCaseIndex === idx;

                return (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => setSelectedCaseIndex(idx)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#10283D] border-[#27C5E8] text-[#27C5E8]'
                        : 'bg-[#112D43]/40 border-[#294357] text-[#B9C2CC] hover:text-[#F1F0EE]'
                    }`}
                  >
                    {caseResult && (
                      caseResult.passed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-400" />
                      )
                    )}
                    <span>{tc.isHidden ? `Hidden ${idx + 1}` : `Case ${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>

            {problem.testCases[selectedCaseIndex] && (
              <div className="space-y-2.5">
                {(() => {
                  const currentCase = problem.testCases[selectedCaseIndex];
                  const currentResult = result?.testResults.find((r) => r.testCaseId === currentCase.id);

                  return (
                    <div className="space-y-2">
                      <div>
                        <div className="text-[11px] font-sans text-[#B9C2CC] mb-1">Input</div>
                        <div className="p-2.5 bg-[#10283D] border border-[#294357] rounded text-[#F1F0EE] overflow-x-auto whitespace-pre">
                          {currentCase.input}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] font-sans text-[#B9C2CC] mb-1">Expected</div>
                          <div className="p-2.5 bg-[#10283D] border border-[#294357] rounded text-emerald-400 overflow-x-auto whitespace-pre">
                            {currentCase.expected}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-sans text-[#B9C2CC] mb-1">Output</div>
                          <div
                            className={`p-2.5 bg-[#10283D] border rounded overflow-x-auto whitespace-pre ${
                              currentResult
                                ? currentResult.passed
                                  ? 'border-emerald-500/40 text-emerald-300'
                                  : 'border-rose-500/40 text-rose-300'
                                : 'border-[#294357] text-[#B9C2CC]'
                            }`}
                          >
                            {currentResult ? currentResult.actual : 'Not run'}
                          </div>
                        </div>
                      </div>

                      {currentResult?.stdout && (
                        <div>
                          <div className="text-[11px] font-sans text-[#B9C2CC] mb-1 flex items-center gap-1">
                            <Terminal className="w-3 h-3 text-[#27C5E8]" />
                            <span>Console output</span>
                          </div>
                          <div className="p-2.5 bg-[#10283D] border border-[#294357] rounded text-[#F1F0EE] overflow-x-auto whitespace-pre">
                            {currentResult.stdout}
                          </div>
                        </div>
                      )}

                      {currentResult?.error && (
                        <div className="p-3 bg-[#10283D] border border-rose-500/40 rounded text-rose-300 space-y-1">
                          <div className="font-semibold flex items-center gap-1.5 font-sans">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Execution note</span>
                          </div>
                          <div className="text-xs font-mono text-rose-200 whitespace-pre-wrap">
                            {currentResult.error}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {!isRunning && activeTab === 'custom' && (
          <div className="space-y-3">
            <div className="text-[#B9C2CC] text-xs font-sans">
              Enter input arguments as a JSON array matching the function parameters:
            </div>
            <textarea
              value={customInputValue}
              onChange={(e) => setCustomInputValue(e.target.value)}
              placeholder="e.g. [[2, 7, 11, 15], 9]"
              className="w-full h-24 p-2.5 font-mono text-xs bg-[#10283D] border border-[#294357] rounded text-[#F1F0EE] focus:outline-none focus:border-[#27C5E8]"
            />
            <button
              type="button"
              onClick={() => onRunCustomInput(customInputValue)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] rounded text-xs font-medium transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run custom input</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
