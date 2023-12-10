import React, { useEffect, useState } from "react";
import { useContractRead, useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { BiSolidChevronsRight } from "react-icons/bi";
import "./Style/BCKETHcreationinfo.css";

import { BCKtoEUSD, EUSDtoBCK, BCKGovemissions } from '../contract';
import bcktoEusdAbi from '../contract/bcktoEusd.json';
import eusdtobckAbi from '../contract/eusdtobck.json';
import bckGovemissionsAbi from '../contract/BCKgovemissions.json';
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMYHTTPLINK));

  const [bckMinted, setBckMinted] = useState("Loading...");
  const [bckGovStaked, setBckGovStaked] = useState("Loading...");
  const [eusdDeposited, setEusdDeposited] = useState("Loading...");
  const { address } = useAccount();

  const { data: bckMintedBalance } = useContractRead({
    address: BCKtoEUSD,
    abi: bcktoEusdAbi.abi,
    functionName: 'balance',
    args: [address],
  });

  const { data: bckGovStakedBalance } = useContractRead({
    address: BCKGovemissions,
    abi: bckGovemissionsAbi.abi,
    functionName: 'balances',
    args: [address],
  });

  const { data: eusdShares } = useContractRead({
    address: EUSDtoBCK,
    abi: eusdtobckAbi.abi,
    functionName: 'share',
    args: [address],
  });

  useEffect(() => {
    if (bckMintedBalance) {
      setBckMinted(parseFloat(web3.utils.fromWei(bckMintedBalance.toString(), 'ether')).toFixed(4));
    }
    if (bckGovStakedBalance) {
      setBckGovStaked(parseFloat(web3.utils.fromWei(bckGovStakedBalance.toString(), 'ether')).toFixed(4));
    }
    if (eusdShares) {
      setEusdDeposited(parseFloat(web3.utils.fromWei(eusdShares.toString(), 'ether')).toFixed(4));
    }
  }, [bckMintedBalance, bckGovStakedBalance, eusdShares]);

  return (
    <div className="w-full max-w-[1449px] p-6 mt-[10px] mx-auto gap-5 grid grid-cols-1 lg:grid-cols-2">
      <div className="border-shadow border-for-content max-h-[650px]">
       

        <div className="d-none d-md-block">
          <div className="flex justify-center items-center w-full">
          </div>
          <p className="lock text-24 font-mont text-center">
            <span className="next-step">Next Step</span>: Put your minted BCK into the BCK savings account for more yields.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto">
        <div className="d-md-none">
          <div className="flex justify-center items-center w-full">
            <Link
              to="/loan"
              className="BoxGradient-button drop-shadow-xl hover:text-white "
            >
              <div className="d-flex gap-4 justify-content-center">
                Step 2 <BiSolidChevronsRight className="arrow" />
              </div>
            </Link>
          </div>
          <p className="lock text-24 font-mont text-center mt-2 mb-4">
            <span className="next-step">Next Step</span>: Lock your BCKETH in
            your CDP.
          </p>
        </div>
        <div className="">
          <div className="card-background-down">
            <div className="d-flex justify-content-between">
              <div className="">
                <p className="withdrawable">How much $eUSD have i submitted ?</p>
              </div>
              <div className="">
               
              </div>
            </div>
            <div className="row mt-4 mb-4">
              <div className="col-md-6">
                <div className="straight-lines"></div>
              </div>
              <div className="col-md-6">
                <div className="straight-lines"></div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="">
                <p className="withdrawable">
                  $BCKGov emissions earnt
                </p>
              </div>
              <div className="">
                <p className="withdrawable font-bold text-center">
                  {} ETH
                </p>
              </div>
            </div>
            <div className="row mt-4 mb-4">
              <div className="col-md-6">
                <div className="straight-lines"></div>
              </div>
              <div className="col-md-6">
                <div className="straight-lines"></div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="">
                <p className="withdrawable">value of $BCKGov Staked</p>
              </div>
              <div className=" ">
                <p className=" font-bold text-center withdrawable">
                  {} $eUSD
                </p>
              </div>
            </div>
            <div className="row mt-4 mb-4">
              <div className="col-md-6">
                <div className="straight-lines"></div>
              </div>
              <div className="col-md-6">
                <div className="straight-lines"></div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="">
                <p className="withdrawable">Excess $eUSD earnt whilst in vault</p>
              </div>
              <div className=" ">
                <p className=" font-bold text-center withdrawable">
                  {} $eUSD
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


export default BCKETHTabs;
