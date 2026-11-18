import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Difficulty, Language, Problem, SubmissionResult, User } from '../types';
import { PROBLEMS } from '../data/problems';
import { ProblemDescription } from './ProblemDescription';
import { CodeEditor } from './CodeEditor';
import { TestResultsPanel } from './TestResultsPanel';
import { executeCode } from '../services/codeRunner';
import { markProblemAttempted } from '../services/storage';

type ProblemFilter = 'All' | Difficulty | 'Solved' | 'Unsolved';

interface PracticeArenaProps {
  currentUser: User;
  onProblemSolved: (problemId: string) => void;
  dailyMissionProblemId?: string;
  initialProblemId?: string;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  currentUser,
  onProblemSolved,
  dailyMissionProblemId,
  initialProblemId
}) => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(() => {
    if (initialProblemId) {
      return PROBLEMS.find((p) => p.id === initialProblemId) || null;
    }
    return null;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ProblemFilter>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentUser.preferredLanguage || 'javascript');
  const [code, setCode] = useState<string>(() => {
    if (initialProblemId) {
      const p = PROBLEMS.find((item) => item.id === initialProblemId);
      if (p) return p.starterCode[currentUser.preferredLanguage || 'javascript'] || p.starterCode.javascript;
    }
    return '';
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<SubmissionResult | null>(null);
  const [mobilePane, setMobilePane] = useState<'problem' | 'editor'>('editor');

  useEffect(() => {
    if (initialProblemId) {
      const p = PROBLEMS.find((item) => item.id === initialProblemId);
      if (p) {
        setSelectedProblem(p);
        setCode(p.starterCode[selectedLanguage] || p.starterCode.javascript);
        setTestResult(null);
      }
    }
  }, [initialProblemId]);

  const filteredProblems = PROBLEMS.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.problemCode.toLowerCase().includes(q);
    const isSolved = currentUser.problemsSolved.includes(p.id);

    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Solved') return isSolved;
    if (activeFilter === 'Unsolved') return !isSolved;
    return p.difficulty === activeFilter;
  });

  const handleSelectProblem = (p: Problem) => {
    setSelectedProblem(p);
    setCode(p.starterCode[selectedLanguage] || p.starterCode.javascript);
    setTestResult(null);
    markProblemAttempted(p.id);
  };

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[lang] || '');
    }
  };

  const handleResetCode = () => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[selectedLanguage] || '');
    }
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    setIsRunning(true);
    markProblemAttempted(selectedProblem.id);
    try {
      const res = await executeCode(selectedProblem, code, selectedLanguage);
      setTestResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    setIsSubmitting(true);
    markProblemAttempted(selectedProblem.id);
    try {
      const res = await executeCode(selectedProblem, code, selectedLanguage);
      setTestResult(res);
      if (res.status === 'Accepted' && res.totalPassed === selectedProblem.testCases.length) {
        onProblemSolved(selectedProblem.id);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCustomInput = async (customStr: string) => {
    if (!selectedProblem) return;
    setIsRunning(true);
    try {
      let parsed = [];
      try {
        parsed = JSON.parse(customStr);
        if (!Array.isArray(parsed)) parsed = [parsed];
      } catch {
        parsed = [customStr];
      }
      const res = await executeCode(selectedProblem, code, selectedLanguage, parsed);
      setTestResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  if (selectedProblem) {
    return (
      <div className="flex flex-col h-[calc(100vh-57px)] bg-[#07121E] overflow-hidden">
        {/* Practice Workspace Top Bar */}
        <div className="bg-[#10283D] border-b border-[#294357] px-4 py-2 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSelectedProblem(null)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] bg-[#07121E] rounded border border-[#294357] hover:border-[#27C5E8] transition-colors shrink-0"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Problem list</span>
            </button>
            <div className="text-sm font-medium text-[#F1F0EE] flex items-center gap-2 truncate">
              <span className="font-mono text-xs text-[#B9C2CC]">{selectedProblem.problemCode}</span>
              <span className="truncate">{selectedProblem.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex lg:hidden items-center gap-1 p-0.5 bg-[#07121E] border border-[#294357] rounded text-xs">
              <button
                type="button"
                onClick={() => setMobilePane('problem')}
                className={`px-2.5 py-1 rounded ${
                  mobilePane === 'problem' ? 'bg-[#10283D] text-[#27C5E8] font-medium' : 'text-[#B9C2CC]'
                }`}
              >
                Problem
              </button>
              <button
                type="button"
                onClick={() => setMobilePane('editor')}
                className={`px-2.5 py-1 rounded ${
                  mobilePane === 'editor' ? 'bg-[#10283D] text-[#27C5E8] font-medium' : 'text-[#B9C2CC]'
                }`}
              >
                Editor
              </button>
            </div>

            <div className="text-xs font-mono hidden sm:block">
              {currentUser.problemsSolved.includes(selectedProblem.id) ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Solved</span>
                </span>
              ) : (
                <span className="text-[#B9C2CC]">Unsolved</span>
              )}
            </div>
          </div>
        </div>

        {/* Workspace Split */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2.5 p-2.5 overflow-hidden">
          <div className={`lg:col-span-5 h-full overflow-hidden ${mobilePane === 'problem' ? 'block' : 'hidden lg:block'}`}>
            <ProblemDescription
              problem={selectedProblem}
              isSolved={currentUser.problemsSolved.includes(selectedProblem.id)}
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
                onSubmit={handleSubmit}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="h-[225px] shrink-0 overflow-hidden">
              <TestResultsPanel
                problem={selectedProblem}
                result={testResult}
                isRunning={isRunning}
                onRunCustomInput={handleRunCustomInput}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6 w-full">
      {/* Header */}
      <div className="border-b border-[#294357] pb-5 space-y-1">
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#F1F0EE]">
          Practice Problems
        </h1>
        <p className="text-sm text-[#B9C2CC]">
          Select a problem to inspect constraints, write a solution, and run automated test cases.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#B9C2CC] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by name, ID, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#10283D] border border-[#294357] rounded-md pl-9 pr-3 py-2 text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/60 focus:outline-none focus:border-[#27C5E8]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#10283D] border border-[#294357] rounded-md">
          {(['All', 'Easy', 'Medium', 'Hard', 'Solved', 'Unsolved'] as ProblemFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-[#27C5E8] text-[#07121E]'
                  : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
              }`}
            >
              {filter === 'All' ? 'All problems' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table */}
      <div className="rounded-md border border-[#294357] bg-[#112D43] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10283D] border-b border-[#294357] text-xs font-medium text-[#B9C2CC]">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Problem</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294357]">
              {filteredProblems.map((prob) => {
                const isSolved = currentUser.problemsSolved.includes(prob.id);
                const isDailyMission = prob.id === dailyMissionProblemId;

                return (
                  <tr
                    key={prob.id}
                    className={`transition-colors ${
                      isDailyMission ? 'bg-[#10283D]/70' : 'hover:bg-[#10283D]/50'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-[#B9C2CC] whitespace-nowrap">
                      {prob.problemCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-[#F1F0EE]">{prob.title}</span>
                        {isDailyMission && (
                          <span className="text-[11px] font-mono text-[#E8AE38]">
                            · Daily challenge (+50 LP)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#B9C2CC]">{prob.category}</td>
                    <td className="py-3 px-4 font-medium">
                      <span
                        className={
                          prob.difficulty === 'Easy'
                            ? 'text-emerald-400'
                            : prob.difficulty === 'Medium'
                            ? 'text-[#E8AE38]'
                            : 'text-rose-400'
                        }
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#E8AE38] tabular-nums">
                      {prob.maxScore}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isSolved ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span className="text-[#B9C2CC]">Unsolved</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSelectProblem(prob)}
                        className="px-3 py-1 rounded border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] hover:text-[#27C5E8] font-medium text-xs transition-colors whitespace-nowrap"
                      >
                        {isSolved ? 'Review' : 'Solve'}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredProblems.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-[#B9C2CC]">
                    No coding problems match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
