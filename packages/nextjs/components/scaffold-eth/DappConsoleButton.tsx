"use client";

/**
 * FaucetButton button which lets you grab eth.
 */
export const DappConsoleButton = () => {
  const openSuperchainFaucet = () => {
    window.open("https://console.optimism.io/?utm_source=scaffoldop", "_blank");
  };

  return (
    <div className="ml-1" data-tip="Enter Dapp Developer Console">
      <button
        className="relative group px-4 py-2 bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 text-sky-300 hover:text-sky-200 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/20"
        onClick={() => openSuperchainFaucet()}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 rounded-full blur transition-all duration-300"></div>

        {/* Button content */}
        <span className="relative flex items-center gap-2">
          <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          Dapp Console
        </span>

        {/* Animated dot indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </span>
      </button>
    </div>
  );
};
