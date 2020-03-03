import React from "react";
import { Redirect } from "react-router-dom";

interface LogOutProps {}

const LogOut: React.FC<LogOutProps> = () => {
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  return <Redirect to="/login" />;
};

export default LogOut;
