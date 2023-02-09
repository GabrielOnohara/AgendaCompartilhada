import React from "react";

export const CompanyContext = React.createContext<any>(null);

const CompanyStorage = (props:any) => {
  const [company, setCompany] = React.useState(null);

  return (
    <CompanyContext.Provider value={{company, setCompany}}>
      {props.children}
    </CompanyContext.Provider>
  );
}

export default CompanyStorage;