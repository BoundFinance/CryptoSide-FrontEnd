import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import img1 from "../../src/assests/images/token illustration.png";
import "./Style/HomePage.css";
import { eUSD, bcktoeUSD } from '../contract';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';


const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMYHTTPLINK));


const bckEthAbi = require('../contract/bckEth.json'); // ABI for eUSD
const eusdtobckAbi = require('../contract/lsdfitobck.json'); // Contract ABI for bcktoeUSD

const DisplaySystemInfo = () => {
  const [eUsdBalance, setEUsdBalance] = useState("0");
  const [bckMinted, setBckMinted] = useState("0");
  const [distributedYields, setDistributedYields] = useState("0");

  const refetchData = () => {
    refetchEUsdBalance();
    refetchBckMintedAmount();
    refetchDistributed();
  };



  const { data: eUsdBalanceWeiData, refetch: refetchEUsdBalance } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'totalDepositedAsset',
  });

  const { data: bckMintedAmountData, refetch: refetchBckMintedAmount} = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'bckMinted',
  });

  const { data: distributedData, refetch: refetchDistributed } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'cashbackappshare',
  });

  const toWeiSafe = (amount) => {
    return amount ? web3.utils.toWei(amount, 'ether') : '0';
  };


  useEffect(() => {
    if (eUsdBalanceWeiData) {
      const balance = web3.utils.fromWei(eUsdBalanceWeiData.toString(), 'ether');
      setEUsdBalance(Number(balance).toFixed(2));
    }
    if (bckMintedAmountData) {
      const minted = web3.utils.fromWei(bckMintedAmountData.toString(), 'ether');
      setBckMinted(Number(minted).toFixed(2));
    }
    if (distributedData) {
      const yields = web3.utils.fromWei(distributedData.toString(), 'ether');
      setDistributedYields(Number(yields).toFixed(2));
    }
  }, [eUsdBalanceWeiData, bckMintedAmountData, distributedData]);
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchData();
    }, 3000); // 5 minutes interval

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="container mb-5">
        <div className="row">
          <div className="col-md-4 order-1 content-home-bound">
            <p className="bound-home m-0">Bound</p>
            <p className="finance m-0">Finance</p>
            <div className="line-straight-position">
              <div className="line-straight"></div>
            </div>
            <p className="crypto m-0"> Crypto Side</p>
            <Link to="/loan" className="order-3 btn-get d-none d-md-block">
              <div className="btn-started">GET STARTED</div>
            </Link>
          </div>
          <div className="col-md-8 order-2 order-md-2">
            <img src={img1} alt="" className="" />
          </div>
          <div className="mobile-rsponsi d-md-none order-3">
            <Link to="/loan" className=" btn-get-two mt-3 mb-3 ">
              <div className="btn-started">GET STARTED</div>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <p className="system">System Information</p>
            <div className="line-straight-two"></div>
          </div>
        </div>

        <div className="d-flex justify-content-evenly align-item-center mt-5 boxes-content">
          <div className="d-none d-md-block">
            <div className={`${eUsdBalance !== "N/A" ? "boxes-for-dynamic-first" : "gradient-color boxes"}`}>
              <span className="test-eth">{eUsdBalance} eUSD</span>
            </div>
            <div className="total-interest-second">
              <p className="bcketh">Raw Collateral for BCK</p>
            </div>
          </div>
          <div className="d-md-none ">
            <div className={`${eUsdBalance !== "N/A" ? "boxes-for-dynamic-first" : "gradient-color boxes"}`}>
              <span className="test-eth">{eUsdBalance} eUSD</span>
            </div>
            <div className="total-interest-second">
              <p className="bcketh">Raw Collateral for BCK</p>
            </div>
          </div>
          <div className="">
            <div className={`${bckMinted !== "N/A" ? "boxes-for-dynamic-second" : "gradient-color boxes"}`}>
              <span className="test-eth text-light">{bckMinted} BCK</span>
            </div>
            <div className="total-interest-second">
              <p className="bcketh">Total BCK Minted</p>
            </div>
          </div>
          <div className="">
            <div className={`${distributedYields !== "N/A" ? "boxes-for-dynamic" : "gradient-color boxes"}`}>
              <span className="test-eth"> {distributedYields} BCK</span>
            </div>
            <div className="total-interest-second">
              <p className="bcketh">Distributed for Cashback</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default DisplaySystemInfo;
