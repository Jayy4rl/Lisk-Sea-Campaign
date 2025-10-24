"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const TokenTransfer = () => {
  const { address: connectedAddress } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const { writeAsync: writeMyTokenAsync } = useScaffoldContractWrite({
    contractName: "MyToken",
    functionName: "transfer",
    args: [recipient, parseEther(amount)],
  });

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      notification.error("Please fill in all fields");
      return;
    }

    try {
      await writeMyTokenAsync({
        args: [recipient, parseEther(amount)],
      });

      notification.success("Token transfer successful!");
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Transfer failed:", error);
      notification.error("Transfer failed. Please try again.");
    }
  };

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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
          Transfer Tokens
        </h2>

        {/* Message */}
        <p className="text-sky-400/70 text-sm max-w-xs leading-relaxed">
          Please connect your wallet to transfer tokens
        </p>

        {/* Decorative arrows */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-2 h-2 bg-sky-500/40 rounded-full"></div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-sky-500/40 to-sky-500/10"></div>
          <div className="w-2 h-2 bg-sky-500/40 rounded-full"></div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-sky-500/40 to-sky-500/10"></div>
          <div className="w-2 h-2 bg-sky-500/40 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
          Transfer Tokens
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full mt-2"></div>
      </div>

      {/* Recipient Input */}
      <div className="mb-5">
        <label className="block mb-2">
          <span className="text-sky-300 text-sm font-medium">Recipient Address</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="0x..."
            className="w-full bg-black/40 border border-sky-500/30 rounded-xl px-4 py-3 text-sky-100 placeholder-sky-400/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
          {recipient && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-sky-400 rounded-full"></div>
          )}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block mb-2">
          <span className="text-sky-300 text-sm font-medium">Amount</span>
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="0.0"
            className="w-full bg-black/40 border border-sky-500/30 rounded-xl px-4 py-3 text-sky-100 placeholder-sky-400/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          {amount && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-sky-400 rounded-full"></div>}
        </div>
      </div>

      {/* Transfer Button */}
      <button
        className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        onClick={handleTransfer}
        disabled={!recipient || !amount}
      >
        Transfer
      </button>

      {/* Info hint */}
      {(!recipient || !amount) && (
        <div className="mt-3 text-center text-sky-400/50 text-xs">Fill in both fields to enable transfer</div>
      )}
    </div>
  );
};
