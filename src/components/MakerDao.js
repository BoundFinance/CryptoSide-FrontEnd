import React, { useEffect, useState, useCallback } from "react";
import "../styles/MakerDao.css";

import MintTabs from "./MintTabs";
import MintContent from "./MintContent";
import { Link } from "react-router-dom";
import { BiSolidChevronsRight } from "react-icons/bi";
import { useAccount, useChainId, useContractRead, useContractEvent } from "wagmi";
import { ethers } from 'ethers';
import "./Style/MakerDao.css";

// Import contract addresses and ABIs
import { bcktoeUSD, BCKGovemissions,  eUSD } from '../contract';
const bckgovemissionsAbi = require('../contract/BCKgovemissions.json'); // Assuming this ABI works for both eUSD and BCK
const eusdtobckAbi = require('../contract/lsdfitobck.json'); 
const bckEthAbi = require('../contract/bckEth.json');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMYHTTPLINK));

export const MakerDao = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [maxBCK, setMaxBCK] = useState("0");
  const [debtInVault, setDebtInVault] = useState("0");
  const [collateralAmount, setCollateralAmount] = useState("0");
  const [interestEarned, setInterestEarned] = useState("0");
  const [bckGovEmissions, setBckGovEmissions] = useState("0");
  const [activeChain, setActiveChain] = useState("");
  const [latestDistribution, setLatestDistribution] = useState(null);
  const [totalDistributions, setTotalDistributions] = useState(null);
  const [totalDeposits, setTotalDeposits] = useState(null);

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
    functionName: 'balance',
    args: [address],
  });

  const { data: eUSDbalance } = useContractRead({
    address: eUSD,
    abi: bckEthAbi.abi,
    functionName: 'balanceOf',
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
    args: [address],
  });

 

  const { data: bckGovInterest } = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'excessBCKGOVTest',
    args: [address],
  });


  const fetchData = async () => {
    try {
      const provider =  new ethers.JsonRpcProvider(process.env.REACT_APP_ALCHEMYHTTPLINK);
      const contract = new ethers.Contract(bcktoeUSD, eusdtobckAbi.abi, provider);

      // Fetching total distributions
      const oneDayAgo = (Date.now() / 1000) - 86400; // 24 hours ago in seconds
      const currentBlock = await provider.getBlockNumber();
      const oneDayAgoBlock = await provider.getBlock(oneDayAgo);
      const events = await contract.queryFilter(
        contract.filters.DistributedToReserve(), 
        oneDayAgoBlock.number, 
        currentBlock
      );
      const totalDistribution = events.reduce((acc, event) => acc.add(event.args.amount), 0);

      // Fetching total deposited assets
      const totalDeposited = await contract.totalDepositedAsset();

      setTotalDistributions(totalDistribution);
      setTotalDeposits(totalDeposited);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Calculate interest rate when data changes
  useEffect(() => {
    if (totalDeposits && totalDistributions) {
      const dailyInterestRate = totalDistributions / (totalDeposits);
      const annualizedRate = dailyInterestRate.mul(365).mul(100);
      setBckGovEmissions(web3.utils.fromWei(annualizedRate.toString(), 'ether'));
    }
  }, [totalDeposits, totalDistributions]);

  // Schedule the fetch task to run daily at 1 PM UTC
  useEffect(() => {
    const now = new Date();
    const nextRun = new Date();
    nextRun.setUTCHours(13, 0, 0, 0); // Set to 1 PM UTC
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1); // Schedule for next day if the time is past for today
    }
    const msUntilNextRun = nextRun.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      fetchData(); // Run the first fetch
      setInterval(fetchData, 24 * 60 * 60 * 1000); // Then run it every 24 hours
    }, msUntilNextRun);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);


  useEffect(() => {
    setActiveChain(getChainName(chainId));

    if (bckMinted) {
      setMaxBCK(web3.utils.fromWei(bckMinted.toString(), 'ether'));
    }

    if (eUSDbalance) {
      setDebtInVault(web3.utils.fromWei(eUSDbalance.toString(), 'ether'));
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
  }, [bckMinted, excessInterest, bckGovInterest, eUSDbalance, eusdShares, chainId]);

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
                  <div className="flex justify-center items-center w-full">
                    <Link
                      to="/staking"
                      className=" drop-shadow-xl hover:text-white  BoxGradient-button mt-4"
                    >
                      <div className="d-flex gap-3 justify-content-center">
                        Step 2. <BiSolidChevronsRight className="mt-2" />
                      </div>
                    </Link>
                  </div>
                  <p
                    className=" font-mont text-center p-for-next-step"
                    style={{ fontSize: "20px" }}
                  >
                    <span className="next-step ">NEXT STEP </span>: Deposit BCK
                    in the savings account for USDC yield.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-[50px]">
              <MintTabs />
            </div>
          </div>
          <div className="card-backgorund mt-4 mb-3 main-content-div">
            <div className="row">
              <div className="col-md-12 content-card">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between">
                      <div className="first-vault">
                        <p className="mb-3 font-of-bck">Vault $eUSD - BCK</p>
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
                        BCK Minted
                      </div>
                      <div className="value-maximum-bck d-flex justify-content-end">
                        {" "}
                        {maxBCK ? `$${maxBCK} BCK` : "No collateral in vault"}
                      </div>
                    </div>
                  </div>
                  <span className="straight-line-makerDao-two d-sm-block d-md-none"></span>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">Collateral Ratio</div>
                      <div className="value-maximum-bck">200%</div>
                    </div>
                  </div>
                </div>
                <div className="straight-line-makerDao-two"></div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">Balance Of $eUSD in my wallet</div>
                      <div className="value-maximum-bck">
                        {debtInVault ? `$${debtInVault} $eUSD` : "No debt"}
                      </div>
                    </div>
                  </div>
                  <span className="straight-line-makerDao-two d-sm-block d-md-none"></span>

                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">
                      $eUSD collateral ive submitted in vault
                      </div>
                      <div className="value-maximum-bck">
                        {" "}
                        {collateralAmount
                          ? `${collateralAmount}  $eUSD`
                          : "No collateral"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="straight-line-makerDao-two"></div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">$eUSD Interest Rate Whilst in Vault</div>
                      <div className="value-maximum-bck">  {bckGovEmissions ? `${bckGovEmissions} %` : "No emissions earned"}</div>
                    </div>
                  </div>
                  <span className="straight-line-makerDao-two d-sm-block d-md-none"></span>

                  <div className="col-md-6">
                    <div className="d-flex justify-content-between">
                      <div className="maximum-bck">Withdrawable $eUSD Interest</div>
                      <div className="value-maximum-bck">
                        {interestEarned
                          ? `${interestEarned} $eUSD`
                          : "No interest earned"}
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
