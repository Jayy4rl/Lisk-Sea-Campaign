"use client";

import { useState } from "react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { liskSepoliaThirdweb } from "~~/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { thirdwebClient } from "~~/services/web3/thirdwebConfig";
// ✅ Use shared client
import { notification } from "~~/utils/scaffold-eth";

export const SmartWalletDemo = () => {
  const [mintToAddress, setMintToAddress] = useState("");
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const account = useActiveAccount();

  // Get contract address from deployments
  const nftAddress = deployedContracts?.[4202]?.MyNFT?.address as `0x${string}` | undefined;

  const { data: totalSupply, refetch: refetchSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const { data: userNFTBalance, refetch: refetchBalance } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });

  const handleGaslessMint = async () => {
    const targetAddress = mintToAddress || account?.address;

    if (!targetAddress || !account || !nftAddress) {
      notification.error("Please connect wallet");
      return;
    }

    setIsLoadingNFT(true);

    try {
      // Create thirdweb contract instance
      const nftContract = getContract({
        client: thirdwebClient, // ✅ Use shared client
        chain: liskSepoliaThirdweb,
        address: nftAddress,
      });

      // Prepare the contract call
      const transaction = prepareContractCall({
        contract: nftContract,
        method: "function mint(address to)",
        params: [targetAddress as `0x${string}`],
      });

      // Send transaction - gas is automatically sponsored! 🎉
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      notification.success(
        `Gasless NFT minted! View on Blockscout: https://sepolia-blockscout.lisk.com/tx/${transactionHash}`,
      );

      setMintToAddress("");

      // Refresh data
      setTimeout(() => {
        refetchSupply();
        refetchBalance();
      }, 2000);
    } catch (error: any) {
      console.error("Mint failed:", error);
      notification.error(error.message || "Mint failed");
    } finally {
      setIsLoadingNFT(false);
    }
  };

  return (
    <div className="flex justify-center gap-8 flex-col sm:flex-row">
      {/* Gasless NFT Minting */}
      <div className="relative w-full max-w-md">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-3xl blur opacity-20"></div>

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-sky-950/40 to-black border border-sky-500/20 rounded-3xl p-8 backdrop-blur-xl">
          {/* Decorative corner element */}
          <div className="absolute top-4 right-4 w-8 h-8 border border-sky-400/30 rounded-lg rotate-45"></div>
          <div className="absolute top-6 right-6 w-4 h-4 border border-sky-400/50 rounded"></div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
              🎨 Mint NFT (100% Gasless!)
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-transparent rounded-full mt-2"></div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-3 mb-6">
            <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-4 hover:border-sky-500/40 transition-colors">
              <div className="text-sky-400/70 text-xs font-medium uppercase tracking-wider mb-1">Total Minted</div>
              <div className="text-3xl font-bold text-sky-300">{totalSupply?.toString() || "0"}</div>
            </div>

            <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-4 hover:border-sky-500/40 transition-colors">
              <div className="text-sky-400/70 text-xs font-medium uppercase tracking-wider mb-1">You Own</div>
              <div className="text-3xl font-bold text-sky-300">{userNFTBalance?.toString() || "0"}</div>
            </div>

            <div className="bg-black/40 border border-sky-500/20 rounded-2xl p-4 hover:border-sky-500/40 transition-colors">
              <div className="text-sky-400/70 text-xs font-medium uppercase tracking-wider mb-1">Smart Wallet</div>
              <div className="text-sky-300 text-sm font-mono">
                {account?.address?.slice(0, 10)}...{account?.address?.slice(-8)}
              </div>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block mb-2">
              <span className="text-sky-300 text-sm font-medium">Mint to address</span>
              <span className="text-sky-400/60 text-xs ml-2">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave empty to mint to yourself"
              className="w-full bg-black/40 border border-sky-500/30 rounded-xl px-4 py-3 text-sky-100 placeholder-sky-400/40 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
              value={mintToAddress}
              onChange={e => setMintToAddress(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button
            className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/50 mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={handleGaslessMint}
            disabled={isLoadingNFT}
          >
            {isLoadingNFT ? "Minting..." : "Mint NFT (Gas Free!)"}
          </button>

          {/* Success Alert */}
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-300 text-xs leading-relaxed">
                ✨ Minting sponsored by thirdweb paymaster - $0 gas cost!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
