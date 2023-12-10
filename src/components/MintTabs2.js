import React from "react";
import { Tabs, Tab } from "./Tabs";

import CreateBCK from "./CreateBCK";
import PayBackBCK from "./PayBackBCK";

import Vesting from './esBCKGovtoBCKGOV';


import Safe from "./Safe";
import BuyEUSD from "./buyeusd";

const App = () => {
  return (
    <div className="w-full lg:max-w-[100%]">
      <Tabs>
        <Tab label="BCKGov Emissions">
          <PayBackBCK />
        </Tab>
        <Tab label="esBCKGov Auction">
          <Safe />
        </Tab>
        <Tab label="Vesting">
        <Vesting />
       </Tab>
      </Tabs>
    </div>
  );
};

export default App;
