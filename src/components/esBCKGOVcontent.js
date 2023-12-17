import React from "react";
import { BiSolidChevronsRight } from "react-icons/bi";

export default function MintContent() {
  return (
    <div className="space-y-5">
      <div className="text-32 font-mont font-bold mb-8">
        <p className="step-1">STEP III :</p>
        <div className="line-straight-bck"></div>
        <p className="mining">esBCKGOV Emissions + Vesting</p>
      </div>
      <div className="list-disc text-15 font-mont space-y-7 mt-5">
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p className="text-white-100">Stake 2.5% of your eUSD in BCKGOV to qualify for esBCKGOV emissions.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Maintain this stake to earn 5.5% APY on your eUSD.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>If you don't maintain the 2.5% stake, unclaimed emissions will be burnt and sold.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Check the Safe tab to monitor your 2.5% stake status.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Buy unclaimed esBCKGOV emissions at a discount in the Safety tab.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Vest esBCKGOV emissions over 25 days or unlock them early with a penalty.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Boost your total APY to 3.9% by combining base APY, cashback, and BCKGOV emissions.</p>
        </div>
      </div>
    </div>
  );
}


