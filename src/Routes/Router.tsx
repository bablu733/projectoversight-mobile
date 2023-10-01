
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

import { AuthStack } from "./AuthStack";
import { useAuth } from "../Contexts/Auth";
import { Roles } from "../Constants/Roles";
import { EmployeeStack } from "./EmployeeStack";
import { AdminStack } from "./AdminStack";
import Footer from "../Components/Footer";

export const Router = () => {
  const { loginData} = useAuth();

  const loggedInRole = (role: string) => {
    if (role === Roles.Employee)
      return <EmployeeStack/>
    if (role === Roles.Admin)
      return <AdminStack/>
    else
      return <AuthStack/>    
  } ;
  return (
    <NavigationContainer>
      {loginData ? loggedInRole(loginData.userRoles) : <AuthStack />}
      {loginData ? <Footer /> :""}
    </NavigationContainer>
  );
};
