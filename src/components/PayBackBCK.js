import React, { useState, useEffect } from "react";
import { useContractWrite, useContractRead, useAccount, useWaitForTransaction } from "wagmi";
import { BCKGovemissions, BCKgov } from '../contract';
import bckgovemissionsAbi from '../contract/BCKgovemissions.json'; 
import bckEthAbi from '../contract/bckEth.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMYHTTPLINK));


const Spinner = () => (
  <div className="spinner">
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className="loader"></div>
    <p style={{ marginLeft: '10px' }}>Waiting for transaction to complete...</p>
  </div>
  </div>
);


export default function PayBackBCK() {
  const [withdrawableInterest, setWithdrawableInterest] = useState('');
  const [withdrawSuccessShown, setwithdrawSuccessShown] = useState(false);
  const [errormessage, seterrormessage] = useState(false);
  const [message, setMessage] = useState("");
  const loadingToastId = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false); 
  const { address } = useAccount();



  const { data: bckGovDeposited } = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'balances',
    args: [address],
  });

  const {data: Interestview} = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'withdrawableInterestOf',
    args: [address],
  
  });



  const { write: withdrawInterest, data: withdrawInterestData, error: withdrawInterestError} = useContractWrite({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'withdrawInterest',
  });

  const { status: success, error: error1 } = useWaitForTransaction({
    hash: withdrawInterestData?.hash,
    confirmations: 1, // Wait for one confirmation
  });


  const handleWithdrawInterest = async () => {
    if (!Interestview || parseFloat(Interestview) <= 0) {
      toast.error("You can't withdraw 0 emissions .");
      return;
    }
    try {
      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, {
        autoClose: false,
      });
      withdrawInterest();
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

    if (Interestview) {
      setWithdrawableInterest(parseFloat(web3.utils.fromWei(Interestview.toString(), 'ether')));
    }
  }, [Interestview]);

  useEffect(() => {
    if (success === "success" && !withdrawSuccessShown) {
      console.log("eUSD purchase success");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.success("successfully withdrew $esBCKGOV emissions!");
      setwithdrawSuccessShown(true)
    } else if (error1 && !errormessage) {
      console.log("BCKGOV purchase error");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error1.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    }
  }, [error1, success, toast]); // Corrected dependency array
  

  return (
    <div className="p-3 card-background">
      <div className="card-backgorund p-4 w-full flex flex-col ">
      <p className="text-24 font-bold bck-color">BCKGov Emissions</p>
      
      {/* Withdraw Interest Section */}
      <div className="flex flex-col gap-2 mt-3">
        <button onClick={handleWithdrawInterest}
                className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-4">
          Withdraw esBCKGOV Emissions
        </button>
      </div>
    </div>
    <ToastContainer/>
   </div>
  );
        }
