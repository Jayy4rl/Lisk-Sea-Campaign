"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Bars3Icon, BugAntIcon, HomeIcon } from "@heroicons/react/24/outline";
import {
  DappConsoleButton,
  FaucetButton,
  RainbowKitCustomConnectButton,
  SuperchainFaucetButton,
} from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { cn } from "~~/utils/cn";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group",
                isActive
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  : "text-sky-400/70 hover:text-sky-300 hover:bg-sky-500/10",
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive ? "text-sky-400" : "text-sky-400/50 group-hover:text-sky-400",
                )}
              >
                {icon}
              </span>
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent"></span>
              )}
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <header className="sticky lg:static top-0 min-h-0 flex-shrink-0 z-20 px-0 sm:px-2">
      {/* Background with gradient and grid */}
      <div className="relative bg-black border-b border-sky-500/20">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/20 via-transparent to-sky-950/20"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <nav className="relative flex items-center justify-between py-4 px-4 sm:px-6 backdrop-blur-sm">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center gap-6">
            {/* Mobile menu button */}
            <div className="lg:hidden" ref={burgerMenuRef}>
              <button
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isDrawerOpen
                    ? "bg-sky-500/20 text-sky-300"
                    : "text-sky-400/70 hover:bg-sky-500/10 hover:text-sky-300",
                )}
                onClick={() => {
                  setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
                }}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Mobile dropdown */}
              {isDrawerOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-xl shadow-sky-500/10 overflow-hidden">
                  <ul
                    className="p-3 space-y-1"
                    onClick={() => {
                      setIsDrawerOpen(false);
                    }}
                  >
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/events">Events</Link>
                    </li>
                    <li>
                      <Link href="/debug">Debug Contracts</Link>
                    </li>
                    <li>
                      <Link href="/blockexplorer">Block Explorer</Link>
                    </li>
                    <HeaderMenuLinks />
                  </ul>
                </div>
              )}
            </div>

            {/* Logo - Desktop */}
            <Link href="/" passHref className="hidden lg:flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Logo size={32} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
                  Scaffold-Lisk
                </span>
                <span className="text-xs text-sky-400/60">Ethereum dev stack</span>
              </div>
            </Link>

            {/* Desktop menu */}
            <ul className="hidden lg:flex items-center gap-2">
              <HeaderMenuLinks />
            </ul>
          </div>

          {/* Right side - Buttons */}
          <div className="flex items-center gap-2">
            <RainbowKitCustomConnectButton />
            <FaucetButton />
            <SuperchainFaucetButton />
            <DappConsoleButton />
          </div>
        </nav>
      </div>
    </header>
  );
};
