"use client";

import { useEffect, useState } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { getSignersForDataServiceId } from "@redstone-finance/sdk";
import { ethers } from "ethers";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface NFTCardProps {
  tokenId: number;
}

export const NFTCard = ({ tokenId }: NFTCardProps) => {
  const { address: connectedAddress } = useAccount();
  const [showListModal, setShowListModal] = useState(false);
  const [listPrice, setListPrice] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [ethPriceUSD, setEthPriceUSD] = useState<number>(0);
  // We only need the setter to manage loading state internally
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsLoadingPrice] = useState(false);

  // Get PriceFeed contract info
  const { data: priceFeedContract } = useDeployedContractInfo("PriceFeed");

  // Get NFT owner
  const { data: owner } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "ownerOf",
    args: [BigInt(tokenId)],
  });

  // Get listing info
  const { data: listing, refetch: refetchListing } = useScaffoldContractRead({
    contractName: "NFTMarketplace",
    functionName: "getListing",
    args: [BigInt(tokenId)],
  });

  // Get marketplace contract info (we need its address for approval)
  const { data: marketplaceContract } = useDeployedContractInfo("NFTMarketplace");
  const marketplaceAddress = marketplaceContract?.address;

  // Check if marketplace is approved
  const { data: approvedAddress, refetch: refetchApproved } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "getApproved",
    args: [BigInt(tokenId)],
  });

  const { data: isApprovedForAll, refetch: refetchApprovedForAll } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "isApprovedForAll",
    args: [owner as `0x${string}`, marketplaceAddress as `0x${string}`],
  });

  // Fetch ETH price from oracle
  const fetchEthPrice = async () => {
    if (!priceFeedContract || typeof window === "undefined" || !window.ethereum) {
      return;
    }

    try {
      setIsLoadingPrice(true);

      // Create ethers provider and contract
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const contract = new ethers.Contract(priceFeedContract.address, priceFeedContract.abi, provider);

      // Wrap contract with RedStone data
      const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
        dataPackagesIds: ["ETH"],
        authorizedSigners: getSignersForDataServiceId("redstone-main-demo"),
      });

      // Get ETH price
      const priceData = await wrappedContract.getEthPrice();
      const formattedPrice = Number(priceData) / 1e8; // Convert from 8 decimals
      setEthPriceUSD(formattedPrice);
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    } finally {
      setIsLoadingPrice(false);
    }
  };

  // Fetch price on mount and every 30 seconds
  useEffect(() => {
    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceFeedContract]);

  // Update approval status
  useEffect(() => {
    if (marketplaceAddress) {
      setIsApproved(
        approvedAddress?.toLowerCase() === (marketplaceAddress as string).toLowerCase() || isApprovedForAll === true,
      );
    }
  }, [approvedAddress, isApprovedForAll, marketplaceAddress]);

  // Contract writes
  const { writeAsync: approveMarketplace } = useScaffoldContractWrite({
    contractName: "MyNFT",
    functionName: "setApprovalForAll",
    args: [marketplaceAddress as `0x${string}`, true],
    onBlockConfirmation: async (txnReceipt: any) => {
      console.log("Approval confirmed in block:", txnReceipt.blockNumber);
      // Refetch approval status after transaction is confirmed
      await refetchApproved();
      await refetchApprovedForAll();
      // Set approving state to false after refetch completes
      setIsApproving(false);
      notification.success("Marketplace approved! You can now list your NFT.");
    },
  });

  const { writeAsync: listItem } = useScaffoldContractWrite({
    contractName: "NFTMarketplace",
    functionName: "listItem",
    args: [BigInt(tokenId), parseEther(listPrice || "0")],
  });

  const { writeAsync: buyItem } = useScaffoldContractWrite({
    contractName: "NFTMarketplace",
    functionName: "buyItem",
    args: [BigInt(tokenId)],
    value: listing && listing.isActive ? listing.price : undefined,
  });

  const { writeAsync: cancelListing } = useScaffoldContractWrite({
    contractName: "NFTMarketplace",
    functionName: "cancelListing",
    args: [BigInt(tokenId)],
  });

  // Handle approval
  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await approveMarketplace();
      notification.success("Approval transaction sent! Waiting for confirmation...");
      // Note: onBlockConfirmation callback will handle success notification and reset isApproving
    } catch (error) {
      console.error("Approval failed:", error);
      notification.error("Approval failed");
      setIsApproving(false);
    }
  };

  // Handle listing
  const handleList = async () => {
    if (!listPrice || parseFloat(listPrice) <= 0) {
      notification.error("Please enter a valid price");
      return;
    }

    try {
      await listItem();
      notification.success("NFT listed successfully!");
      setShowListModal(false);
      setListPrice("");
      setTimeout(() => refetchListing(), 2000);
    } catch (error) {
      console.error("Listing failed:", error);
      notification.error("Listing failed");
    }
  };

  // Handle buy
  const handleBuy = async () => {
    try {
      await buyItem();
      notification.success("NFT purchased successfully!");
      setTimeout(() => refetchListing(), 2000);
    } catch (error) {
      console.error("Purchase failed:", error);
      notification.error("Purchase failed");
    }
  };

  // Handle cancel
  const handleCancel = async () => {
    try {
      await cancelListing();
      notification.success("Listing canceled!");
      setTimeout(() => refetchListing(), 2000);
    } catch (error) {
      console.error("Cancel failed:", error);
      notification.error("Cancel failed");
    }
  };

  const isOwner = owner?.toLowerCase() === connectedAddress?.toLowerCase();
  const isListed = listing?.isActive === true;
  const priceInEth = listing?.price ? formatEther(listing.price) : "0";
  const priceInUSD = ethPriceUSD > 0 ? (parseFloat(priceInEth) * ethPriceUSD).toFixed(2) : "0.00";

  return (
    <>
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-sky-950/40 to-black border border-sky-500/20 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-sky-500/40 transition-all duration-300">
          {/* NFT Image/Display */}
          <div className="relative">
            <div className="w-full h-48 bg-gradient-to-br from-sky-600 to-sky-800 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">#{tokenId}</span>
            </div>
            {isListed && (
              <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm border border-green-400/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Listed
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-sky-300 mb-4">NFT #{tokenId}</h3>

            {/* Owner */}
            <div className="mb-4">
              <p className="text-sky-400/70 text-xs mb-1">Owner:</p>
              <Address address={owner} size="sm" />
            </div>

            {/* Price Display */}
            {isListed && (
              <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-4 mb-4">
                <div className="text-sky-400/70 text-xs font-medium uppercase tracking-wider mb-1">Price</div>
                <div className="text-2xl font-bold text-sky-300">{parseFloat(priceInEth).toFixed(4)} ETH</div>
                {ethPriceUSD > 0 && <div className="text-sky-400/60 text-sm mt-1">~${priceInUSD} USD</div>}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {!isOwner && isListed && (
                <button
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/50"
                  onClick={handleBuy}
                >
                  Buy Now
                </button>
              )}

              {isOwner && !isListed && !isApproved && !isApproving && (
                <button
                  className="w-full bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 rounded-xl py-2.5 font-medium transition-all"
                  onClick={handleApprove}
                >
                  Approve Marketplace
                </button>
              )}

              {isOwner && !isListed && isApproving && (
                <button
                  className="w-full bg-black/40 border border-sky-500/30 text-sky-300 rounded-xl py-2.5 font-medium flex items-center justify-center gap-2"
                  disabled
                >
                  <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                  Approving...
                </button>
              )}

              {isOwner && !isListed && isApproved && !isApproving && (
                <button
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/50"
                  onClick={() => setShowListModal(true)}
                >
                  List for Sale
                </button>
              )}

              {isOwner && isListed && (
                <button
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/50"
                  onClick={handleCancel}
                >
                  Cancel Listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-30"></div>

            {/* Modal content */}
            <div className="relative bg-gradient-to-br from-sky-950/95 to-black border border-sky-500/30 rounded-3xl p-8 backdrop-blur-xl">
              {/* Header */}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent mb-6">
                List NFT #{tokenId}
              </h3>

              {/* Input Field */}
              <div className="mb-6">
                <label className="block mb-2">
                  <span className="text-sky-300 text-sm font-medium">Price in ETH</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.5"
                  className="w-full bg-black/40 border border-sky-500/30 rounded-xl px-4 py-3 text-sky-100 placeholder-sky-400/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                  value={listPrice}
                  onChange={e => setListPrice(e.target.value)}
                />
                {listPrice && ethPriceUSD > 0 && (
                  <div className="text-sky-400/60 text-sm mt-2">
                    ~${(parseFloat(listPrice) * ethPriceUSD).toFixed(2)} USD
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 rounded-xl py-2.5 font-medium transition-all"
                  onClick={() => setShowListModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/50"
                  onClick={handleList}
                >
                  List NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
