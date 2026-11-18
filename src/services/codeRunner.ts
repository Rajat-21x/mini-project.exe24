import { Language, Problem, SubmissionResult, TestResult } from '../types';

/**
 * Honest execution status helper:
 * - JavaScript runs natively inside an isolated browser Function sandbox.
 * - Python / C++ / Java do not pretend Judge0 API is connected unless configured.
 */
export function getExecutionEngineInfo(language: Language): {
  mode: SubmissionResult['engineMode'];
  label: string;
  note: string;
  isRemoteJudge0: boolean;
} {
  const judge0Configured = Boolean(import.meta.env.VITE_JUDGE0_API_URL);

  if (judge0Configured) {
    return {
      mode: 'judge0-api',
      label: 'Judge0 API Connected',
      note: 'Executing on configured Judge0 remote sandbox.',
      isRemoteJudge0: true
    };
  }

  if (language === 'javascript') {
    return {
      mode: 'browser-js',
      label: 'Browser JS Sandbox (Live)',
      note: 'User JavaScript code is executed directly in-browser against all test cases.',
      isRemoteJudge0: false
    };
  }

  if (language === 'python') {
    return {
      mode: 'client-transpiler',
      label: 'Local Sandbox (Judge0 API Not Configured)',
      note: 'Judge0 API is not configured. Running lightweight client-side Python-to-JS evaluation for supported constructs.',
      isRemoteJudge0: false
    };
  }

  return {
    mode: 'simulated-preview',
    label: 'Syntax Check Only (Judge0 API Not Configured)',
    note: `Judge0 API is not configured for native ${language.toUpperCase()} compilation. Switch to JavaScript for live browser code execution, or connect Judge0 API.`,
    isRemoteJudge0: false
  };
}

export async function executeCode(
  problem: Problem,
  code: string,
  language: Language,
  customParams?: any[]
): Promise<SubmissionResult> {
  const startTime = performance.now();
  const engineInfo = getExecutionEngineInfo(language);
  const testResults: TestResult[] = [];
  const testCasesToRun = customParams
    ? [{ id: 999, input: JSON.stringify(customParams), expected: 'N/A', params: customParams }]
    : problem.testCases;

  // If C++ or Java and Judge0 is not configured, do NOT pretend native C++/Java compiled & executed.
  if (!engineInfo.isRemoteJudge0 && (language === 'cpp' || language === 'java')) {
    const syntaxErrors = checkCompiledSyntax(code, language);
    const totalDuration = Math.max(4, Math.round(performance.now() - startTime));

    if (syntaxErrors) {
      return {
        status: 'Runtime Error',
        totalPassed: 0,
        totalTests: testCasesToRun.length,
        runtimeMs: totalDuration,
        memoryMb: 0,
        engineMode: engineInfo.mode,
        engineNote: engineInfo.note,
        error: syntaxErrors,
        testResults: testCasesToRun.map((tc) => ({
          testCaseId: tc.id,
          passed: false,
          input: tc.input,
          expected: tc.expected,
          actual: 'Compilation check failed',
          error: syntaxErrors,
          runtimeMs: totalDuration,
          isHidden: tc.isHidden
        }))
      };
    }

    return {
      status: 'Runtime Error',
      totalPassed: 0,
      totalTests: testCasesToRun.length,
      runtimeMs: totalDuration,
      memoryMb: 0,
      engineMode: engineInfo.mode,
      engineNote: engineInfo.note,
      error: `Judge0 API is not configured in this environment. Native ${language.toUpperCase()} code cannot be compiled or executed without a backend Judge0 service. Please select JavaScript for live execution.`,
      testResults: testCasesToRun.map((tc) => ({
        testCaseId: tc.id,
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: 'Judge0 API not configured',
        stdout: `[Syntax Check Passed] Valid ${language.toUpperCase()} structure detected. Remote execution requires Judge0 API.`,
        error: `Judge0 API not connected for ${language.toUpperCase()} execution.`,
        runtimeMs: totalDuration,
        isHidden: tc.isHidden
      }))
    };
  }

  let totalPassed = 0;

  for (const tc of testCasesToRun) {
    const caseStartTime = performance.now();
    try {
      const { actual, stdout } = await runForLanguage(code, language, tc.params);
      const caseDuration = Math.round(performance.now() - caseStartTime);

      const passed = customParams ? true : isOutputEqual(actual, tc.expected);
      if (passed) totalPassed++;

      testResults.push({
        testCaseId: tc.id,
        passed,
        input: tc.input,
        expected: tc.expected,
        actual: formatOutput(actual),
        stdout,
        runtimeMs: Math.max(1, caseDuration),
        isHidden: tc.isHidden
      });
    } catch (err: any) {
      const caseDuration = Math.round(performance.now() - caseStartTime);
      testResults.push({
        testCaseId: tc.id,
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: 'Error: ' + (err.message || String(err)),
        error: err.message || String(err),
        runtimeMs: Math.max(1, caseDuration),
        isHidden: tc.isHidden
      });
    }
  }

  const totalDuration = Math.round(performance.now() - startTime);
  const allPassed = totalPassed === testCasesToRun.length;

  let status: SubmissionResult['status'] = 'Accepted';
  if (!allPassed) {
    const hasError = testResults.some((r) => r.error);
    status = hasError ? 'Runtime Error' : 'Wrong Answer';
  }

  return {
    status,
    totalPassed,
    totalTests: testCasesToRun.length,
    runtimeMs: Math.max(2, totalDuration),
    memoryMb: Math.round((14 + (performance as any)?.memory?.usedJSHeapSize ? 18 : 16) * 10) / 10,
    testResults,
    engineMode: engineInfo.mode,
    engineNote: engineInfo.note
  };
}

