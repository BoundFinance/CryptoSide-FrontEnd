import React from "react";
import { BiSolidChevronsRight } from "react-icons/bi";
import { Link } from "react-router-dom";
export default function MintContent() {
  return (
    <div className=" max-w-[800px] mx-auto w-full space-y-5">
      <p className="text-32 font-mont font-bold mb-8">
        <p className="step-1">STEP II :</p>
        <div className="line-straight-bck"></div>
        <p className="mining fs-2">BCK Savings Account</p>
      </p>
      <div className="list-disc text-15 font-mont space-y-7 mt-5 ">
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p className="text-white-100">
            Deposit BCK to earn daily USDC interest.
          </p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p> There's no lock-in; unstake BCK anytime.</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>View your USDC earnings under "USDC Interest Earned".</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>
            Check BCK deposits in the "Balance Of BCK in BCK Savings Account"
            card.
          </p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>Click "Withdraw Rewards" to claim USDC.</p>
        </div>

        <div className="flex justify-center items-center w-full">
                    <Link
                      to="/bckemissions"
                      className=" drop-shadow-xl hover:text-white  BoxGradient-button mt-4"
                    >
                      <div className="d-flex gap-3 justify-content-center">
                        Step 3. <BiSolidChevronsRight className="mt-2" />
                      </div>
                    </Link>
                  </div>
      </div>
    </div>
  );
}
