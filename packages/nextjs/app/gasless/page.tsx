"use client";

import type { NextPage } from "next";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { liskSepoliaThirdweb } from "~~/chains";
import { SmartWalletDemo } from "~~/components/example-ui/SmartWalletDemo";
import { thirdwebClient } from "~~/services/web3/thirdwebConfig";

// ✅ Use shared client

const Gasless: NextPage = () => {
  const account = useActiveAccount();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-950/20 via-black to-sky-900/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Page header */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full"></div>
            <h1 className="relative text-5xl font-bold bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent mb-4">
              ⛽ Gasless Transactions
            </h1>
          </div>
          <p className="text-sky-400/70 text-lg mb-4">Powered by ERC-4337 Smart Wallets - Pay $0 in gas fees!</p>

          {/* Smart Wallet Connect Button */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative">
                <ConnectButton
                  client={thirdwebClient}
                  chain={liskSepoliaThirdweb}
                  accountAbstraction={{
                    chain: liskSepoliaThirdweb,
                    sponsorGas: true, // ✅ This enables gasless transactions!
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {account ? (
          <SmartWalletDemo />
        ) : (
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-20"></div>

              {/* Main card */}
              <div className="relative bg-gradient-to-br from-sky-950/40 to-black border border-sky-500/20 rounded-3xl p-8 backdrop-blur-xl">
                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-8 h-8 border border-sky-400/30 rounded-lg rotate-45"></div>

                {/* Content */}
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full"></div>
                    <div className="relative w-16 h-16 bg-black/40 border border-sky-500/30 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
                    Create a Smart Wallet
                  </h2>

                  {/* Message */}
                  <p className="text-sky-400/70 text-sm max-w-xs leading-relaxed">
                    Connect above to create your gasless Smart Wallet!
                  </p>

                  {/* Info Alert */}
                  <div className="bg-sky-500/20 border border-sky-500/30 rounded-2xl p-4 w-full">
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-sky-400 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sky-300 text-xs leading-relaxed">
                        ✨ Smart Wallets are deployed on-chain automatically and all transactions are sponsored!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gasless;
