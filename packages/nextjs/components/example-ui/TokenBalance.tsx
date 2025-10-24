"use client";

import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const TokenBalance = () => {
  const { address: connectedAddress } = useAccount();

  const { data: tokenBalance } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: tokenSymbol } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "symbol",
  });

  const { data: tokenName } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "name",
  });

  if (!connectedAddress) {
    return (
      <div className="relative w-full max-w-md">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-sky-500/20 blur-2xl rounded-full"></div>
          <div className="relative w-16 h-16 bg-black/40 border border-sky-500/30 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
          Token Balance
        </h2>

        {/* Message */}
        <p className="text-sky-400/70 text-sm max-w-xs leading-relaxed">
          Please connect your wallet to view token balance
        </p>

        {/* Decorative bar */}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
          {tokenName} ({tokenSymbol})
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full mt-2"></div>
      </div>

      {/* Balance Display */}
      <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-6 mb-6 hover:border-sky-500/40 transition-colors">
        <div className="text-sky-400/70 text-sm font-medium uppercase tracking-wider mb-3">Your Balance</div>
        <div className="flex items-end gap-3">
          <div className="text-5xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
            {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(4) : "0.0000"}
          </div>
          <div className="text-sky-400 text-lg font-semibold pb-2 mb-1">{tokenSymbol}</div>
        </div>

        {/* Decorative bar */}
        <div className="mt-4 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-transparent rounded-full"></div>
      </div>

      {/* Connected Address */}
      <div className="pt-4 border-t border-sky-500/10">
        <div className="flex items-center gap-2 text-sky-400/60 text-sm">
          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></div>
          <Address address={connectedAddress} />
        </div>
      </div>
    </div>
  );
};
