"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { usePublicClient } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Events: NextPage = () => {
  // State for managing the page
  const { isConnected } = useAccount();
  const [eventType, setEventType] = useState<"token" | "nft">("token");

  // Dynamically get latest block and set fromBlock to latestBlock - 10000
  const publicClient = usePublicClient();
  const [latestBlock, setLatestBlock] = useState<bigint | null>(null);

  // Fetch latest block number on mount
  useEffect(() => {
    const fetchBlock = async () => {
      // Only fetch if window is defined (client-side)
      if (typeof window !== "undefined" && publicClient) {
        try {
          const blockNum = await publicClient.getBlockNumber();
          setLatestBlock(blockNum);
        } catch (e) {
          console.error("Failed to fetch latest block number", e);
        }
      }
    };
    fetchBlock();
  }, [publicClient]);

  // Calculate safe fromBlock
  const safeFromBlock = latestBlock ? (latestBlock > 10000n ? latestBlock - 10000n : 0n) : 0n;

  // Get token transfer events
  const {
    data: tokenEvents,
    isLoading: tokenLoading,
    error: tokenError,
  } = useScaffoldEventHistory({
    contractName: "MyToken",
    eventName: "Transfer",
    fromBlock: safeFromBlock,
    watch: true,
  });

  // Get NFT transfer events
  const {
    data: nftEvents,
    isLoading: nftLoading,
    error: nftError,
  } = useScaffoldEventHistory({
    contractName: "MyNFT",
    eventName: "Transfer",
    fromBlock: safeFromBlock,
    watch: true,
  });

  // Debug logs
  console.log("Token Events:", tokenEvents);
  console.log("NFT Events:", nftEvents);
  if (tokenError) console.error("Token Event Error:", tokenError);
  if (nftError) console.error("NFT Event Error:", nftError);

  // Determine which events to show based on selected tab
  const currentEvents = eventType === "token" ? tokenEvents || [] : nftEvents || [];
  const isLoading = eventType === "token" ? tokenLoading : nftLoading;

  // Show connection prompt if wallet not connected
  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950/20 via-black to-sky-900/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative w-full max-w-md mx-4">
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
                  <span className="text-4xl">📜</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
                Contract Events
              </h2>

              {/* Message */}
              <p className="text-sky-400/70 text-sm max-w-xs leading-relaxed">
                Please connect your wallet to view events
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Debug error display */}
      {tokenError && (
        <div className="text-red-500 bg-black/80 p-2 mb-2 rounded-lg border border-red-700">
          Token Event Error: {tokenError.toString()}
        </div>
      )}
      {nftError && (
        <div className="text-red-500 bg-black/80 p-2 mb-2 rounded-lg border border-red-700">
          NFT Event Error: {nftError.toString()}
        </div>
      )}
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
              📜 Contract Events
            </h1>
          </div>
          <p className="text-sky-400/70 text-lg">View transaction history for your contracts</p>
        </div>

        {/* Event type tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/40 border border-sky-500/30 rounded-2xl p-1.5 backdrop-blur-sm">
            <button
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                eventType === "token"
                  ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg shadow-sky-500/30"
                  : "text-sky-400/70 hover:text-sky-300 hover:bg-sky-500/10"
              }`}
              onClick={() => setEventType("token")}
            >
              Token Transfers ({tokenEvents?.length || 0})
            </button>
            <button
              className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                eventType === "nft"
                  ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg shadow-sky-500/30"
                  : "text-sky-400/70 hover:text-sky-300 hover:bg-sky-500/10"
              }`}
              onClick={() => setEventType("nft")}
            >
              NFT Activity ({nftEvents?.length || 0})
            </button>
          </div>
        </div>

        {/* Events table */}
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-20"></div>

          <div className="relative bg-gradient-to-br from-sky-950/40 to-black border border-sky-500/20 rounded-3xl p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent flex items-center gap-2">
                {eventType === "token" ? "🪙 Token Events" : "🎨 NFT Events"}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full"></div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sky-400/70">Loading events...</p>
              </div>
            ) : currentEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-black/40 border border-sky-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📭</span>
                </div>
                <p className="text-sky-300 text-lg mb-2">No events found</p>
                <p className="text-sky-400/60 text-sm">
                  {eventType === "token"
                    ? "Transfer some tokens to see events here"
                    : "Mint some NFTs to see events here"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sky-500/20">
                      <th className="text-left py-4 px-4 text-sky-400/70 font-medium text-sm">From</th>
                      <th className="text-left py-4 px-4 text-sky-400/70 font-medium text-sm">To</th>
                      <th className="text-left py-4 px-4 text-sky-400/70 font-medium text-sm">
                        {eventType === "token" ? "Amount" : "Token ID"}
                      </th>
                      <th className="text-left py-4 px-4 text-sky-400/70 font-medium text-sm">Block</th>
                      <th className="text-left py-4 px-4 text-sky-400/70 font-medium text-sm">Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEvents.slice(0, 20).map((event, index) => (
                      <tr
                        key={`${event.log.transactionHash}-${index}`}
                        className="border-b border-sky-500/10 hover:bg-sky-500/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <Address address={(event.args as any)?.from ?? (event.args as any)?.[0]} size="sm" />
                        </td>
                        <td className="py-4 px-4">
                          <Address address={(event.args as any)?.to ?? (event.args as any)?.[1]} size="sm" />
                        </td>
                        <td className="py-4 px-4">
                          {eventType === "token" ? (
                            <span className="font-mono text-sky-300">
                              {Number(formatEther(event.args[2] || 0n)).toFixed(4)} LSEA
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-sm font-medium">
                              #{event.args[2]?.toString()}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sky-400/70 text-sm">{event.log.blockNumber.toString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={`https://sepolia-blockscout.lisk.com/tx/${event.log.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 rounded-lg text-sm font-medium transition-all"
                          >
                            View
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
