import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, ExternalLink } from 'lucide-react';

interface ProjectPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectPresentationModal: React.FC<ProjectPresentationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(1);

  if (!isOpen) return null;

  const slides = [
    {
      num: 1,
      title: 'Coding Battle Arena — Overview',
      subtitle: 'Presented by Dhiraj Kumar · BCA 5th Semester',
      content: (
        <div className="space-y-4 text-xs text-[#F1F0EE]">
          <div className="p-4 rounded-md bg-[#07121E] border border-[#294357] space-y-2.5">
            <div className="text-[#27C5E8] font-medium text-xs">
              Project metadata
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#B9C2CC] block">Student:</span>
                <span className="text-[#F1F0EE] font-medium">Dhiraj Kumar</span>
              </div>
              <div>
                <span className="text-[#B9C2CC] block">Course:</span>
                <span className="text-[#F1F0EE] font-medium">BCA (5th Semester)</span>
              </div>
              <div>
                <span className="text-[#B9C2CC] block">Project type:</span>
                <span className="text-[#F1F0EE] font-medium">Full Stack Web Application</span>
              </div>
              <div>
                <span className="text-[#B9C2CC] block">Domain:</span>
                <span className="text-[#F1F0EE] font-medium">EdTech / Competitive Programming</span>
              </div>
            </div>
          </div>
          <p className="text-[#B9C2CC] leading-relaxed text-sm">
            Coding Battle Arena is an online coding practice and competition platform combining algorithmic challenges, an in-browser Monaco editor, 1v1 duels, automated test case checks, and competitive leaderboards.
          </p>
        </div>
      )
    },
    {
      num: 2,
      title: '1. Introduction & Objectives',
      subtitle: 'Problem statement and goals',
      content: (
        <div className="space-y-4 text-xs text-[#F1F0EE]">
          <div className="p-4 rounded-md bg-[#07121E] border border-[#294357]">
            <div className="text-[#E8AE38] font-medium mb-1 text-sm">Problem statement</div>
            <p className="text-[#B9C2CC] leading-relaxed">
              Traditional coding practice becomes repetitive without competition or instant verification. Coding Battle Arena unifies structured problem solving, timed 1v1 battles, scoring, and rankings in one application.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[#27C5E8] font-medium">Project objectives</div>
            <ul className="space-y-1.5">
              {[
                'Provide an accessible environment for practicing programming problems.',
                'Enable developers to compete in timed 1v1 coding battles.',
                'Execute and evaluate JavaScript code automatically against test cases.',
                'Calculate Elo scores and rankings based on accepted solutions and speed.',
                'Display a global leaderboard supporting fair competition.',
                'Maintain user profiles, 30-day rating trends, and battle history.'
              ].map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-[#F1F0EE]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#27C5E8] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      num: 3,
      title: '2. Features & Modules',
      subtitle: 'Core platform sections',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { name: 'User Authentication', desc: 'Registration and sign-in flows with session state.' },
            { name: 'Coding Problems', desc: 'Problem archive with difficulty/status filters, constraints, and test cases.' },
            { name: 'Online Code Editor', desc: 'Monaco Editor workspace with syntax highlighting and multi-language templates.' },
            { name: 'Code Execution', desc: 'Live browser JavaScript sandbox plus Judge0 status notices for C++/Java.' },
            { name: 'Battle Mode', desc: '1v1 arena duels with countdown timer and test pass comparisons.' },
            { name: 'Leaderboard', desc: 'Global, Weekly, and Monthly rankings by score, solved count, and win rate.' },
            { name: 'Battle History', desc: 'Match logs, step-by-step code replay, and PNG summary card export.' },
            { name: 'User Profile', desc: 'Competitor profile, achievements, editable settings, and 30-day rating chart.' }
          ].map((mod, i) => (
            <div key={i} className="p-3 bg-[#07121E] border border-[#294357] rounded-md space-y-1">
              <div className="font-medium text-[#27C5E8] text-xs">{mod.name}</div>
              <div className="text-[11px] text-[#B9C2CC] leading-snug">{mod.desc}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      num: 4,
      title: '3. Technology Stack & Working Flow',
      subtitle: 'Architecture and execution flow',
      content: (
        <div className="space-y-4 text-xs">
          <div className="overflow-x-auto border border-[#294357] rounded-md">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#10283D] border-b border-[#294357] text-[#B9C2CC]">
                <tr>
                  <th className="py-2 px-3">Layer</th>
                  <th className="py-2 px-3">Technology</th>
                  <th className="py-2 px-3">Environment status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#294357] bg-[#07121E]">
                <tr>
                  <td className="py-2 px-3 text-[#27C5E8] font-medium">Frontend</td>
                  <td className="py-2 px-3 text-[#F1F0EE]">React.js + TypeScript + Tailwind</td>
                  <td className="py-2 px-3 text-emerald-400 font-mono">Active</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#27C5E8] font-medium">Code Editor</td>
                  <td className="py-2 px-3 text-[#F1F0EE]">Monaco Editor</td>
                  <td className="py-2 px-3 text-emerald-400 font-mono">Active</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#27C5E8] font-medium">Code Runner</td>
                  <td className="py-2 px-3 text-[#F1F0EE]">Browser JS / Judge0 API</td>
                  <td className="py-2 px-3 text-[#E8AE38] font-mono">JS Live / Judge0 Unconfigured</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-[#27C5E8] font-medium">Backend / DB / RT</td>
                  <td className="py-2 px-3 text-[#F1F0EE]">Express + MongoDB + Socket.io</td>
                  <td className="py-2 px-3 text-[#E8AE38] font-mono">LocalStorage + Duel Sim Active</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-[#07121E] border border-[#294357] rounded-md space-y-1.5">
            <div className="text-[#E8AE38] font-medium text-xs">Basic working flow:</div>
            <div className="text-[11px] text-[#B9C2CC] space-y-1">
              <div><span className="text-[#E8AE38] font-mono font-semibold mr-1.5">1.</span>User registers or signs in.</div>
              <div><span className="text-[#E8AE38] font-mono font-semibold mr-1.5">2.</span>User selects a coding problem or joins a 1v1 battle.</div>
              <div><span className="text-[#E8AE38] font-mono font-semibold mr-1.5">3.</span>Code is written in the Monaco online code editor.</div>
              <div><span className="text-[#E8AE38] font-mono font-semibold mr-1.5">4.</span>Code is evaluated by the execution engine.</div>
              <div><span className="text-[#E8AE38] font-mono font-semibold mr-1.5">5.</span>Test case results (pass/fail, runtime) are returned to the user.</div>
              <div><span className="text-[#E8AE38] font-mono font-semibold mr-1.5">6.</span>Score is calculated and the global leaderboard is updated.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: 5,
      title: '4. Advantages & Future Scope',
      subtitle: 'BCA 5th Semester project summary',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-md bg-[#07121E] border border-[#294357] space-y-1">
            <div className="text-[#27C5E8] font-medium">Conclusion</div>
            <p className="text-[#B9C2CC] leading-relaxed">
              Coding Battle Arena delivers a practical competitive programming environment combining structured practice, Monaco code editing, Elo rankings, and match replay capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#07121E] border border-[#294357] rounded-md">
              <div className="text-[#27C5E8] font-medium mb-1.5">Advantages</div>
              <ul className="text-[11px] text-[#B9C2CC] space-y-1 list-disc pl-4">
                <li>Makes coding practice engaging through timed 1v1 matches.</li>
                <li>Provides immediate feedback against automated test cases.</li>
                <li>Helps students build algorithmic speed and accuracy.</li>
                <li>Browser-accessible responsive workspace.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-[#07121E] border border-[#294357] rounded-md">
              <div className="text-[#E8AE38] font-medium mb-1.5">Future scope</div>
              <ul className="text-[11px] text-[#B9C2CC] space-y-1 list-disc pl-4">
                <li>Hosted Judge0 compiler integration for C++, Java, and Go.</li>
                <li>Multi-round tournaments and scheduled contests.</li>
                <li>Production Node/Express/MongoDB + Socket.io deployment.</li>
                <li>Expanded match analytics and team formats.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07121E]/85">
      <div className="max-w-2xl w-full bg-[#112D43] border border-[#294357] rounded-md shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#294357] bg-[#10283D]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#27C5E8]" />
            <div>
              <span className="font-heading text-base font-semibold text-[#F1F0EE] block">
                Project Presentation Brief
              </span>
              <span className="text-xs text-[#B9C2CC] block">
                Dhiraj Kumar · BCA 5th Semester
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#B9C2CC] hover:text-[#F1F0EE] rounded transition-colors"
            aria-label="Close project brief"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Selector */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#07121E] border-b border-[#294357] text-xs">
          <div className="flex items-center gap-1.5">
            {slides.map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveSlide(s.num)}
                className={`w-7 h-7 rounded font-mono text-xs font-medium transition-colors ${
                  activeSlide === s.num
                    ? 'bg-[#27C5E8] text-[#07121E]'
                    : 'bg-[#10283D] text-[#B9C2CC] hover:text-[#F1F0EE] border border-[#294357]'
                }`}
              >
                {s.num}
              </button>
            ))}
          </div>

          <a
            href="/assets/aistudio/Coding-Battle-Arena-Styled-Project-Presentation_2cc036ff.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#27C5E8] hover:text-[#39BDE0] font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open PDF</span>
          </a>
        </div>

        {/* Slide Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="font-heading text-lg font-semibold text-[#F1F0EE]">
              {slides[activeSlide - 1].title}
            </div>
            <div className="text-xs text-[#27C5E8] mt-0.5">
              {slides[activeSlide - 1].subtitle}
            </div>
          </div>

          {slides[activeSlide - 1].content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#294357] bg-[#10283D] text-xs">
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => Math.max(1, prev - 1))}
            disabled={activeSlide === 1}
            className="px-3.5 py-1.5 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] disabled:opacity-40 transition-colors"
          >
            Previous
          </button>

          <span className="text-[#B9C2CC] font-mono tabular-nums">
            Slide {activeSlide} of {slides.length}
          </span>

          <button
            type="button"
            onClick={() => setActiveSlide((prev) => Math.min(slides.length, prev + 1))}
            disabled={activeSlide === slides.length}
            className="px-3.5 py-1.5 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] font-medium disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
