import React from "react";
import { BiSolidChevronsRight } from "react-icons/bi";

export default function MintContent() {
  return (
    <div className=" space-y-5 ">
      <p className="text-32 font-mont font-bold mb-8">
        <p className="step-1">STEP I :</p>
        <div className="line-straight-bck"></div>
        <p className="mining">Mint BCK</p>
      </p>
      <div className="list-disc text-15 font-mont space-y-7 mt-5 ">
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p className="text-white-100">Mint BCKETH in the BCKETH tab.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p> Lock BCKETH in the CDP page; it converts to BETH.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>Mint BCK, maintaining safe collateral limits.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>
            Adjust BCK with "Pay Back BCK" or take out BCKETH. Mind the
            collateral ratio.
          </p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>Check the Safe tab for liquidation alerts.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 arrorw" />
          <p>
            {" "}
            Enjoy no post-loan interest. Earn ETH periodically and withdraw in
            the Collateral Interest tab.
          </p>
        </div>
      </div>
    </div>
  );
}
