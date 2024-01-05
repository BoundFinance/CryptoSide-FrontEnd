import React from "react";
// import { ConnectWallet } from "../components/Functions";
import { NavLink } from "react-router-dom";
import WalletConnect from "../components/WalletConnect";
// import stacking from "../Pages/stakingBCK"
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./header.css";
import { FaBarsStaggered } from "react-icons/fa6";



export default function Header() {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const screenSize = window.innerWidth;

  // Define the breakpoint values FaBarsStaggered
  const lgBreakpoint = 992;
  const mdBreakpoint = 768;
  const smBreakpoint = 576;

  // Determine the 'expand' attribute based on the screen size
  let expandAttribute = "md"; // Default to 'md'

  if (screenSize >= lgBreakpoint) {
    expandAttribute = "lg";
  } else if (screenSize >= mdBreakpoint) {
    expandAttribute = "md";
  } else if (screenSize >= smBreakpoint) {
    expandAttribute = "sm";
  }

  return (
    // <div className="navbar-theme sticky py-3 z-20 top-0 left-0 right-0">
    //   <div className="w-full max-w-[1449px] px-4 md:px-0 mx-auto">
    //     <div className="flex justify-between items-center">
    //       <div className="flex items-center gap-3 w-full max-w-[510px] lg:max-w-[580px] lg:mr-8">
    //         {" "}
    //         {/* Added lg:mr-8 */}
    //         <div>
    //           <NavLink
    //             className="text-decoration-none hover:text-white-200 font-mont flex flex-col items-end leading-none"
    //             to={"/"}
    //           >
    //             <p className="text-30" style={{ fontWeight: 600 }}>
    //               Bound.
    //             </p>
    //             <p className="text-[#35beff] tracking-[px] text-15 pt-[2px]">
    //               Finance
    //             </p>
    //             <p className="text-red-400 text-12 text-18">(Testnet)</p>
    //           </NavLink>
    //         </div>
    //         <button
    //           onClick={() => setDropdownOpen(!dropdownOpen)}
    //           className="order-3 px-1 py- border-0 outline-none focus:outline-none bg-transparent text-4xl lg:hidden"
    //         >
    //           &#x2630; {/* Hamburger menu icon */}
    //         </button>
    //         <div
    //           className={`items-center px-5 gap-4 object-right font-dm-sans font-semibold ${
    //             dropdownOpen ? "block" : "hidden"
    //           } lg:flex`}
    //         >
    //           {Nav_Links.map((items, index) => (
    //             <div key={index} className="md:inline-block">
    //               <NavLink
    //                 onClick={() => setDropdownOpen(false)}
    //                 to={items.path}
    //                 className="text-decoration-none text-nav-links hover:text-[#fff] text-13 whitespace-nowrap block md:inline"
    //               >
    //                 {items.title}
    //               </NavLink>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       <div>
    //         <WalletConnect />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      <Navbar expand={expandAttribute} className="main-nav ">
        <Container fluid>
          <Navbar.Brand as={NavLink} to="/">
            <div className="brand-name">Bound.</div>
            <span className="finance-name">Finance</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ color: "white" }}
          >
            <FaBarsStaggered />
          </Navbar.Toggle>
          <Navbar.Collapse>
            <Nav className="flex-grow-1 justify-content-evenly align-item-center">
              <Nav.Link
                as={NavLink}
                to="/"
                exact
                 
                className="custom-link"
              >
                Home
              </Nav.Link>
           
              <Nav.Link
                as={NavLink}
                to="/loan"
                 
                className="custom-link-for-big-for-cdp"
              >
                CDP
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/staking"
                 
                className="custom-link-for-big"
              >
                Stacking BCKGov
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/bckemissions"
                 
                className="custom-link-for-big"
              >
                esBCKGov Emissions
              </Nav.Link>
              
            
              <Nav.Link className="d-flex justify-content-center">
                <WalletConnect />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
