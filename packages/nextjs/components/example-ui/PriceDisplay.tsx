"use client";

import { useEffect, useState } from "react";
import { useCallback } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { getSignersForDataServiceId } from "@redstone-finance/sdk";
import { ethers } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface PriceDisplayProps {
  symbol: "ETH" | "BTC";
}

export const PriceDisplay = ({ symbol }: PriceDisplayProps) => {
  const [price, setPrice] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: deployedContractData } = useDeployedContractInfo("PriceFeed");

  const fetchPrice = useCallback(async () => {
    if (!deployedContractData) {
      setError("PriceFeed contract not deployed. Run: yarn deploy");
      setIsLoading(false);
      return;
    }

    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please connect your wallet to view prices");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Create ethers provider from window.ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);

      // Create ethers contract instance
      const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, provider);

      // Wrap contract with RedStone data using correct API
      const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
        dataPackagesIds: [symbol],
        authorizedSigners: getSignersForDataServiceId("redstone-main-demo"),
      });

      // Call the appropriate price function
      const priceData = symbol === "ETH" ? await wrappedContract.getEthPrice() : await wrappedContract.getBtcPrice();

      if (!priceData) {
        throw new Error("No price data returned from oracle");
      }

      // Format price (8 decimals to 2 decimals)
      const formattedPrice = (Number(priceData) / 1e8).toFixed(2);
      setPrice(formattedPrice);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching price:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch price");
    } finally {
      setIsLoading(false);
    }
  }, [deployedContractData, symbol]);

  useEffect(() => {
    fetchPrice();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [deployedContractData, symbol, fetchPrice]);

  return (
    <div className="relative w-full max-w-md">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-20"></div>

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-sky-950/40 to-black border border-sky-500/20 rounded-3xl p-8 backdrop-blur-xl">
        {/* Decorative element */}
        <div className="absolute top-4 right-4 flex gap-1">
          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
            {symbol}/USD
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full mt-2 mx-auto"></div>
        </div>

        {error ? (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sky-400/70 text-sm">Loading price...</p>
          </div>
        ) : (
          <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-6 mb-6 hover:border-sky-500/40 transition-colors">
            <div className="text-sky-400/70 text-sm font-medium uppercase tracking-wider mb-3 text-center">
              Current Price
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent text-center mb-4">
              ${price}
            </div>
            <div className="text-sky-400/60 text-xs text-center">Updated: {lastUpdate.toLocaleTimeString()}</div>

            {/* Decorative bar */}
            <div className="mt-4 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-transparent rounded-full"></div>
          </div>
        )}

        {/* Refresh Button */}
        <button
          className="w-full bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 rounded-xl py-2.5 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={fetchPrice}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};
