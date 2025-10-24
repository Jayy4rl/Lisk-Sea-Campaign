import { useRef, useState } from "react";
import { NetworkOptions } from "./NetworkOptions";
import CopyToClipboard from "react-copy-to-clipboard";
import { getAddress } from "viem";
import { Address, useDisconnect } from "wagmi";
import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { BlockieAvatar, isENS } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink,
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const checkSumAddress = getAddress(address);

  const [addressCopied, setAddressCopied] = useState(false);

  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute("open");
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <>
      <details ref={dropdownRef} className="dropdown dropdown-end leading-3">
        {/* Dropdown Toggle Button */}
        <summary
          tabIndex={0}
          className="relative group px-4 py-2 bg-black/40 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/50 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer hover:shadow-lg hover:shadow-sky-500/20"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 rounded-full blur transition-all duration-300"></div>

          {/* Button content */}
          <span className="relative flex items-center gap-2">
            {/* Avatar */}
            <div className="hidden lg:flex w-8 h-8 rounded-full overflow-hidden border-2 border-sky-500/30 group-hover:border-sky-400/50 transition-colors">
              <BlockieAvatar address={checkSumAddress} size={30} ensImage={ensAvatar} />
            </div>

            {/* Address Text */}
            <span className="text-sky-300 group-hover:text-sky-200 transition-colors">
              {isENS(displayName) ? displayName : checkSumAddress?.slice(0, 6) + "..." + checkSumAddress?.slice(-4)}
            </span>

            {/* Chevron Icon */}
            <ChevronDownIcon className="h-4 w-4 text-sky-400 group-hover:text-sky-300 transition-colors" />
          </span>
        </summary>

        {/* Dropdown Menu */}
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[2] p-3 mt-3 bg-black/95 backdrop-blur-xl border border-sky-500/30 rounded-2xl shadow-xl shadow-sky-500/10 min-w-[240px]"
        >
          <NetworkOptions hidden={!selectingNetwork} />

          {/* Copy Address */}
          <li className={selectingNetwork ? "hidden" : ""}>
            {addressCopied ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <CheckCircleIcon className="h-5 w-5 text-sky-400" aria-hidden="true" />
                <span className="whitespace-nowrap font-medium">Copied!</span>
              </div>
            ) : (
              <CopyToClipboard
                text={checkSumAddress}
                onCopy={() => {
                  setAddressCopied(true);
                  setTimeout(() => {
                    setAddressCopied(false);
                  }, 800);
                }}
              >
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 transition-all cursor-pointer group">
                  <DocumentDuplicateIcon className="h-5 w-5 text-sky-400 group-hover:text-sky-300" aria-hidden="true" />
                  <span className="whitespace-nowrap font-medium">Copy address</span>
                </div>
              </CopyToClipboard>
            )}
          </li>

          {/* View QR Code */}
          <li className={selectingNetwork ? "hidden" : ""}>
            <label
              htmlFor="qrcode-modal"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 transition-all cursor-pointer group"
            >
              <QrCodeIcon className="h-5 w-5 text-sky-400 group-hover:text-sky-300" />
              <span className="whitespace-nowrap font-medium">View QR Code</span>
            </label>
          </li>

          {/* View on Block Explorer */}
          <li className={selectingNetwork ? "hidden" : ""}>
            <button
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 transition-all group w-full text-left"
              type="button"
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-sky-400 group-hover:text-sky-300" />
              <a
                target="_blank"
                href={blockExplorerAddressLink}
                rel="noopener noreferrer"
                className="whitespace-nowrap font-medium"
              >
                View on Explorer
              </a>
            </button>
          </li>

          {/* Switch Network */}
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? "hidden" : ""}>
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 transition-all group w-full text-left"
                type="button"
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className="h-5 w-5 text-sky-400 group-hover:text-sky-300" />
                <span className="font-medium">Switch Network</span>
              </button>
            </li>
          ) : null}

          {/* Divider */}
          <div className={selectingNetwork ? "hidden" : "h-px bg-sky-500/20 my-2"}></div>

          {/* Disconnect */}
          <li className={selectingNetwork ? "hidden" : ""}>
            <button
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all group w-full text-left border border-transparent hover:border-red-500/30"
              type="button"
              onClick={() => disconnect()}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span className="font-medium">Disconnect</span>
            </button>
          </li>
        </ul>
      </details>
    </>
  );
};
