import React from "react";
import { BiSolidChevronsRight } from "react-icons/bi";

export default function MintContent() {
  return (
    <div className=" space-y-5 ">
      <p className="text-32 font-mont font-bold mb-8">
        <p className="step-1">STEP I :</p>
        <div className="line-straight-bck"></div>
        <p className="mining">DEPOSIT YIELD BEARING STABLETOKEN</p>
      </p>
      <div className="list-disc text-15 font-mont space-y-7 mt-5 ">
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p className="text-white-100">For the testnet, purchase some test yield bearing token (eUSD)</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>Then deposit your eUSD, This will Allow you to earn more cashback spending Limit</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>Whilst your eUSD is generating yields, you can mint $BCK 1:1 and spend this across other protocols. This is 0% interest, and $0 borrowing fees</p>
        </div>
        <div className="d-flex">
          <BiSolidChevronsRight className="mt-1 me-3" />
          <p>
            There is no liquidation's, this is because $BCK is a 1:1 mirror of eUSD, and other yield bearing stablecoins. You can use BCK as a normal stablecoin and spend it instead of your yield bearing stablecoins.
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
            Enjoy no post-loan interest. Earn your yields from your yield bearing stablecoin  as normal.
            </p>
        </div>
      </div>
    </div>
  );
}
