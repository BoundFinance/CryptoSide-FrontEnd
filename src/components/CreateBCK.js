import React, { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction} from 'wagmi';
import './Style/CreateBCK.css';
import "./Style/BCKETHcreationinfo.css";
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { BCK_ADDRESS, eUSD, bcktoeUSD } from '../contract';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

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
  const loadingToastId = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [depositSuccessShown, setDepositSuccessShown] = useState(false);
  const [errorSuccessShown, seterrorSuccessShown] = useState(false);
  const [exitSuccessShown, setexitSuccessShown] = useState(false);
  const [withdrawSuccessShown, setwithdrawSuccessShown] = useState(false);
  const [errormessage, seterrormessage] = useState(false);

  const { data: eusdBalance } = useContractRead({
    address: eUSD,
    abi: bckEthAbi.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: bckBalance } = useContractRead({
    address: BCK_ADDRESS,
    abi: bckEthAbi.abi,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });


  const { data: bckwithdrawMaxStable } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'withdrawMaxStable',
    args: [address],
    watch: true,
  });

  const { data: shares } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'share',
    args: [address],
    watch: true,
  });


  const handleMaxEusd = () => {
    const maxAmount = web3.utils.fromWei(eusdBalance?.toString() || '0', 'ether');
    setLockAmount(maxAmount);
  };

  const handleMaxBck = () => {
    const maxAmount = Math.min(
      parseFloat(web3.utils.fromWei(shares?.toString() || '0', 'ether')),
      parseFloat(web3.utils.fromWei(bckwithdrawMaxStable?.toString() || '0', 'ether'))
  
    );
    setMintAmount(maxAmount.toString());
  };

  const toWeiSafe = (amount) => {
    return amount ? web3.utils.toWei(amount, 'ether') : '0';
  };

  const {write: depositEusdTx, data: depositData, error: DepositError } = useContractWrite({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'depositsStable',
    args: [toWeiSafe(lockAmount)],
  });

  const {write: exitBckTx, data: exitBCKTxData, error: ExitError} = useContractWrite({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'exitStable',
    args: [toWeiSafe(mintAmount)],
  });

  const {write: withdrawExcessTx, data: datawithdrawExcessTx, error: withdrawExcessError} = useContractWrite({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'withdrawExcess',
  });

  const {write: bckapprove, data: approveData, error: ApproveError} = useContractWrite({
    address: eUSD,
    abi: bckEthAbi.abi,
    functionName: 'approve',
    args: [bcktoeUSD, toWeiSafe(lockAmount)],
    
  });

  const { isSuccess, status: success, error: error } = useWaitForTransaction({
    hash: approveData?.hash,
    confirmations: 1, // Wait for one confirmation
  });

  const { status: successg, error: errorg} = useWaitForTransaction({
    hash: depositData?.hash,
    confirmations: 1,
  })

  const { status: successv, error: errorv} = useWaitForTransaction({
    hash: datawithdrawExcessTx?.hash,
    confirmations: 1,
  })

  const { status: successa, error: errora} = useWaitForTransaction({
    hash: exitBCKTxData?.hash,
    confirmations: 1,
  })
  
  const handleDeposit = async () => {
    if (!lockAmount || parseFloat(lockAmount) <= 0) {
      toast.error("You can't deposit 0 $eUSD.");
      return;
    }
  
    setIsLoading(true);
    loadingToastId.current = toast.info(<Spinnerapproval />, { autoClose: false });
  
    try {
      bckapprove(); // Assuming this returns a promise
      setDepositCalled(false);
      seterrormessage(false)
   
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };

  const handleExit = async () => {
    if (!mintAmount || parseFloat(mintAmount) <= 0) {
      toast.error("You can't exit 0 $eUSD.");
      return;
    }

    if (parseFloat((web3.utils.fromWei(bckwithdrawMaxStable?.toString() || '0', 'ether'))) < parseFloat(mintAmount)) {
      const maxwithdraw =  parseFloat((web3.utils.fromWei(bckwithdrawMaxStable?.toString() || '0', 'ether'))); 
      toast.error(`You can only exit ${maxwithdraw} eUSD. you need to pay of some $BCK`);
      return;
    }
  
    setIsLoading(true);
    loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
  
    try {
      exitBckTx(); // Assuming this returns a promise
      setexitSuccessShown(false);
      seterrormessage(false)
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };

  const handleWithdrawExcess = async () => {
  
    setIsLoading(true);
    loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
  
    try {
      withdrawExcessTx(); // Assuming this returns a promise
      setwithdrawSuccessShown(false)
      seterrormessage(false)
      
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
      depositEusdTx();
      setDepositCalled(true);
    } 
  
    if (successg === "success" && !depositSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("$eUSD purchased successfully!");
      setDepositSuccessShown(true); // Prevent the message from showing again
    }

    if (successa === "success" && !exitSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("$eUSD successfully exited!");
      setexitSuccessShown(true); // Prevent the message from showing again
    }

    if (successv === "success" && !withdrawSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.success("$eUSD Interest successfully Withdrawn!");
      setwithdrawSuccessShown(true); // Prevent the message from showing again
    }
  
    if (error && !errorSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
    }

    if (errora && !errorSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
    }
  
    if (errorg && !errorSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.error(errorg.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
    }

    if (errorv && !errorSuccessShown) {
      toast.dismiss(loadingToastId.current);
      toast.error(errorv.message || "Transaction failed. Please try again.");
      seterrorSuccessShown(true);
    }
  }, [success, successg, error, errorg, depositEusdTx, depositCalled]);

  useEffect(() => {
    if (withdrawExcessError && !errormessage) {
      console.log("eUSD purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(withdrawExcessError.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    } else if (ExitError && !errormessage) {
      console.log("BCKGOV purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(ExitError.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    }else if (DepositError && !errormessage) {
      console.log("BCKGOV purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(DepositError.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    } else if (ApproveError && !errormessage) {
      console.log("BCKGOV purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(ApproveError.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    }
  }, [ExitError, toast, withdrawExcessError, DepositError, ApproveError]);
  
  
  useEffect(() => {
    // Reset the flag when the component is ready for a new transaction
    if (!successa && !success && !successg && !error && !errorg) {
      setDepositSuccessShown(false);
      seterrorSuccessShown(false);
      setexitSuccessShown(false)
      
    }
  }, [success, successa, successg, error, errorg]);
  

  return (
    <div className="p-3 card-background">
      <div className="card-backgorund p-4 w-full flex flex-col ">
      <p className="text-24 font-bold bck-color">Deposit $eUSD Stablecoin</p>

      {transactionStatus.loading && <div>Loading...</div>}
      {transactionStatus.error && <div className="error-message">{transactionStatus.message}</div>}

      {/* Deposit eUSD Section */}
      <div className="flex flex-col gap-2 mt-3">
        <label htmlFor="lock" className="text-20 font-medium">
          Deposit eUSD:
        </label>
        <div className="flex">
          <input
            type="number"
            value={lockAmount}
            onChange={(e) => setLockAmount(e.target.value)}
            placeholder={`Balance: ${web3.utils.fromWei(eusdBalance?.toString() || '0', 'ether')} eUSD`}
            className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
          />
          <button onClick={handleMaxEusd} className="ml-2 drop-shadow-xl max-btn">Max</button>
        </div>
        <button
          onClick={handleDeposit}
     
        className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4"
      >
          Deposit
        </button>
      </div>

      {/* Exit BCK Section */}
      <div className="flex flex-col gap-2 mt-6">
        <label htmlFor="exit" className="text-20 font-medium">
          Withdraw eUSD:
        </label>
        <div className="flex">
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            placeholder={`Balance: ${web3.utils.fromWei(shares?.toString() || '0', 'ether')} eUSD`}
            className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
          />
          <button onClick={handleMaxBck} className="ml-2 drop-shadow-xl max-btn">Max</button>
        </div>
        <button
          onClick={async () => {
            handleExit();
          }}
          className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4"
        >
          Withdraw
        </button>
      </div>

      {/* Withdraw Excess Interest Section */}
      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={() => {
            handleWithdrawExcess();
          }}
          className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4"
        >
          Withdraw $eUSD Interest
        </button>
      </div>
    </div>
    <ToastContainer />
    </div>
  );
}
