import React from "react";
import { TokenContext } from "./TokenContext";
export const CompanyContext = React.createContext<any>("");

const CompanyStorage = (props:any) => {
  
  const {token, setToken} = React.useContext(TokenContext)
  const [company, setCompany] = React.useState({});

  async function getCompany(email:string){
    try {
      const url = "api/companies/auth";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({email: email}),
      });
      if(response.status == 200){
        const {company} = await response.json();
        setCompany(company);
      }else {
        setCompany({});
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(()=>{
    if(token){
      const companyEmail =  window.localStorage.getItem("email") as string;
      getCompany(companyEmail)
    }else{
      setCompany({});
    }
  },[token])  

  return (
    <CompanyContext.Provider value={{token, setToken}}>
      {props.children}
    </CompanyContext.Provider>
  );
}

export default CompanyStorage;