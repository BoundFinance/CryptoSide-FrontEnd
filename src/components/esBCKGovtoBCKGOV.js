import React, { useState, useEffect } from "react";
import { useContractWrite, useContractRead, useAccount, useWaitForTransaction} from "wagmi";
import { esbckgov, esbckgovtobckgov } from '../contract';
import esbckgovAbi from '../contract/esBCKGOV.json'; 
import bckEthAbi from '../contract/bckEth.json';
import "./Style/BCKETHcreationinfo.css";
import 'react-input-range/lib/css/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider);

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




export default function VestBCKGOV() {
  const [depositAmount, setDepositAmount] = useState("");
  const [claimableAmount, setClaimableAmount] = useState("");
  const [depositCalled, setDepositCalled] = useState(false);
  const [depositSuccessShown, setDepositSuccessShown] = useState(false);
  const [errormessage, seterrormessage] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);

  const loadingToastId = React.useRef(null);
  const { address } = useAccount();

  const {write: esbckgovApprove, data: approveData, error: approveError} = useContractWrite({
    address: esbckgov,
    abi: bckEthAbi.abi,
    functionName: 'approve',
    args: [esbckgovtobckgov, depositAmount ? web3.utils.toWei(depositAmount) : '0'],
  });

  const {write: vestingContract, data: vestingData, error: vestingError} = useContractWrite({
    address: esbckgovtobckgov,
    abi: esbckgovAbi.abi,
    functionName: 'deposit',
    args: [depositAmount ? web3.utils.toWei(depositAmount) : '0'],
  });

  const {write: claimContract, data: claimData, error: claimError} = useContractWrite({
    address: esbckgovtobckgov,
    abi: esbckgovAbi.abi,
    functionName: 'claim',
    args: [address],
  });

  const {write: unlockAllContract, data: unlockAllContractData, error: unlockAllError } = useContractWrite({
    address: esbckgovtobckgov,
    abi: esbckgovAbi.abi,
    functionName: 'unlockPrematurely'
  });

  
  const { data: claimable } = useContractRead({
    address: esbckgovtobckgov,
    abi: esbckgovAbi.abi,
    functionName: 'getClaimableAmount',
    args: [address],
  });

  const {data: balanceesBCKGOV} = useContractRead({
    address: esbckgov,
    abi: bckEthAbi.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  const {data: claimableadvanced} = useContractRead({
    address: esbckgovtobckgov,
    abi: esbckgovAbi.abi,
    functionName: 'UnlockedPrematurelyview',
    args: [address]
  });


  const { status: success1, error: error1 } = useWaitForTransaction({
    hash: approveData?.hash,
    confirmations: 1, // Wait for one confirmation
  });

  const { status: success2, error: error2 } = useWaitForTransaction({
    hash: vestingData?.hash,
    confirmations: 1, // Wait for one confirmation
  });

  const { status: success3, error: error3 } = useWaitForTransaction({
    hash: claimData?.hash,
    confirmations: 1, // Wait for one confirmation
  });

  const { status: success4, error: error4 } = useWaitForTransaction({
    hash: unlockAllContractData?.hash,
    confirmations: 1, // Wait for one confirmation
  });
  
  const handleDeposit = () => {
    try {
      if(parseFloat(web3.utils.fromWei(balanceesBCKGOV?.toString() || '0', 'ether')) < Number(depositAmount)) {
        toast.error("You don't have enough $esBCKGOV to vest.");
        return;
      }

      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinnerapproval />, { autoClose: false });
      esbckgovApprove();
      setDepositCalled(false);
      seterrormessage(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };
  
  const handleClaim = () => {
    try {
      if((web3.utils.fromWei(claimable.toString(), 'ether')) <= 0) {
        toast.error("You have 0 $BCKGov to claim.");
        return;
      }
      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
      claimContract();
      setDepositSuccessShown(false);
      seterrormessage(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };
  
  const handleUnlockAll = () => {
    if(((web3.utils.fromWei(claimableadvanced.toString(), 'ether')) <= 0)) {
      toast.error("You have 0 $BCKGov to claim.");
      return;
    }
    const confirmUnlock = window.confirm("Warning: Unlocking now will incur a penalty. Do you want to proceed?");
    if (confirmUnlock) {
      try {
        setIsLoading(true);
        toast.dismiss(loadingToastId.current);
        loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
        unlockAllContract();
        setDepositSuccessShown(false);
        seterrormessage(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        toast.dismiss(loadingToastId.current);
        toast.error(error.message || "Transaction failed. Please try again.");
      }
    }
  };
  
  const deposit = () => {
    try {
      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
      vestingContract();
      setDepositSuccessShown(false);
      seterrormessage(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };
  
  useEffect(() => {
    if (address) {
      fetchClaimableAmount();
    }
  }, [address]);

  
  useEffect(() => {
    if (success1 === "success" && !depositCalled) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, {
        autoClose: false,
      });
      deposit()
      setDepositCalled(true); // Prevent multiple calls
    }
    if(success2 === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("Successful Transaction!");
      setDepositSuccessShown(true);
    } else if (success3 === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("Successful Transaction");
      setDepositSuccessShown(true);
    } else if (success4 === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("Successful Transaction");
      setDepositSuccessShown(true);
    }
    const errors = [approveError, vestingError, claimError, unlockAllError, error1, error2, error3, error4];
    const foundError = errors.find(error => error && !errormessage);

  if (foundError) {
    console.error("Transaction error:", foundError);
    setIsLoading(false);
    toast.dismiss(loadingToastId.current);
    toast.error(foundError.message || "Transaction failed. Please try again.");
    seterrormessage(true); // Set the error message flag to true
  }
}, [
  success1, success2, success3, success4, 
  approveError, vestingError, claimError, unlockAllError, 
  depositCalled, depositSuccessShown, vestingContract,
  errormessage // Include errormessage in the dependency array
]);
  
const fetchClaimableAmount = async () => {
  try {
    console.log("Claimable (raw):", claimable); // Add this to check the raw value
  
    const claimableAmountEther = web3.utils.fromWei(claimable.toString(), 'ether');
    console.log("Claimable Amount (Ether):", claimableAmountEther); // Check the converted value
    setClaimableAmount(claimableAmountEther);
  } catch (error) {
    console.error("Error fetching claimable amount:", error);
  }
};


  const handleMaxDeposit = async () => {
    const balance = web3.utils.fromWei(balanceesBCKGOV?.toString() || '0', 'ether');
    const formattedbalance =  Number(balance).toFixed(2)
    setDepositAmount( Number(formattedbalance).toFixed(2));
  };


  return (
    <div className="p-3 card-background">
      <div className="card-backgorund p-4 w-full flex flex-col ">
        <p className="text-24 font-bold bck-color">Vest esBCKGOV</p>
  
        {/* Deposit esBCKGOV Section */}
        <div className="flex flex-col gap-2 mt-3 mb-4">
          <label htmlFor="deposit" className="text-16 font-medium mb-3">
            Deposit esBCKGOV:
          </label>
          <div className="flex">
            <input
              type="number"
              className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0"
              placeholder="Enter amount to deposit"
            />
            <button onClick={handleMaxDeposit} className="ml-2 drop-shadow-xl max-btn">
              Max
            </button>
          </div>
          <button onClick={handleDeposit} className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4">
            Deposit esBCKGOV
          </button>
        </div>
  
        {/* Claim BCKGOV Section */}
        <div className="flex flex-col gap-2 mt-3">
          <label htmlFor="claim" className="text-16 font-medium mb-3">
            Claimable BCKGOV: ${claimableAmount} BCKGov
          </label>
          <button onClick={handleClaim} className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-1">
            Claim BCKGOV
          </button>
        </div>
  
        {/* Unlock All Section */}
        <div className="flex flex-col gap-2 mt-3">
          <button onClick={handleUnlockAll} className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4">
            Unlock All esBCKGOV
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
  }  
