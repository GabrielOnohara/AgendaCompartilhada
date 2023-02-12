import React from "react";
import { TokenContext } from "./TokenContext";
export const CompanyContext = React.createContext<any>("");

const CompanyStorage = (props:any) => {
  
  const {token, setToken} = React.useContext(TokenContext)
  const [company, setCompany] = React.useState({name: ""});

  React.useEffect(()=>{
    async function getCompanyByEmail(email:string){

      try {
        const url = "api/companies/" + email;
        const response = await fetch(url, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if(response.status == 200){
          const {company} = await response.json();
          setCompany(company);
        }else {
          setCompany({name: ""});
        }
      } catch (error) {
        console.log(error)
      }
    }

    const token =  window.localStorage.getItem("token");
    const companyEmail =  window.localStorage.getItem("email");
    if(token){
      if(companyEmail){
        getCompanyByEmail(companyEmail)
      }else{
        setCompany({name: ""});
      }
    }
  },[])  

  return (
    <CompanyContext.Provider value={{company, setCompany}}>
      {props.children}
    </CompanyContext.Provider>
  );
}

export default CompanyStorage;