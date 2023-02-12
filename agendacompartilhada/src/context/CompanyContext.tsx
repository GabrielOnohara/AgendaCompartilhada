import { useRouter } from "next/router";
import React from "react";

export const CompanyContext = React.createContext<any>({});

const CompanyStorage = (props:any) => {

  const router = useRouter();
  const [company, setCompany] = React.useState({});

  async function getCompanyByToken(token:string){
    try {
      const url = "api/token/validate";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'x-access-token': token,
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const json = await response.json()
      if(response.status == 200){
        if(json.company)//necessario adicionar loginAutomatico
        setCompany(json.company)
      }else {
        setCompany({})
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(()=>{
    const token = window.localStorage.getItem("token");
    if(token){
      getCompanyByToken(token);
    }else{
      getCompanyByToken("");
    }
  },[])  

  return (
    <CompanyContext.Provider value={{company, setCompany}}>
      {props.children}
    </CompanyContext.Provider>
  );
}

export default CompanyStorage;