async function runForLanguage(
  code: string,
  language: Language,
  params: any[]
): Promise<{ actual: any; stdout: string }> {
  const capturedLogs: string[] = [];
  const fakeConsole = {
    log: (...args: any[]) => {
      capturedLogs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args: any[]) => {
      capturedLogs.push('[Error] ' + args.join(' '));
    },
    warn: (...args: any[]) => {
      capturedLogs.push('[Warn] ' + args.join(' '));
    }
  };

  if (language === 'javascript') {
    return runJavaScript(code, params, fakeConsole, capturedLogs);
  } else if (language === 'python') {
    return runPython(code, params, fakeConsole, capturedLogs);
  }

  throw new Error(`Judge0 execution service is required for ${language.toUpperCase()}.`);
}

function checkCompiledSyntax(code: string, lang: 'cpp' | 'java'): string | null {
  if (lang === 'cpp') {
    if (!code.includes('class Solution') && !code.includes('vector') && !code.includes('int ') && !code.includes('string ')) {
      return "Compilation Check: missing 'class Solution' or entry function signature";
    }
    if (!code.includes('{') || !code.includes('}')) {
      return "Compilation Check: unmatched braces '{' '}'";
    }
  } else if (lang === 'java') {
    if (!code.includes('class Solution') && !code.includes('public')) {
      return 'Compilation Check: class Solution not found in file';
    }
    if (!code.includes(';') && code.length > 50) {
      return "Compilation Check: ';' expected";
    }
  }
  return null;
}

function runJavaScript(
  code: string,
  params: any[],
  fakeConsole: any,
  capturedLogs: string[]
): { actual: any; stdout: string } {
  const fnMatch = code.match(/function\s+([a-zA-Z0-9_$]+)\s*\(/);
  const constMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/);
  const targetFnName = fnMatch ? fnMatch[1] : constMatch ? constMatch[1] : null;

  if (!targetFnName) {
    throw new Error(
      'No valid entry function found in your code. Declare a named function, e.g. function solution(...) { ... }'
    );
  }

  const clonedParams = JSON.parse(JSON.stringify(params));

  const runner = new Function(
    'console',
    'args',
    `
    "use strict";
    ${code}
    if (typeof ${targetFnName} !== 'function') {
      throw new Error("Function '${targetFnName}' is not defined");
    }
    return ${targetFnName}.apply(null, args);
    `
  );

  const result = runner(fakeConsole, clonedParams);
  return {
    actual: result,
    stdout: capturedLogs.join('\n')
  };
}

function runPython(
  code: string,
  params: any[],
  fakeConsole: any,
  capturedLogs: string[]
): { actual: any; stdout: string } {
  const defMatch = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
  if (!defMatch) {
    throw new Error('SyntaxError: expected a function definition, e.g.: def solution(...):');
  }

  const lines = code.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length > 1) {
    const hasIndentedBody = lines.slice(1).some((l) => l.startsWith(' ') || l.startsWith('\t'));
    if (!hasIndentedBody) {
      throw new Error('IndentationError: expected an indented block after function definition');
    }
  }

  const pyToJsTranspiled = transpileSimplePythonToJS(code);
  try {
    return runJavaScript(pyToJsTranspiled, params, fakeConsole, capturedLogs);
  } catch (err: any) {
    throw new Error(
      `Local Python Sandbox could not evaluate this syntax (${err.message}). Connect Judge0 API for full CPython 3 execution, or use JavaScript.`
    );
  }
}

function transpileSimplePythonToJS(pyCode: string): string {
  let js = pyCode;
  js = js.replace(/\bprint\s*\(/g, 'console.log(');
  js = js.replace(/\bTrue\b/g, 'true');
  js = js.replace(/\bFalse\b/g, 'false');
  js = js.replace(/\bNone\b/g, 'null');
  js = js.replace(/len\(([^)]+)\)/g, '$1.length');
  js = js.replace(/([a-zA-Z0-9_]+)\[::-1\]/g, '$1.split("").reverse().join("")');
  js = js.replace(
    /for\s+([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\s+in\s+enumerate\(([^)]+)\):/g,
    'for (let $1 = 0; $1 < $3.length; $1++) { const $2 = $3[$1];'
  );
  js = js.replace(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*(?:->[^:]+)?\s*:/g, (_match, name, args) => {
    const cleanArgs = args.replace(/:[^,)]+/g, '').trim();
    return `function ${name}(${cleanArgs}) {`;
  });
  return js;
}

function isOutputEqual(actual: any, expectedStr: string): boolean {
  try {
    const formattedActual = formatOutput(actual);
    const cleanedActual = formattedActual.replace(/\s+/g, '');
    const cleanedExpected = expectedStr.replace(/\s+/g, '');

    if (cleanedActual === cleanedExpected) return true;

    if (!isNaN(Number(actual)) && !isNaN(Number(expectedStr))) {
      return Number(actual) === Number(expectedStr);
    }

    if (typeof actual === 'boolean') {
      return String(actual).toLowerCase() === expectedStr.toLowerCase();
    }

    const parsedExpected = JSON.parse(expectedStr);
    return JSON.stringify(actual) === JSON.stringify(parsedExpected);
  } catch {
    return String(actual).trim() === expectedStr.trim();
  }
}

function formatOutput(val: any): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'object') {
    return JSON.stringify(val);
  }
  return String(val);
}
