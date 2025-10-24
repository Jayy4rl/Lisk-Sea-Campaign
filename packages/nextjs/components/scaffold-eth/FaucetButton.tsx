"use client";

import { useState } from "react";
import { createWalletClient, http, parseEther } from "viem";
import { hardhat } from "viem/chains";
import { useAccount, useNetwork } from "wagmi";
import { useBalance } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useTransactor } from "~~/hooks/scaffold-eth";

// Number of ETH faucet sends to an address
const NUM_OF_ETH = "1";
const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
});

/**
 * FaucetButton button which lets you grab eth.
 */
export const FaucetButton = () => {
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
    watch: true,
  });

  const { chain: ConnectedChain } = useNetwork();

  const [loading, setLoading] = useState(false);

  const faucetTxn = useTransactor(localWalletClient);

  const sendETH = async () => {
    try {
      setLoading(true);
      await faucetTxn({
        chain: hardhat,
        account: FAUCET_ADDRESS,
        to: address,
        value: parseEther(NUM_OF_ETH),
      });
      setLoading(false);
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (ConnectedChain?.id !== hardhat.id) {
    return null;
  }

  const isBalanceZero = balance && balance.value === 0n;

  return (
    <div
      className={
        !isBalanceZero
          ? "ml-1"
          : "ml-1 tooltip tooltip-bottom tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:right-0 before:bg-sky-500/90 before:text-black before:border before:border-sky-400/50 before:rounded-lg before:px-3 before:py-2 before:text-xs"
      }
      data-tip="Grab funds from faucet"
    >
      <button
        className="relative group px-4 py-2 bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/40 disabled:hover:border-sky-500/30"
        onClick={sendETH}
        disabled={loading}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 rounded-full blur transition-all duration-300"></div>

        {/* Button content */}
        <span className="relative flex items-center gap-2">
          {!loading ? (
            <>
              <BanknotesIcon className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
              Local Faucet
            </>
          ) : (
            <>
              {/* Custom loading spinner */}
              <svg
                className="animate-spin h-4 w-4 text-sky-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </>
          )}
        </span>

        {/* Animated indicator when not loading */}
        {!loading && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};
