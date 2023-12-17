import React from "react";
import { BiSolidChevronsRight } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function MintContent() {
  return (
    <div className="max-w-[800px] mx-auto w-full space-y-5">
      <div className="text-32 font-mont font-bold mb-8">
        <p className="step-1">STEP II :</p>
        <div className="line-straight-bck"></div>
        <p className="mining fs-2">BCKGOV Savings Account</p>
      </div>
      <div className="list-disc text-15 font-mont space-y-7 mt-5">
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p className="text-white-100">
            Earn daily USDC and vested esBCKGOV by depositing BCKGOV in the BCKGOV Savings Account. This is also where Bound will offer limited APY boosts.
          </p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Unstake BCKGOV anytime without a lock-in period.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Monitor "esBCKGOV Interest Earnt" for total earnings.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Check your BCKGOV deposit size in the "Balance Of BCK in BCK Savings Account" card.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3 text-purple" />
          <p>Use "Withdraw Rewards" to claim your esBCKGOV and USDC rewards.</p>
        </div>

        <div className="flex justify-center items-center w-full">
          <Link to="/bckemissions" className="drop-shadow-xl hover:text-white BoxGradient-button mt-4">
            <div className="d-flex gap-3 justify-content-center">
              Step 3. <BiSolidChevronsRight className="mt-2 text-purple" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
