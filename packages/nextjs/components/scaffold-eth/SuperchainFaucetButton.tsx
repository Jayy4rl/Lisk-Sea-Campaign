"use client";

import Image from "next/image";
import opLogo from "../assets/optimism_logo.png";

/**
 * FaucetButton button which lets you grab eth.
 */
export const SuperchainFaucetButton = () => {
  const openSuperchainFaucet = () => {
    window.open("https://console.optimism.io/faucet", "_blank");
  };

  return (
    <div className="ml-1" data-tip="Grab funds from Superchain faucet">
      <button
        className="relative group px-4 py-2 bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/20"
        onClick={() => openSuperchainFaucet()}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 rounded-full blur transition-all duration-300"></div>

        {/* Button content */}
        <span className="relative flex items-center gap-2">
          {/* Optimism Logo with glow */}
          <span className="relative flex items-center justify-center w-5 h-5">
            <span className="absolute inset-0 bg-red-500/20 rounded-full blur-sm group-hover:bg-red-500/30 transition-all"></span>
            <Image alt="Optimism Logo" src={opLogo.src} width={20} height={20} className="relative z-10" />
          </span>
          Superchain Faucet
        </span>

        {/* Corner accent */}
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-sky-400/50 rounded-full group-hover:bg-sky-400 transition-colors"></span>
      </button>
    </div>
  );
};
