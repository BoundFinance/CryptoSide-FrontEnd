import { useWeb3Modal } from "@web3modal/react";
import React from "react";
import { useAccount } from "wagmi";
import { conciseAddress } from "../utils/helper";

export default function WalletConnect() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();

  

  return (
    <div>
      <button
        id="connect"
        onClick={open}
        className="btn-gradient rounded-md font-dm-sans font-semibold text-14 text-white w-[140px] py-2"
        // onMouseEnter={() => setHover(true)}
        // onMouseLeave={() => setHover(false)}
      >
      {address ? "Connected" : "Connect Wallet"}
      </button>
      {/* {address && <p> conciseAddress(address) </p>} */}
    </div>
  );
}
