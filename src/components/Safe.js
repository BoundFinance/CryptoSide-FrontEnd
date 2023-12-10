import React, { useState, useEffect } from "react";
import { useContractRead, useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import ReactSpeedometer from "react-d3-speedometer";
import "./Style/Safe.css";
import "./Style/CreateBCK.css";
import { BCKGovemissions, BCKgov, bcktoeUSD, STAKING_ADDRESS } from '../contract';
import bckgovemissionsAbi from '../contract/BCKgovemissions.json';
import bckEthAbi from '../contract/bckEth.json';
import stakingAbi from '../contract/staking.json';
import eusdtobckAbi from '../contract/lsdfitobck.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider);
const BigNumber = Web3.utils.BN;

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

export default function CheckCupSafety() {
  const [percentage, setPercentage] = useState(0);
  const [overHundredPercent, setOverHundredPercent] = useState(false);
  const [eusdShares, seteUSDshares] = useState(0);
  const [minusd, setminusd] = useState(0);
  const [bckGovBalance, setBCKGOVbalance] = useState(0);
  const [ringBackgroundColor, setRingBackgroundColor] = useState("#8590C8");
  const [textColor, setTextColor] = useState(""); // Default color
  const [stakeAmount, setStakeAmount] = useState('0');
  const [depositCalled, setDepositCalled] = useState(false);
  const [BuyCalled, setBuyCalled] = useState(false);
  const loadingToastId = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [errormessage, seterrormessage] = useState(false);
  const { address } = useAccount();

  const { data: eusdShares1 } = useContractRead({
    address: bcktoeUSD,
    abi: eusdtobckAbi.abi,
    functionName: 'shares',
    args: [address],
  });

  const { data: depositedBCK } = useContractRead({
    address: STAKING_ADDRESS,
    abi: stakingAbi.abi,
    functionName: 'balances',
    args: [address],
  });

  const { data: balanceofBCKGOV } = useContractRead({
    address: BCKgov,
    abi: bckEthAbi.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: penaltyfee } = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'discountrate',
  });

  const { data: AmountofPurchasableEsBCKGOV } = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'DiscountedBCKGOVAmount',
  });

  const { data: minimumeUSD } = useContractRead({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'minimumstakeshares',
  });

  const toWeiSafe = (amount) => {
    if (isNaN(parseFloat(amount)) || !isFinite(amount)) {
      return '0';
    }
    const fixedAmount = parseFloat(amount).toFixed(18);
    return web3.utils.toWei(fixedAmount, 'ether');
  };
  

  const bckGovcost = (amount) => {
    if (!penaltyfee) {
      console.error('Penalty fee is undefined');
      return '0';
    }
  
    const penaltyether = penaltyfee.toString()
    const cost = (parseFloat(amount) * parseFloat(penaltyether)) / 100;
    // Return the cost in Ether directly
    return cost.toString();
  };
  
  const { write: approve, data: approveData, error: approveError } = useContractWrite({
    address: BCKgov,
    abi: bckEthAbi.abi,
    functionName: 'approve',
    args: [BCKGovemissions, toWeiSafe(bckGovcost(stakeAmount))],
  });
  
  const { write: buy, data: buyData, error: BuyError } = useContractWrite({
    address: BCKGovemissions,
    abi: bckgovemissionsAbi.abi,
    functionName: 'buyDiscountedesBCKGOV',
    args: [toWeiSafe(stakeAmount)],
  });
  

  const { status: success1, error: error1} = useWaitForTransaction({
    hash: approveData?.hash,
    confirmations: 1, // Wait for one confirmation
  });

  const { status: success2, error: error2} = useWaitForTransaction({
    hash: buyData?.hash,
    confirmations: 1, // Wait for one confirmation
  });
  
  const handleDeposit = async() => {
    try {
      if(parseFloat(stakeAmount) <= 0) {
        toast.error("You can't buy 0 $esBCKGOV emissions .");
        return;
      }
      if(parseFloat((web3.utils.fromWei(AmountofPurchasableEsBCKGOV.toString(), 'ether'))) < parseFloat(stakeAmount)) {
        const maxpurchase = (web3.utils.fromWei(AmountofPurchasableEsBCKGOV.toString(), 'ether'))
        toast.error(`Hold up!, you can only buy ${maxpurchase} esBCKGOV emissions.`);
        return;
      }

      
      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinnerapproval />, { autoClose: false });
      approve();
      setDepositCalled(true);
      seterrormessage(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };
  
  const handleBuy = async() => {
    try {
      setIsLoading(true);
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, { autoClose: false });
      buy();
      setBuyCalled(true);
      seterrormessage(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error.message || "Transaction failed. Please try again.");
    }
  };
  

  const handleDepositMaxInput = async() => {
    if(!penaltyfee || penaltyfee === "N/A" || penaltyfee === 0) {
      penaltyfee = 0;
    }
    if (penaltyfee) {
      const balance  = (web3.utils.fromWei(balanceofBCKGOV.toString(), 'ether'));
      const cost = (parseFloat(balance) / parseFloat(penaltyfee)) / 100;
      const balanceDiscountBCKGOV  = (web3.utils.fromWei(AmountofPurchasableEsBCKGOV.toString(), 'ether'));
      const maxAmount = Math.min(parseFloat(balanceDiscountBCKGOV), parseFloat(cost));
     setStakeAmount(maxAmount.toString()); // Reset this flag whenever bckapprove is called
  }
};
  
  useEffect(() => {
    if (success1 === "success" && !depositCalled) {
      toast.dismiss(loadingToastId.current);
      loadingToastId.current = toast.info(<Spinner />, {
        autoClose: false,
      });
      handleBuy();
      setDepositCalled(true);
    } else if(success2 === "success" && !BuyCalled) {
      console.log("eUSD purchase success");
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.success("successfully withdrew $esBCKGOV emissions!");
      setBuyCalled(true);
    } // Handling errors for approve and buy transactions
    if (approveError && !errormessage) {
      console.error("Approval error:", approveError);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(approveError.message || "Approval failed. Please try again.");
      seterrormessage(true)
    }
  
    if (BuyError && !errormessage) {
      console.error("Buy error:", BuyError);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(BuyError.message || "Buy transaction failed. Please try again.");
      seterrormessage(true)
    }
  
    // Handling transaction errors based on transaction hashes
    if (error1 && !errormessage) {
      console.error("Transaction error:", error1);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error1.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    }
  
    if (error2 && !errormessage) {
      console.error("Transaction error:", error2);
      setIsLoading(false);
      toast.dismiss(loadingToastId.current);
      toast.error(error2.message || "Transaction failed. Please try again.");
      seterrormessage(true)
    }
  }, [success1, success2, error1, error2, BuyError, approveError, handleBuy, depositCalled, BuyCalled]);



  useEffect(() => {
    if (depositedBCK) {
      setBCKGOVbalance(web3.utils.fromWei(depositedBCK.toString(), 'ether'));
    }
    if (eusdShares1) {
      seteUSDshares(web3.utils.fromWei(eusdShares1.toString(), 'ether'));
    }
    if (minimumeUSD) {
      setminusd(web3.utils.fromWei(minimumeUSD.toString(), 'ether'));
    }
  }, [depositedBCK, eusdShares1, minimumeUSD]);


  useEffect(() => {
    const esud = web3.utils.fromWei(eusdShares1.toString(), 'ether');
    const BCKGOVdeposit = web3.utils.fromWei(depositedBCK.toString(), 'ether');
    let stakePercentage = ((BCKGOVdeposit / esud) * 100);
    const min =  web3.utils.fromWei(minimumeUSD.toString(), 'ether'); // Convert to 
    if(esud < min) {
      stakePercentage = 0;
    }

      let newTextColor = "#49E600"; // Default to green
      if (stakePercentage <= 2.5) {
        newTextColor = "#D00000"; // Red
      } else if (stakePercentage > 2.5 && stakePercentage < 5) {
        newTextColor = "#CEBA00"; // Yellow
      }
      setTextColor(newTextColor);
  
      if (stakePercentage > 100) {
        setOverHundredPercent(true);
      } else {
        setOverHundredPercent(false);
      }
  
      setPercentage(stakePercentage);
  
      // Determine the ring background color
      let newRingBackgroundColor = "#49E600"; // Default to green
      if (stakePercentage <= 2.5) {
        newRingBackgroundColor = "#D00000"; // Red
      } else if (stakePercentage > 2.5 && stakePercentage < 5) {
        newRingBackgroundColor = "#CEBA00"; // Yellow
      }
      setRingBackgroundColor(newRingBackgroundColor);
  
  
  }, [bckGovBalance, eusdShares]);
    
  return (
    <div className="p-3 card-backgorund">
      <p className="text-24 font-bold text-center bck-color">
        BCKGov Staking Health
      </p>
      <div className="d-flex justify-content-center semi-circle-gauge mt-4">
        <div className="for-first-ring">
          <div className="second-ring">
            <ReactSpeedometer
              segments={5}
              width={360}
              segmentColors={["#D00000","#CEBA00", "#49E600","#49E600","#49E600"]}
              customSegmentLabels={[{}, {}, {}, {}, {}]}
              ringWidth={8}
              needleColor={"none"}
            />
          </div>
        </div>
  
        <div style={{ position: 'relative' }}>
          <ReactSpeedometer
            className="speedometer-value-text"
            width={300}
            segments={1}
            needleHeightRatio={0.5}
            value={parseFloat(percentage.toFixed(2)) / 100 > 0.1 ? 0.1 : parseFloat(percentage.toFixed(2)) / 100}
            segmentColors={["#7eb7ff", "#3a80ff", "#0047ff"]} // Light Blue to Medium Blue to Dark Blue
            currentValueText={eusdShares < minusd ? "Stake Collateral to earn" : " "} // Set to empty space
            customSegmentLabels={[
              {
                backgroundColor: ringBackgroundColor,
                borderRadius: "50%",
              },
            ]}
            ringColor={ringBackgroundColor}
            ringWidth={25}
            needleTransitionDuration={4444}
            needleTransition="easeElastic"
            needleColor={"#ffff"}
            textColor={
              "#ffff"
            }
            
            currentValuePlaceholderStyle=""
            minValue={0}
            maxValue={0.1}
          />
  
  <div style={{
  position: 'absolute',
  top: '50%', // Adjust as needed
  left: '50%', // Adjust as needed
  transform: 'translate(-50%, -50%)',
  fontSize: '20px', // Adjust as needed
  color: percentage <= 2.5 ? "#D00000" : // Red for percentages <= 2.5
         percentage > 2.5 && percentage < 5 ? "#CEBA00" : // Yellow for percentages between 2.5 and 5
         "#49E600" // Green for all other cases
}}>
  {overHundredPercent ? `${percentage.toFixed(2)}%` : `${percentage}%`}
</div>

        </div>
      </div>
  
      <div className="w-full max-w-[700px] mx-auto d-flex">
        <div className="card-backgorund p-4 w-full flex flex-col ">
          <p className="text-24 font-bold font-mont bck-color">BCKGov Savings Account</p>
          <div className="w-full mt-3 flex flex-col gap-2">
            <div className="flex flex-col gap-1">
           
<p className="text-16 font-medium mb-3 ">$ {stakeAmount} esBCKGov = $ {(parseFloat(stakeAmount) * parseFloat(penaltyfee)) / 100} BCKGov</p>


              <p className="text-14 font-medium">Amount of esBCKGOV you want to buy ($):</p>
              <div className="flex">
             
              <input
                  type="number"
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="rounded-md text-14 focus:ring-2 input-max py-2 px-3 flex-grow"
                  placeholder={`Balance of $BCK in user's wallet: $ ${balanceofBCKGOV ? web3.utils.fromWei(balanceofBCKGOV.toString(), 'ether') : '0'} BCK`}
                  value={stakeAmount}
                />
                <button
                   onClick={handleDepositMaxInput}
                  className="ml-2 drop-shadow-xl max-btn"
                >
                  Max
                </button>
              </div>
            
              <button
                onClick={handleDeposit}
                className="BoxGradient-button-max drop-shadow-xl hover:drop-shadow-sm mt-3"
              >
                deposit
              </button>
            </div>
            
          </div>
        </div>
      </div> 
      <ToastContainer/>
    </div>
  );
        }  


