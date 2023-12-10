import React, { useState } from "react";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const handleClick = (e, newActiveTab) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className="card-background font-mont font-normal bg-center rounded-lg">
      <div className="">
        <div
          className="flex navbar-themes overflow-hidden ms-3"
          style={{
            borderRadius: "20px 20px 0px 0px",
          }}
        >
          {children.map((child) => (
            <>
              <button
                key={child.props.label}
                className={`${
                  activeTab === child.props.label
                    ? "text-12 gradient-buttons"
                    : ""
                }  flex-1 text-14 font-mont font-bold p-2 text-for-responsive`}
                onClick={(e) => handleClick(e, child.props.label)}
              >
                {child.props.label}
              </button>
            </>
          ))}
        </div>
        <div className="py-3">
          {children.map((child) => {
            if (child.props.label === activeTab) {
              return <div key={child.props.label}>{child.props.children}</div>;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

const Tab = ({ label, children }) => {
  return (
    <div label={label} className="hidden">
      {children}
    </div>
  );
};
export { Tabs, Tab };
