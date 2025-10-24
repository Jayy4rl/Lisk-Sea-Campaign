"use client";

// @refresh reset
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Address } from "viem";
import { useAutoConnect, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

/**
 * Custom Wagmi Connect Button (watch balance + custom design)
 */
export const RainbowKitCustomConnectButton = () => {
  useAutoConnect();
  const networkColor = useNetworkColor();
  const { targetNetwork } = useTargetNetwork();

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        const blockExplorerAddressLink = account
          ? getBlockExplorerAddressLink(targetNetwork, account.address)
          : undefined;

        return (
          <>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="relative group px-6 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/50 flex items-center gap-2"
                    onClick={openConnectModal}
                    type="button"
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-sky-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>

                    {/* Button content */}
                    <span className="relative flex items-center gap-2">
                      {/* Wallet icon */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Connect Wallet
                    </span>

                    {/* Shine effect */}
                    <span className="absolute inset-0 rounded-full overflow-hidden">
                      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                    </span>
                  </button>
                );
              }

              if (chain.unsupported || chain.id !== targetNetwork.id) {
                return <WrongNetworkDropdown />;
              }

              return (
                <>
                  <div className="flex flex-col items-center mr-1">
                    {/* Balance Display */}
                    <Balance
                      address={account.address as Address}
                      className="min-h-0 h-auto text-sky-300 font-semibold"
                    />

                    {/* Network Badge */}
                    <div className="relative group mt-1">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm transition-all duration-200"
                        style={{
                          backgroundColor: `${networkColor}15`,
                          borderColor: `${networkColor}40`,
                          color: networkColor,
                        }}
                      >
                        {/* Network indicator dot */}
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: networkColor }}
                          ></span>
                          {chain.name}
                        </span>
                      </div>

                      {/* Subtle glow effect */}
                      <div
                        className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity"
                        style={{ backgroundColor: networkColor }}
                      ></div>
                    </div>
                  </div>

                  <AddressInfoDropdown
                    address={account.address as Address}
                    displayName={account.displayName}
                    ensAvatar={account.ensAvatar}
                    blockExplorerAddressLink={blockExplorerAddressLink}
                  />
                  <AddressQRCodeModal address={account.address as Address} modalId="qrcode-modal" />
                </>
              );
            })()}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
