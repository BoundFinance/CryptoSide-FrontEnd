import { Route, Router, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/App.css";
import { MakerDao } from "./components/MakerDao";
import { MakerDAO2 } from "./components/makerDAO2";
import { StakingPart } from "./Pages/stakingBCK";
import ProtectedRoute from "./sections/ProtectedRoute";

import HomePage from "./Pages/Homepage";


function App() {
  const [networkId, setNetworkId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const getNetworkId = async () => {
    if (window.ethereum) {
      const currentNetworkId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log(currentNetworkId, "CURRENT NETWORK ID");
      setNetworkId(currentNetworkId);
      setIsInitialized(true); // Mark the app as initialized
    }
  };

  useEffect(() => {
    getNetworkId();

    if (window.ethereum) {
      const handleChainChanged = () => {
        console.log("chainChanged event triggered");
        setTimeout(getNetworkId, 1000);
      };

      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("accountsChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("chainChanged", handleChainChanged);
          window.ethereum.removeListener("accountsChanged", handleChainChanged);
        }
      };
    }
  }, []);

  const switchToGoerli = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });
        setTimeout(getNetworkId, 1000);
      } catch (error) {
        if (error.code === 4902) {
          // Handle Goerli not being available
        } else {
          console.error("Failed to switch to Goerli:", error);
        }
      }
    } else {
      alert(
        "Please install an Ethereum-compatible browser or extension like MetaMask to use this feature."
      );
    }
  };

  return (
    <div className="flex flex-col root-one">
      {isInitialized && networkId !== "0x5" && (
        <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center bg-red-500 text-white p-8 rounded shadow-lg w-1/2">
          <p className="mb-4 text-lg">⚠️ You are not on the Goerli testnet.</p>
          <button
            onClick={switchToGoerli}
            className="bg-red-600 text-white py-2 px-6 rounded font-medium hover:bg-red-700 active:bg-red-800 transition duration-300"
          >
            Switch to Goerli Testnet
          </button>
        </div>
      )}

      <div className="flex-grow">
       
          <Routes>
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/loan" element={<MakerDao />} />
              <Route path="/staking" element={<StakingPart />} />
              <Route path="/bckemissions" element={<MakerDAO2 />} />
             
            </Route>
          </Routes>
    
      </div>
    </div>
  );
}

export default App;
