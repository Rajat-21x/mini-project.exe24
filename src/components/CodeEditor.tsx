import React, { useState, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { RotateCcw, Copy, Check, Play, Send, Minus, Plus } from 'lucide-react';
import { Language } from '../types';
import { getExecutionEngineInfo } from '../services/codeRunner';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onReset: () => void;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  disabled?: boolean;
}

const MONACO_LANG_MAP: Record<Language, string> = {
  javascript: 'javascript',
  python: 'python',
  cpp: 'cpp',
  java: 'java'
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onReset,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  disabled = false
}) => {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [useFallbackTextarea, setUseFallbackTextarea] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = code.split('\n');
  const engineInfo = getExecutionEngineInfo(language);

  const handleBeforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('cba-navy', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '27C5E8' },
        { token: 'type', foreground: '39BDE0' },
        { token: 'string', foreground: 'E8AE38' },
        { token: 'number', foreground: 'E8AE38' },
        { token: 'comment', foreground: '6E8499', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'F1F0EE' }
      ],
      colors: {
        'editor.background': '#07121E',
        'editor.foreground': '#F1F0EE',
        'editor.lineHighlightBackground': '#10283D',
        'editorLineNumber.foreground': '#4D6A80',
        'editorLineNumber.activeForeground': '#27C5E8',
        'editor.selectionBackground': '#27C5E833',
        'editorCursor.foreground': '#27C5E8',
        'editorGutter.background': '#07121E',
        'editorWidget.background': '#10283D',
        'editorWidget.border': '#294357'
      }
    });
  };

  const handleMount = (editor: any, monaco: Monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (!isRunning && !isSubmitting && !disabled) {
        onRun();
      }
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isRunning && !isSubmitting && !disabled) {
        onRun();
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#112D43] border border-[#294357] rounded-md overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#10283D] border-b border-[#294357] text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            aria-label="Programming language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            disabled={disabled}
            className="bg-[#07121E] border border-[#294357] text-[#F1F0EE] text-xs rounded px-2.5 py-1 focus:border-[#27C5E8] focus:outline-none font-medium cursor-pointer"
          >
            <option value="javascript">JavaScript (Browser Engine)</option>
            <option value="python">Python 3 (Local Sandbox)</option>
            <option value="cpp">C++ (Judge0 Required)</option>
            <option value="java">Java (Judge0 Required)</option>
          </select>

          <span
            className="text-[11px] font-mono text-[#B9C2CC] hidden md:inline"
            title={engineInfo.note}
          >
            {engineInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
            className="p-1.5 text-[#B9C2CC] hover:text-[#F1F0EE] rounded transition-colors"
            title="Decrease font size"
            aria-label="Decrease font size"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-[#B9C2CC] tabular-nums px-1">
            {fontSize}px
          </span>
          <button
            type="button"
            onClick={() => setFontSize((prev) => Math.min(20, prev + 1))}
            className="p-1.5 text-[#B9C2CC] hover:text-[#F1F0EE] rounded transition-colors"
            title="Increase font size"
            aria-label="Increase font size"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <span className="text-[#294357] mx-1">|</span>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-[#B9C2CC] hover:text-[#27C5E8] rounded transition-colors"
            title="Copy code"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="flex items-center gap-1 px-2 py-1 text-[#B9C2CC] hover:text-[#F1F0EE] rounded transition-colors disabled:opacity-50"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="relative flex-1 overflow-hidden bg-[#07121E]">
        {!useFallbackTextarea ? (
          <Editor
            height="100%"
            language={MONACO_LANG_MAP[language]}
            value={code}
            theme="cba-navy"
            beforeMount={handleBeforeMount}
            onMount={handleMount}
            onChange={(val) => onChange(val ?? '')}
            loading={
              <div className="flex items-center justify-center h-full bg-[#07121E] text-xs font-mono text-[#B9C2CC] gap-2">
                <span>Loading editor...</span>
                <button
                  type="button"
                  onClick={() => setUseFallbackTextarea(true)}
                  className="text-[#27C5E8] underline ml-2"
                >
                  Use plain editor
                </button>
              </div>
            }
            options={{
              readOnly: disabled,
              fontSize,
              fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              padding: { top: 12, bottom: 12 }
            }}
          />
        ) : (
          <div className="relative h-full flex overflow-hidden bg-[#07121E]">
            <div
              ref={lineNumbersRef}
              aria-hidden="true"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
              className="w-12 select-none py-3 pr-3 pl-1 text-right font-mono text-[#4D6A80] bg-[#07121E] border-r border-[#294357] overflow-hidden"
            >
              {lines.map((_, i) => (
                <div key={i} className="leading-relaxed">
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              disabled={disabled}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
              placeholder="Write your solution here..."
              className="flex-1 w-full h-full resize-none p-3 font-mono text-[#F1F0EE] bg-transparent outline-none leading-relaxed overflow-auto selection:bg-[#27C5E8]/30 whitespace-pre"
            />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-[#10283D] border-t border-[#294357] text-xs">
        <div className="text-[#B9C2CC] font-mono text-[11px] hidden sm:block tabular-nums">
          {lines.length} lines · Ctrl+Enter to run
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onRun}
            disabled={isRunning || isSubmitting || disabled}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-[#F1F0EE] hover:text-[#27C5E8] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 text-[#27C5E8]" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || isRunning || disabled}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
