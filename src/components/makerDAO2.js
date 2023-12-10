import React, { useEffect, useState } from "react";
import "../styles/MakerDao.css";

import MintTabs2 from "./MintTabs2";
import MintContent from "./MintContent";
import { useAccount, useChainId, useContractRead } from "wagmi";
import Web3 from 'web3';


import "./Style/MakerDao.css";
import { STAKING_ADDRESS, esbckgov, esbckgovtobckgov } from '../contract';
import esbckgovAbi from '../contract/esBCKGOV.json'; 
import bckEthAbi from '../contract/bckEth.json';
import stakingabi from '../contract/staking.json'
import { BCKGovemissions, bcktoeUSD } from '../contract';

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMYHTTPLINK));

// Import contract addresses and ABIs

const bckgovemissionsAbi = require('../contract/BCKgovemissions.json'); // Assuming this ABI works for both eUSD and BCK
const eusdtobckAbi = require('../contract/lsdfitobck.json'); 

export const MakerDAO2 = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [maxBCK, setMaxBCK] = useState("0");
  const [debtInVault, setDebtInVault] = useState("0");
  const [collateralAmount, setCollateralAmount] = useState("0");
  const [DiscountedAmount, setDiscountedAmount] = useState("0");
  const [interestEarned, setInterestEarned] = useState("0");
  const [bckGovEmissions, setBckGovEmissions] = useState("0");
  const [activeChain, setActiveChain] = useState("");
  const [claimableAmount, setClaimableAmount] = useState("");
  const [advancedclaimableAmount, setadvancedClaimableAmount] = useState("");

  const getChainName = (chainId) => {
    const chainMap = {
      1: "Mainnet",
      5: "Goerli",
      11155111: "Sapolia",
      80001: "Polygon"
    };
    return chainMap[chainId] || "Unknown";
  };

  const { data: bckMinted } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: bckGovStaked} = useContractRead({
    address: STAKING_ADDRESS,
    abi: stakingabi.abi,
    functionName: 'balances',
    args: [address],
  });

  const { data: eusdShares } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'shares',
    args: [address],
  });

  const { data: excessInterest } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'withdrawableExcessOf',
    args: [],
  });

  const { data: bckGovInterest } = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'withdrawableInterestOf',
    args: [address],
  });

  const {data: claimable} = useContractRead({
    address: esbckgovtobckgov,
    abi: esbckgovAbi.abi,
    functionName: 'getClaimableAmount',
    args: [address],
  });

  const {data: claimableadvanced} = useContractRead({
    address: esbckgovtobckgov,
    abi: esbckgovAbi.abi,
    functionName: 'UnlockedPrematurelyview',
    args: [address]
  });

   const { data: AmountofPurchasableEsBCKGOV } = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'DiscountedBCKGOVAmount',
  });

  const fetchClaimableAmount = async () => {
    try {

      setClaimableAmount(web3.utils.fromWei(claimable.toString(), 'ether'));
      setadvancedClaimableAmount(web3.utils.fromWei(claimableadvanced.toString(), 'ether'));
    } catch (error) {
      console.error("Error fetching claimable amount:", error);
    }
  };



  useEffect(() => {
    setActiveChain(getChainName(chainId));
    fetchClaimableAmount();


    if (bckMinted) {
      setMaxBCK(web3.utils.fromWei(bckMinted.toString(), 'ether'));
    }

    if (bckGovStaked) {
      setDebtInVault(web3.utils.fromWei(bckGovStaked.toString(), 'ether'));
    }

    if (eusdShares) {
      setCollateralAmount(web3.utils.fromWei(eusdShares.toString(), 'ether'));
      // Calculate interestEarned based on eusdShares and your business logic
    }
    if (excessInterest) {
      setInterestEarned(web3.utils.fromWei(excessInterest.toString(), 'ether'));
    }

    if (bckGovInterest) {
      setBckGovEmissions(web3.utils.fromWei(bckGovInterest.toString(), 'ether'));
    }

    if(AmountofPurchasableEsBCKGOV) {
      setDiscountedAmount(web3.utils.fromWei(AmountofPurchasableEsBCKGOV.toString(), 'ether'));
    }
  }, [bckMinted, excessInterest, bckGovInterest, bckGovStaked, eusdShares, chainId, AmountofPurchasableEsBCKGOV]);

  return (
    <>
     
        <div className="w-full max-w-[1449px] mx-auto ">
          <div className="row p-2">
            <div className="col-md-6">
              <div className="border-shadow mt-[50px]">
                <div className=" ">
                  <MintContent />
                </div>
                <div className="d-none d-md-block">
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-[50px]">
              <MintTabs2 />
            </div>
          </div>
          <div className="card-backgorund mt-4 mb-3 main-content-div">
            <div className="row">
              <div className="col-md-12 content-card">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between">
                      <div className="first-vault">
                        <p className="mb-3 font-of-bck">$esBCKGov Emission Stats</p>
                        <p className="copy-content-bound">
                          Bound Finance | Crypto-Side
                        </p>
                      </div>
                      <div className="second-vault">
                        <p>
                          Network :
                          <span className="content-goerli">
                            {" "}
                            {activeChain ? activeChain : "Connect Wallet"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vertical">
                  <div className="straight-line-makerDao"></div>
                </div>
                <div className="vertical d-none d-md-block">
                  <div className="vertical-straight-line"></div>
                </div>
                <div className="row mt-5">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between ">
                      <div className="maximum-bck">
                        BCKGov Emissions APY
                      </div>
                      <div className="value-maximum-bck d-flex justify-content-end">
                        {" "}
                        {`5.5%`}
                      </div>
                    </div>
                  </div>
                  <span className="straight-line-makerDao-two d-sm-block d-md-none"></span>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">Unlock All Claim Size</div>
                      <div className="value-maximum-bck"> {advancedclaimableAmount} $BCKGOV</div>
                    </div>
                  </div>
                </div>
                <div className="straight-line-makerDao-two"></div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">$BCKGov Staked</div>
                      <div className="value-maximum-bck">
                        {debtInVault ? `$${debtInVault} BCK` : "No debt"}
                      </div>
                    </div>
                  </div>
                  <span className="straight-line-makerDao-two d-sm-block d-md-none"></span>

                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">
                       Vested esBCKGOV you can claim
                      </div>
                      <div className="value-maximum-bck">
                        {" "}
                        {claimableAmount
                          ? `${claimableAmount} $BCKGOV`
                          : "No esBCKGov claimable"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="straight-line-makerDao-two"></div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">$BCKGov Emissions Earnt</div>
                      <div className="value-maximum-bck">  {bckGovEmissions ? `${bckGovEmissions} $BCKGov` : "No emissions earned"}</div>
                    </div>
                  </div>
                  <span className="straight-line-makerDao-two d-sm-block d-md-none"></span>

                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">Total $esBCKGOV Available to Buy</div>
                      <div className="value-maximum-bck">
                        {DiscountedAmount
                          ? `${DiscountedAmount} $esBCKGOV`
                          : "No more esBCKGOV To Buy"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </>
  );
};
