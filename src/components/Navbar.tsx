import React, { useState } from 'react';
import { Code2, Menu, X } from 'lucide-react';
import { NavTab, User } from '../types';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: User;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'problems', label: 'Problems' },
  { id: 'battles', label: 'Battles' },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'history', label: 'History' },
  { id: 'profile', label: 'Profile' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  isAuthenticated,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: NavTab) => {
    setMobileMenuOpen(false);
    onSelectTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#294357] bg-[#07121E]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-8">
        {/* Brand */}
        <button
          type="button"
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27C5E8] rounded px-1 py-1 whitespace-nowrap shrink-0"
        >
          <Code2 className="w-4 h-4 text-[#27C5E8] shrink-0" />
          <span className="font-heading text-base font-semibold tracking-tight text-[#F1F0EE] group-hover:text-[#27C5E8] transition-colors whitespace-nowrap">
            Coding Battle Arena
          </span>
        </button>

        {/* Primary Navigation Links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative h-14 flex items-center whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:text-[#27C5E8] ${
                  isActive
                    ? 'text-[#27C5E8] font-medium'
                    : 'text-[#B9C2CC] hover:text-[#F1F0EE] font-normal'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#27C5E8]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Primary Auth Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onLogout}
              className="hidden md:inline-flex items-center justify-center px-4 py-1.5 rounded-md border border-[#294357] bg-[#10283D] hover:border-[#27C5E8] text-xs font-medium text-[#F1F0EE] hover:text-[#27C5E8] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27C5E8]"
              title={`Signed in as ${currentUser.displayName}`}
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNav('auth')}
              className="hidden md:inline-flex items-center justify-center px-4 py-1.5 rounded-md bg-[#27C5E8] hover:bg-[#39BDE0] text-[#07121E] text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F1F0EE]"
            >
              Sign in
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-md border border-[#294357] bg-[#10283D] text-[#F1F0EE] hover:border-[#27C5E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27C5E8]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#294357] bg-[#10283D] px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-[#112D43] text-[#27C5E8] font-medium'
                    : 'text-[#B9C2CC] hover:text-[#F1F0EE] hover:bg-[#112D43]/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 mt-2 border-t border-[#294357]">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2 px-3 rounded-md border border-[#294357] bg-[#07121E] text-sm font-medium text-[#F1F0EE] hover:border-[#27C5E8]"
              >
                Log out ({currentUser.username})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNav('auth')}
                className="w-full py-2 px-3 rounded-md bg-[#27C5E8] text-[#07121E] text-sm font-medium"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
