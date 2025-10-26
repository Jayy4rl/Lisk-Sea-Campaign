"use client";

import { useEffect, useState } from "react";
import { NFTCard } from "./NFTCard";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const MarketplaceGrid = () => {
  const { address: connectedAddress } = useAccount();
  const [nftIds, setNftIds] = useState<number[]>([]);

  // Get total supply of NFTs
  const { data: totalSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  // Generate array of token IDs
  useEffect(() => {
    if (totalSupply) {
      const supply = Number(totalSupply);
      const ids = Array.from({ length: supply }, (_, i) => i);
      setNftIds(ids);
    }
  }, [totalSupply]);

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="relative w-full max-w-md">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-20"></div>

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-sky-950/40 to-black border border-sky-500/20 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-black/40 border border-sky-500/30 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <p className="text-sky-400/70">Connect your wallet to view the marketplace</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (nftIds.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="relative w-full max-w-md">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-20"></div>

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-sky-950/40 to-black border border-sky-500/20 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-black/40 border border-sky-500/30 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📭</span>
              </div>
              <p className="text-sky-300 text-lg font-semibold">No NFTs minted yet!</p>
              <p className="text-sky-400/60 text-sm">Go to the Home page to mint some NFTs first</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nftIds.map(tokenId => (
        <NFTCard key={tokenId} tokenId={tokenId} />
      ))}
    </div>
  );
};
