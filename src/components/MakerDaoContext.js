import { createContext, useContext } from "react";

export const MakerDaoContext = createContext();

export const useMakerDao = () => {
  const context = useContext(MakerDaoContext);
  if (!context) {
    throw new Error("useMakerDao must be used within a MakerDaoProvider");
  }
  return context;
};
