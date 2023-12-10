import React, { useState, useEffect } from "react";
import { useContractWrite, useAccount, useWaitForTransaction } from "wagmi";
import BuyeusdAbi from '../contract/BuyeusdTestnetonly.json';
import { buyeusd, buybckgov } from '../contract'; // Assuming this is your contract's address
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import "./Style/BCKETHcreationinfo.css";

import 'react-input-range/lib/css/index.css';
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);



const Spinner = () => (
  <div className="spinner">
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className="loader"></div>
    <p style={{ marginLeft: '10px' }}>Waiting for transaction to complete...</p>
  </div>
  </div>
);




export default function BuyEUSD() {
  const [ethAmount, setEthAmount] = useState("");
  const [ethAmountbckgov, setEthAmountbckgov] = useState(""); // State to hold the ETH amount to deposit
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [depositSuccess, setdepositSuccess] = useState(false);
  const [Donenow, setDonenow] = useState(false); // Loading state
  const [errordone, seterrordone] = useState(false);
  const loadingToastId = React.useRef(null);
  const { address } = useAccount(); 
  // Get the connected account address

  // Exchange rate constant
  const EXCHANGE_RATE = 1500; // 1 ETH = 1500 eUSD


  const toWeiSafe = (amount) => {
    return amount ? web3.utils.toWei(amount, 'ether') : '0';
  };

  // Setup the contract write hook for depositing ETH
  const { write: depositEth, data: approveData, error: depositEthError} = useContractWrite({
    address: buyeusd, // Use the imported contract address
    abi: BuyeusdAbi.abi,
    functionName: 'deposit',
    value: toWeiSafe(ethAmount), // Ensure to send the ETH value with the transaction
  
  });

  const { write: depositEthforBCKGOV, data:g, error: depositBCKGOVError } = useContractWrite({
    address: buybckgov, // Use the imported contract address
    abi: BuyeusdAbi.abi,
    functionName: 'deposit',
    value: toWeiSafe(ethAmountbckgov), // Ensure to send the ETH value with the transaction
    
  });

  const {  status: success, error: errore} = useWaitForTransaction({
    hash: approveData?.hash,
    confirmations: 2, // Wait for one confirmation
  });

  const {  status: successg, error: errorb } = useWaitForTransaction({
    hash: g?.hash,
    confirmations: 2, // Wait for one confirmation
  });


  const handleDeposit = async () => {
    if (!ethAmount || parseFloat(ethAmount) === 0) {
      toast.error("You can't deposit 0 ETH.");
      
      return;
    }
    try {
      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, {
        autoClose: false,
      });
      depositEth();
      setdepositSuccess(false);
      seterrordone(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };
  
  const handleDepositbckgov = async () => {
    if (!ethAmountbckgov || parseFloat(ethAmountbckgov) === 0) {
      toast.error("You can't deposit 0 ETH.");
      return;
    }
    try {
      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, {
        autoClose: false,
      });
      depositEthforBCKGOV();
      setDonenow(false);
      seterrordone(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };

    useEffect(() => {
    if (success === "success" && !depositSuccess) {
      console.log("eUSD purchase success");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.success("$eUSD purchased successfully!");
      setdepositSuccess(true);
    } else if (successg == "success" && !Donenow) {
      console.log("BCKGOV purchase success");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.success("BCKGov purchased successfully!");
      setDonenow(true);
    } else if (errore && !errordone) {
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(errore.message || "Transaction failed. Please try again.");
      seterrordone(true);
    } else if (errorb && !errordone) {
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(errorb.message || "Transaction failed. Please try again.");
      seterrordone(true);
    }
  }, [errore, errorb, success, toast]); // Corrected dependency array
  
  
  useEffect(() => {
    if (depositEthError) {
      console.log("eUSD purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(depositEthError.message || "Transaction failed. Please try again.");
    } else if (depositBCKGOVError) {
      console.log("BCKGOV purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(depositBCKGOVError.message || "Transaction failed. Please try again.");
    }
  }, [depositEthError, toast, depositBCKGOVError]);
  
  

  return (
    <div className="p-3 card-background">
      <div className="card-backgorund p-4 w-full flex flex-col">
        <p className="text-24 font-bold bck-color">Buy eUSD with Goerli ETH (TESTNET ONLY)</p>
        <p className="text-16 mt-2 mb-2">Exchange Rate: 1 Goerli ETH = {EXCHANGE_RATE} $eUSD</p>
        <div className="flex flex-col gap-2 mt-3">
          <label htmlFor="ethAmount" className="text-16 font-medium mb-3">
            Amount of ETH to deposit:
          </label>
          <input
            type="number"
            className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            min="0"
            placeholder="Enter ETH amount"
          />
          <button onClick={handleDeposit} className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4">
            Buy eUSD
          </button>
        </div>
        
        
        {/* Increased spacing here */}
        <div className="mt-6"></div>
  
        <p className="text-24 font-bold bck-color">Buy BCKGov with Goerli ETH (TESTNET ONLY)</p>
        <p className="text-16 mt-2 mb-2">Exchange Rate: 1 Goerli ETH = {EXCHANGE_RATE} $BCKGov</p>
        <div className="flex flex-col gap-2 mt-3">
          <label htmlFor="ethAmountbckgov" className="text-16 font-medium mb-3">
            Amount of ETH to deposit:
          </label>
          <input
            type="number"
            className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
            value={ethAmountbckgov}
            onChange={(e) => setEthAmountbckgov(e.target.value)}
            min="0"
            placeholder="Enter ETH amount"
          />
          <button onClick={handleDepositbckgov} className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4">
            Buy BCKGov
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  }  