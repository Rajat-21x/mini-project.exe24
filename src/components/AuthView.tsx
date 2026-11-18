import React, { useState } from 'react';
import { LogIn, UserPlus, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { User } from '../types';
import { getRememberedEmail, loginAccount, registerAccount } from '../services/storage';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onCancel: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [loginEmail, setLoginEmail] = useState<string>(() => getRememberedEmail() || 'dhiraj.kumar@cba.edu');
  const [loginPassword, setLoginPassword] = useState<string>('password123');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const [fullName, setFullName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (loginPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginAccount(loginEmail, loginPassword, rememberMe);
      setIsLoading(false);
      if (!res.ok || !res.user) {
        setErrorMsg(res.error || 'Authentication failed.');
        return;
      }
      setSuccessMsg(`Signed in as ${res.user.displayName}.`);
      setTimeout(() => onAuthSuccess(res.user!), 300);
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Full name must be at least 2 characters.');
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      setErrorMsg('Username must be 3-20 characters (letters, numbers, underscores).');
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = registerAccount({
        fullName,
        username,
        email: regEmail,
        password: regPassword
      });
      setIsLoading(false);
      if (!res.ok || !res.user) {
        setErrorMsg(res.error || 'Registration failed.');
        return;
      }
      setSuccessMsg('Account created.');
      setTimeout(() => onAuthSuccess(res.user!), 300);
    }, 300);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 w-full">
      <div className="rounded-md bg-[#112D43] border border-[#294357] p-6 space-y-5">
        <div className="space-y-1 border-b border-[#294357] pb-4">
          <h1 className="font-heading text-2xl font-semibold text-[#F1F0EE]">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h1>
          <p className="text-xs text-[#B9C2CC]">
            {mode === 'login'
              ? 'Access your saved problems, rating history, and match records.'
              : 'Register a competitor account to track your progress.'}
          </p>
        </div>

        {/* Segmented Switch */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-md bg-[#07121E] border border-[#294357]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'login'
                ? 'bg-[#10283D] text-[#27C5E8]'
                : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'register'
                ? 'bg-[#10283D] text-[#27C5E8]'
                : 'text-[#B9C2CC] hover:text-[#F1F0EE]'
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-md bg-[#07121E] border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-md bg-[#07121E] border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8]"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2 text-[#B9C2CC] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#294357] bg-[#07121E] accent-[#27C5E8]"
                />
                <span>Remember email</span>
              </label>
              <span className="font-mono text-[11px] text-[#B9C2CC]">
                Demo: dhiraj.kumar@cba.edu / password123
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-3 rounded-md border border-[#294357] bg-[#07121E] hover:border-[#27C5E8] text-xs font-medium text-[#B9C2CC] hover:text-[#F1F0EE]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-fullname" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                  Full name
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Dhiraj Kumar"
                  className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8]"
                />
              </div>

              <div>
                <label htmlFor="reg-username" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="dhiraj_coder"
                  className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs font-mono text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8]"
                />
              </div>

              <div>
                <label htmlFor="reg-confirm" className="block text-xs font-medium text-[#B9C2CC] mb-1.5">
                  Confirm password
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  className="w-full px-3 py-2 rounded-md bg-[#07121E] border border-[#294357] text-xs text-[#F1F0EE] placeholder:text-[#B9C2CC]/50 focus:outline-none focus:border-[#27C5E8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-[#294357] flex items-start gap-2 text-[11px] text-[#B9C2CC] leading-relaxed">
          <Info className="w-3.5 h-3.5 text-[#27C5E8] shrink-0 mt-0.5" />
          <span>
            Accounts are persisted locally in your browser. Connecting the Express/MongoDB/JWT service enables multi-device sign-in.
          </span>
        </div>
      </div>
    </div>
  );
};
