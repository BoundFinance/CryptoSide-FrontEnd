import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import './Style/CreateBCK.css';
import "./Style/BCKETHcreationinfo.css";
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { BCK_ADDRESS, eUSD, bcktoeUSD } from '../contract';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMYHTTPLINK));

const bckEthAbi = require('../contract/bckEth.json'); // Assuming this ABI works for both eUSD and BCK
const eusdtobckAbi = require('../contract/lsdfitobck.json'); // Contract ABI for StablecointoBCK

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

export default function CreateBCK() {
  const [lockAmount, setLockAmount] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState({ loading: false, error: false, message: '' });
  const { address } = useAccount();
  const [depositCalled, setDepositCalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const loadingToastId = React.useRef(null);
  const [depositSuccessShown, setDepositSuccessShown] = useState(false);
  const [errorSuccessShown, seterrorSuccessShown] = useState(false);
  const [exitSuccessShown, setexitSuccessShown] = useState(false);
  const [withdrawSuccessShown, setwithdrawSuccessShown] = useState(false);
  const [errormessage, seterrormessage] = useState(false);

  const { data: maxMint } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'maxMintvalue',
    args: [address],
    watch: true,
  });

  const { data: bckBalance } = useContractRead({
    address: BCK_ADDRESS,
    abi: bckEthAbi.abi,
    functionName: 'balanceOf',
    args: [address],
    
  });

  const { data: shares } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'share',
    args: [address],
    
  });

  const { data: balance } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'balance',
    args: [address],
    
  });

  const handleMaxEusd = () => {
    console.log(maxMint, "MAX mint");
    const maxAmount = web3.utils.fromWei(maxMint?.toString() || '0', 'ether');
    setLockAmount(maxAmount);
  };

  const handleMaxBck = () => {
    const maxAmount = Math.min(
      parseFloat(web3.utils.fromWei(bckBalance?.toString() || '0', 'ether')),
      parseFloat(web3.utils.fromWei(shares?.toString() || '0', 'ether'))
    );
    setMintAmount(maxAmount.toString());
  };

  const toWeiSafe = (amount) => {
    return amount ? web3.utils.toWei(amount, 'ether') : '0';
  };


  const {write: burnBCK, data: burnData, error: burnerror} = useContractWrite({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'burnBCK',
    args: [toWeiSafe(mintAmount)],
  });


  const {write: mintBCK, data: mintBCKData, error: mintBCKerror } = useContractWrite({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'mintBCK',
    args: [toWeiSafe(lockAmount)],
    
  });

  const {write: bckapproveexit, data: approveData, error: approveError}  = useContractWrite({
    address: BCK_ADDRESS,
    abi: bckEthAbi.abi,
    functionName: 'approve',
    args: [bcktoeUSD, toWeiSafe(mintAmount)],
    
  });

  const { status: success, error: error1 } = useWaitForTransaction({
    hash: approveData?.hash,
    confirmations: 1, // Wait for one confirmation
  });

  const {status: successa, error: error2 } = useWaitForTransaction({
    hash: mintBCKData?.hash,
    confirmations: 1, // Wait for one confirmation
  });

  const {status: successb, error: error3 } = useWaitForTransaction({
    hash: burnData?.hash,
    confirmations: 1, // Wait for one confirmation
  });


  
const handlepayback = () => {

  if (!mintAmount || parseFloat(mintAmount) <= 0) {
    toast.error("You can't Pay Off 0 $BCK.");
    return;
  }

  if((web3.utils.fromWei(balance?.toString() || '0', 'ether')) <= parseFloat(mintAmount)) {
    toast.error("You are trying to pay off more than you borrowed :D");
    return;
  }



  setIsLoading(true);
  loadingToastId.current = toast.info(<Spinnerapproval />, { autoClose: false });

  try {
    bckapproveexit(); // Assuming this returns a promise
    setDepositCalled(false);
    setDepositSuccessShown(false);
    seterrormessage(false);
  } catch (error) {
    console.error(error);
    setIsLoading(false);
    toast.dismiss(loadingToastId.current);
    toast.error(error.message || "Transaction failed. Please try again.");
  }
};

const mintBCKhandle = () => {

  if (!lockAmount || parseFloat(lockAmount) <= 0) {
    toast.error("You can't mint 0 $BCK.");
    return;
  }

  if((web3.utils.fromWei(maxMint?.toString() || '0', 'ether')) <= parseFloat(lockAmount)) {
    toast.error("You can't mint this much $BCK 😭. deposit more collateral");
    return;
  }


  setIsLoading(true);
  loadingToastId.current = toast.info(<Spinner />, { autoClose: false });

  try {
    mintBCK(); // Assuming this returns a promise
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
    if (success === "success" && !depositCalled) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, {
        autoClose: false,
      });
      burnBCK();
      setDepositCalled(true); // Prevent multiple calls
    } else if(successa === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("successfully minted $BCK!");
      setDepositSuccessShown(true);
    } else if(successb === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("successfully paid off $BCK!");
      setDepositSuccessShown(true);
    }  
    
    if (error1 && !errorSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.error(error1.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
    }

    if (error2 && !errorSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.error(error2.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
    }
  
    if (error3 && !errorSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.error(error3.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
    }


  }, [success, burnBCK, depositCalled, error1, error2, error3]);

  useEffect(() => {
    if (burnerror && !errormessage) {
      console.log("eUSD purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(burnerror.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    } else if (mintBCKerror && !errormessage) {
      console.log("BCKGOV purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(mintBCKerror.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    }else if (approveError && !errormessage) {
      console.log("BCKGOV purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(approveError.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    } 
  }, [approveError, toast, mintBCKerror, burnerror, ]);
  

useEffect(() => {
  // Reset the flag when the component is ready for a new transaction
  if (!successa && !success && !successb && !error1 && !error2 && !error3) {
    setDepositSuccessShown(false);
    seterrorSuccessShown(false);
    setexitSuccessShown(false);
    seterrormessage(false)
  }
}, [success, successa, successb]);


  return (
    <div className="p-3 card-background">
      <div className="card-backgorund p-4 w-full flex flex-col ">
      <p className="text-24 font-bold bck-color">Create BCK</p>

      {/* Deposit eUSD Section */}
      <div className="flex flex-col gap-2 mt-3">
        <label htmlFor="lock" className="text-20 font-medium">
        Mint BCK:
        </label>
        <div className="flex">
          <input
            type="number"
            value={lockAmount}
            onChange={(e) => setLockAmount(e.target.value)}
            placeholder={`Mint up to $${web3.utils.fromWei(maxMint?.toString() || '0', 'ether')} BCK `}
            className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
          />
          <button onClick={handleMaxEusd} className="ml-2 drop-shadow-xl max-btn">Max</button>
        </div>
        <button
       
        onClick={async () => {
          // First, approve the token amount
          mintBCKhandle()
        }}
        className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4"
      >
          Mint BCK
        </button>
      </div>

      {/* Exit BCK Section */}
      <div className="flex flex-col gap-2 mt-6">
        <label htmlFor="exit" className="text-20 font-medium">
          PayBack BCK:
        </label>
        <div className="flex">
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            placeholder={`Balance: ${web3.utils.fromWei(bckBalance?.toString() || '0', 'ether')} BCK`}
            className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
          />
          <button onClick={handleMaxBck} className="ml-2 drop-shadow-xl max-btn">Max</button>
        </div>
        <button
          onClick={async () => {
            // First, approve the token amount
            handlepayback()}}
          className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4"
          >
          PayBack
        </button>
      </div>
    </div>
    <ToastContainer />
    </div>
  );
}
