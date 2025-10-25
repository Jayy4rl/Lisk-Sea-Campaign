"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const NFTCollection = () => {
  const { address: connectedAddress } = useAccount();
  const [mintToAddress, setMintToAddress] = useState("");

  const { data: nftName } = useScaffoldContractRead<"MyNFT", "name">({
    contractName: "MyNFT",
    functionName: "name",
  });

  const { data: nftSymbol } = useScaffoldContractRead<"MyNFT", "symbol">({
    contractName: "MyNFT",
    functionName: "symbol",
  });

  const { data: totalSupply } = useScaffoldContractRead<"MyNFT", "totalSupply">({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const { data: userBalance } = useScaffoldContractRead<"MyNFT", "balanceOf">({
    contractName: "MyNFT",
    functionName: "balanceOf",
    args: [connectedAddress as `0x${string}` | undefined],
  });

  const { writeAsync: writeMyNFTAsync } = useScaffoldContractWrite({
    contractName: "MyNFT",
    functionName: "mint",
    args: [(mintToAddress || connectedAddress) as `0x${string}` | undefined],
  });

  const handleMint = async () => {
    const targetAddress = mintToAddress || connectedAddress;

    if (!targetAddress) {
      notification.error("Please connect wallet or specify address");
      return;
    }

    try {
      await writeMyNFTAsync({
        args: [targetAddress as `0x${string}`],
      });

      notification.success("NFT minted successfully!");
      setMintToAddress("");
    } catch (error) {
      console.error("Mint failed:", error);
      notification.error("Minting failed. Please try again.");
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
          NFT Collection
        </h2>

        {/* Message */}
        <p className="text-sky-400/70 text-sm max-w-xs leading-relaxed">
          Please connect your wallet to view and mint NFTs
        </p>

        {/* Decorative dots */}
        <div className="flex gap-2 pt-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-sky-500/30 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
          {nftName} ({nftSymbol})
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full mt-2"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-4 hover:border-sky-500/40 transition-colors">
          <div className="text-sky-400/70 text-xs font-medium uppercase tracking-wider mb-1">Total Minted</div>
          <div className="text-3xl font-bold text-sky-300">{totalSupply?.toString() || "0"}</div>
        </div>

        <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-4 hover:border-sky-500/40 transition-colors">
          <div className="text-sky-400/70 text-xs font-medium uppercase tracking-wider mb-1">You Own</div>
          <div className="text-3xl font-bold text-sky-300">{userBalance?.toString() || "0"}</div>
        </div>
      </div>

      {/* Input Field */}
      <div className="mb-6">
        <label className="block mb-2">
          <span className="text-sky-300 text-sm font-medium">Mint to address</span>
          <span className="text-sky-400/60 text-xs ml-2">(leave empty for yourself)</span>
        </label>
        <input
          type="text"
          placeholder="0x... or leave empty"
          className="w-full bg-black/40 border border-sky-500/30 rounded-xl px-4 py-3 text-sky-100 placeholder-sky-400/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
          value={mintToAddress}
          onChange={e => setMintToAddress(e.target.value)}
        />
      </div>

      {/* Action Button */}
      <button
        className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/50 mb-4"
        onClick={handleMint}
      >
        Mint NFT
      </button>

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
