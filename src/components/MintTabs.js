import React from "react";
import { Tabs, Tab } from "./Tabs";

import CreateBCK from "./CreateBCK";
import CreateBCK2 from "./CreateBCK2"
import BuyEUSD from "./buyeusd";

const App = () => {
  return (
    <div className="w-full lg:max-w-[100%]">
      <Tabs>
      <Tab label="Buy Test $eUSD & $BCKGov">
          <BuyEUSD />
        </Tab>
        <Tab label="Deposit Stablecoin Collateral">
          <CreateBCK />
        </Tab>
        <Tab label= "Mint $BCK Stablecoin">
        <CreateBCK2 />
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;
