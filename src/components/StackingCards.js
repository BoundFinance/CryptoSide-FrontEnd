import React, { useState, useEffect } from "react";
import { useContractWrite, useContractRead, useAccount, useWaitForTransaction } from "wagmi";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import "./Style/StackingCards.css";
import BCKEARN from "./BCKSavings";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import contract addresses and ABIs
import { STAKING_ADDRESS, BCK_ADDRESS, BCKGovemissions, BCKgov } from '../contract';
import stakingAbi from '../contract/staking.json';
import bckEthAbi from '../contract/bckEth.json';


const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMYHTTPLINK));

const Spinner = () => (
  <div className="spinner">
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className="loader"></div>
    <p style={{ marginLeft: '10px' }}>Waiting for transaction to complete...</p>
  </div>
  </div>
);

const Spinnerapproval = () => (
  <div className="spinner">
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className="loader"></div>
    <p style={{ marginLeft: '10px' }}>Waiting for approval to complete...</p>
  </div>
  </div>
);


export default function StackingCards() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [inputRangeValue, setInputRangeValue] = useState(0);
  const [inputRangeValueUnStake, setInputRangeValueUnStake] = useState(0);
  const [withdrawableInterest, setWithdrawableInterest] = useState(0);
  const [totalDistributions, setTotalDistributions] = useState(null);
  const [totalDeposits, setTotalDeposits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bckGovEmissions, setBckGovEmissions] = useState("0");
  const [DepositedBCK, setDepositedBCK] = useState("0");
  const [depositCalled, setDepositCalled] = useState(false);
  const loadingToastId = React.useRef(null);
  const [depositSuccessShown, setDepositSuccessShown] = useState(false);
  const [errorSuccessShown, seterrorSuccessShown] = useState(false);
  const [exitSuccessShown, setexitSuccessShown] = useState(false);
  const [withdrawSuccessShown, setwithdrawSuccessShown] = useState(false);
  const [errormessage, seterrormessage] = useState(false);
  const { address } = useAccount();
 

 

  const { write: depositBCK, data: depositData , error: depositError } = useContractWrite({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'depositBCK',
    args: [stakeAmount ? web3.utils.toWei(stakeAmount.toString(), 'ether') : '0'],
  });


  const { write: withdrawBCK, data: withdrawData,  error: withdrawError } = useContractWrite({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'withdrawBCK',
    args: [unstakeAmount ? web3.utils.toWei(unstakeAmount.toString(), 'ether') : '0'],
  });

  const { write: withdrawInterests, data: InterestData,  error: InterestError } = useContractWrite({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'withdrawInterest',
  });

  const { write: approveBCK, data: approveData, error: approveError } = useContractWrite({
    address: BCKgov,
    abi: bckEthAbi.abi,
    functionName: 'approve',
    args: [STAKING_ADDRESS, stakeAmount ? web3.utils.toWei(stakeAmount.toString(), 'ether') : '0'],
  });

  const {status: success, error: error1 } = useWaitForTransaction({
    hash: depositData?.hash,
    confirmations: 2, // Wait for one confirmation
  });

  const {status: success2, error: error2 } = useWaitForTransaction({
    hash: withdrawData?.hash,
    confirmations: 2, // Wait for one confirmation
  });

  const {status: success3, error: error3 } = useWaitForTransaction({
    hash: InterestData?.hash,
    confirmations: 2, // Wait for one confirmation
  });

  const {status: success4, error: error4 } = useWaitForTransaction({
    hash: approveData?.hash,
    confirmations: 1, // Wait for one confirmation
  });




  const { data: bckBalance } = useContractRead({
    address: BCKgov,
    abi: bckEthAbi.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: depositedBCK } = useContractRead({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'balances',
    args: [address],
  });

  const { data: excessInterest } = useContractRead({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'excessBCKGOVTest',
    args: [address],
  });

  const { data: totalDeposit } = useContractRead({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'totalDeposits',
  });

  const { data: totalDistribute } = useContractRead({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'totalDistributed',
  });

  const handleStakeInputChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setStakeAmount(newValue);
      setInputRangeValue(newValue);
    } else {
      setStakeAmount("");
      setInputRangeValue(0);
    }
  };

  const handleUnstakeInputChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setUnstakeAmount(newValue);
      setInputRangeValueUnStake(newValue);
    } else {
      setUnstakeAmount("");
      setInputRangeValueUnStake(0);
    }
  };

  const handleMaxStakeClick = () => {
    const maxAmount = bckBalance ? web3.utils.fromWei(bckBalance.toString(), 'ether') : '0';
    setStakeAmount(maxAmount);
    setInputRangeValue(parseFloat(maxAmount));
  };

  const handleMaxUnstakeClick = () => {
    const maxAmount = depositedBCK ? web3.utils.fromWei(depositedBCK.toString(), 'ether') : '0';
    setUnstakeAmount(maxAmount);
    setInputRangeValueUnStake(parseFloat(maxAmount));
  };


  const fetchData = async () => {
    try {

      const totalDeposited = web3.utils.fromWei(totalDeposit?.toString() || '0', 'ether');
      const totalDistribution = web3.utils.fromWei(totalDistribute?.toString() || '0', 'ether');
      // Fetching total deposited assets

      setTotalDistributions(totalDistribution);
      setTotalDeposits(totalDeposited);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  
  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error("You can't deposit 0 $BCKGOV.");
      return;
    }
  
    if ((bckBalance ? web3.utils.fromWei(bckBalance.toString(), 'ether') : '0') < stakeAmount)  {
      toast.error("Your $BCKGov Balance is too low to deposit this amount.");
      return;
    }
  
    setIsLoading(true);
     toast.dismiss(loadingToastId.current);
    loadingToastId.current = toast.info(<Spinnerapproval />, { autoClose: false });
  
    try {
      approveBCK(); // Assuming this returns a promise
      setDepositSuccessShown(false);
      setDepositCalled(false)

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };

  const handleUnstake = () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast.error("You can't deposit 0 $BCKGov.");
      return;
    }

    if( (depositedBCK ? web3.utils.fromWei(depositedBCK.toString(), 'ether') : '0') < unstakeAmount)  {
      toast.error("You don't have that much $BCKGOV to withdraw.");
      return;
    }
  
    setIsLoading(true);
     toast.dismiss(loadingToastId.current);
    loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
  
    try {
      withdrawBCK(); // Assuming this returns a promise
      setDepositSuccessShown(false);
   
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };

  const handleWithdrawInterest = () => {
    if (parseFloat(withdrawableInterest) <= 0) {
      toast.error("You Have No Interest To Withdraw");
    } else {
      try {
         toast.dismiss(loadingToastId.current);
        loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
        withdrawInterests(); // Assuming this returns a promise
        setDepositSuccessShown(false);
      
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        toast.dismiss(loadingToastId.current);
        toast.error(error.message || "Transaction failed. Please try again.");
      }
    }
  };

  
  useEffect(() => {
    if (success4 ==="success" && !depositCalled) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
      depositBCK();
      setDepositCalled(true); 
    } else if (success === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("successfully deposited $BCKGov!");
      setDepositSuccessShown(true);
    } else if (success2 === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("successfully Withdrawn $BCKGov!");
      setDepositSuccessShown(true);
    } else if (success3 === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("successfully Withdrawn Interest!");
      setDepositSuccessShown(true);
    }
  
    const errors = [error1, error2, error3, error4, depositError, withdrawError, approveError, InterestError];
    const errorMessage = errors.find(error => error && !errorSuccessShown);
    if (errorMessage) {
      console.error("Transaction error:", errorMessage);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(errorMessage.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
       // Assuming you still need this state
    }
  }, [
    success, success2, success3, success4, depositBCK, depositCalled, 
    error1, error2, error3, error4, 
    depositError, withdrawError, approveError, InterestError, 
    depositSuccessShown, errorSuccessShown
  ]);
  

  useEffect(() => {
    // Reset the flag when the component is ready for a new transaction
    if (!success && !success2 && !success3 && !success4 && !error1 && !error2 && !error3) {
      setDepositSuccessShown(false);
      seterrorSuccessShown(false);
    }
  }, [success, success2, success3, success4, error1, error2, error3, error4]);

  useEffect(() => {
    if (bckBalance) {
      const balanceFormatted = web3.utils.fromWei(bckBalance.toString(), 'ether');
      setInputRangeValue(Number(balanceFormatted).toFixed(2));
    }
    if (depositedBCK) {
      const depositedFormatted = web3.utils.fromWei(depositedBCK.toString(), 'ether');
      setDepositedBCK(Number(depositedFormatted).toFixed(2));
    }
    if (excessInterest) {
      const excessInterestString = String(excessInterest);
      const cleanedExcessInterest = excessInterestString.startsWith(',,') 
        ? excessInterestString.substring(2) 
        : excessInterestString;
      const numericValue = Number(cleanedExcessInterest);
      const withdrawableFormatted = web3.utils.fromWei(numericValue.toString(), 'ether');
      setWithdrawableInterest(Number(withdrawableFormatted).toFixed(2));
    }
  }, [bckBalance, depositedBCK, excessInterest]);
  

  // Calculate interest rate when data changes
  useEffect(() => {
    fetchData();
    if (totalDeposits && totalDistributions) {
      const dailyInterestRate = totalDistributions / (totalDeposits);
      const annualizedRate = dailyInterestRate * (365) * (100);
      const rounded = annualizedRate.toFixed(2);
      setBckGovEmissions(rounded.toString());
    }
  }, [totalDeposits, totalDistributions]);

  return (
    <div className="grid grid-cols-1 w-full max-w-[1449px] mt-[10px] gap-4 mx-auto p-4 md:grid-cols-2">
      <div className="w-full max-w-[700px] mx-auto">
        <div className="border-shadow p-5 ">
          <BCKEARN />
          {/* Additional content can be added here if needed */}
        </div>
        <div className="border-shadow mt-2 p-4">
          <div className="d-flex justify-content-between align-item-center">
            <div className="">
              <p className="text-14">BCKGOV Savings Account Balance</p>
            </div>
            <div className="">
              <p className="text-end font-bold text-13 font-bold font-Helvetica">
                ${DepositedBCK} BCKGOV
              </p>
            </div>
          </div>
          <div className="straight-line mt-4 mb-4"></div>
          <div className="d-flex justify-content-between align-item-center">
            <div className="">
              <p  className="text-14">esBCKGOV Interest Earnt</p>
            </div>
            <div className="">
              <p className="text-end font-bold text-13 font-bold font-Helvetica">
                {withdrawableInterest}
              </p>
            </div>
          </div>
          <div className="straight-line mt-4 mb-4"></div>
          <div className="d-flex justify-content-between align-item-center">
            <div className="">
              <p className="text-14">esBCKGOV Interest Rate</p>
            </div>
            <div className="">
              <p className="text-end font-bold text-14 font-bold font-Helvetica">
                {bckGovEmissions} %
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <div className="w-full max-w-[700px] mx-auto d-flex">
        <div className="card-backgorund p-4 w-full flex flex-col ">
          <p className="text-24 font-bold font-mont bck-color">BCKGov Savings Account</p>
          <div className="w-full mt-3 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-16 font-medium mb-3 ">Stake BCKGov Stablecoin ($):</p>
              <div className="flex">
                <input
                  type="number"
                  onChange={handleStakeInputChange}
                  className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
                  placeholder={`Balance of $BCK in user's wallet: $${bckBalance ? web3.utils.fromWei(bckBalance.toString(), 'ether') : '0'} BCK`}
                  value={stakeAmount}
                />
                <button
                  onClick={handleMaxStakeClick}
                  className="ml-2 drop-shadow-xl max-btn"
                >
                  Max
                </button>
              </div>
            
              <button
              onClick={handleStake}
              disabled={isLoading}
              className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-3"
              > deposit
            </button>
            </div>
            <div className="flex flex-col gap-1 mt-3">
              <p className="text-16 font-medium mb-2">Unstake BCKGov Stablecoin ($):</p>
              <div className="flex">
                <input
                  type="number"
                  onChange={handleUnstakeInputChange}
                  className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
                  placeholder={`Deposited Amount : $${depositedBCK ? web3.utils.fromWei(depositedBCK.toString(), 'ether') : '0'} BCK`}
                  value={unstakeAmount}
                />
                <button
                  onClick={handleMaxUnstakeClick}
                  className="ml-2 drop-shadow-xl max-btn"
                >
                  Max
                </button>
              </div>
          
              <button
                onClick={handleUnstake}
                className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-3"
              >
                Unstake
              </button>
            </div>
            <div className="w-full max-w-[700px] mx-auto d-flex gap-2 mt-6">
            
            <button
          onClick={handleWithdrawInterest}
          className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-3"
        >
          Withdraw esBCKGOV Interest
        </button>
            {/* Additional buttons or functionalities can be added here if needed */}
          </div>
          
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};  
