"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ============================================================================
// RENDER VAULT - NAVBAR (Desktop + Mobile)
// ============================================================================

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <DesktopNavbar handleAnchorClick={handleAnchorClick} />

      {/* Mobile Navbar */}
      <MobileNavbar 
        isOpen={mobileMenuOpen} 
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        handleAnchorClick={handleAnchorClick}
      />
    </>
  );
}

// ============================================================================
// DESKTOP NAVBAR
// ============================================================================

function DesktopNavbar({ 
  handleAnchorClick 
}: { 
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDev) {
      e.preventDefault();
      router.push('/dashboard');
    }
  };

  const handleSignUpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isDev) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span 
              className="text-xl tracking-widest uppercase"
              style={{ 
                fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                fontWeight: 400,
                letterSpacing: '0.15em',
                color: '#1a2b4a'
              }}
            >
              RENDER VAULT
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="flex items-center gap-10">
            <a 
              href="#contact" 
              onClick={(e) => handleAnchorClick(e, '#contact')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Contact us
            </a>
            <a 
              href="#process" 
              onClick={(e) => handleAnchorClick(e, '#process')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Process
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleAnchorClick(e, '#pricing')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleAnchorClick(e, '#faq')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link 
              href={isDev ? "/dashboard" : "/login"}
              onClick={handleLoginClick}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <button 
              onClick={handleSignUpClick}
              className="text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ backgroundColor: '#1a2b4a' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2a3b5a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a2b4a';
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

// ============================================================================
// MOBILE NAVBAR
// ============================================================================

function MobileNavbar({ 
  isOpen, 
  onToggle,
  handleAnchorClick
}: { 
  isOpen: boolean;
  onToggle: () => void;
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDev) {
      e.preventDefault();
      router.push('/dashboard');
    }
    onToggle();
  };

  const handleSignUpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isDev) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
    onToggle();
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-100">
        <nav className="px-5">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span 
                className="text-base tracking-widest uppercase"
                style={{ 
                  fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  color: '#1a2b4a'
                }}
              >
                RENDER VAULT
              </span>
            </Link>

            {/* Hamburger / Close */}
            <button 
              onClick={onToggle}
              className="w-10 h-10 flex items-center justify-center -mr-2"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-white z-30">
          <nav className="px-6 py-8">
            <div className="space-y-1">
              <a 
                href="#contact" 
                onClick={(e) => handleAnchorClick(e, '#contact')}
                className="block py-4 text-lg text-gray-900 border-b border-gray-100"
              >
                Contact us
              </a>
              <a 
                href="#process" 
                onClick={(e) => handleAnchorClick(e, '#process')}
                className="block py-4 text-lg text-gray-900 border-b border-gray-100"
              >
                Process
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => handleAnchorClick(e, '#pricing')}
                className="block py-4 text-lg text-gray-900 border-b border-gray-100"
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                onClick={(e) => handleAnchorClick(e, '#faq')}
                className="block py-4 text-lg text-gray-900 border-b border-gray-100"
              >
                FAQ
              </a>
              <Link 
                href={isDev ? "/dashboard" : "/login"}
                onClick={handleLoginClick}
                className="block py-4 text-lg text-gray-500"
              >
                Login
              </Link>
            </div>

            {/* Mobile CTA */}
            <div className="mt-8">
              <button 
                onClick={handleSignUpClick}
                className="w-full text-white py-4 rounded-full text-base font-medium"
                style={{ backgroundColor: '#1a2b4a' }}
              >
                Sign up
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

