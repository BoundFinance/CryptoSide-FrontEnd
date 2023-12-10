import React from "react";
import Header from "../Layout/Header";
import { Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  return (
    <div className="">
      <Header />
      <Outlet />
    </div>
  );
}
