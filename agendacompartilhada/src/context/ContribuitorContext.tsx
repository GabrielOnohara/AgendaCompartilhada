import { Contribuitor } from "@prisma/client";
import React from "react";
export const ContribuitorContext = React.createContext<any>({});

const ContribuitorStorage = (props: any) => {
  const [contribuitor, setContribuitor] = React.useState<Contribuitor | null>(
    null
  );

  React.useEffect(() => {
    async function getContribuitorByEmail(email: string) {
      try {
        const url = "api/contribuitors/" + email;
        const response = await fetch(url, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (response.status == 200) {
          const { contribuitor } = await response.json();
          setContribuitor(contribuitor);
        } else {
          setContribuitor(null);
          console.log("Contribuitor not found in get by email");
        }
      } catch (error) {
        console.log(error);
      }
    }
    const token = window.localStorage.getItem("token");
    const contribuitorEmail = window.localStorage.getItem("email");
    if (token) {
      if (contribuitorEmail) {
        getContribuitorByEmail(contribuitorEmail);
      } else {
        setContribuitor(null);
        console.log("There is a token buu no contribuitor email!?");
      }
    }
  }, []);

  return (
    <ContribuitorContext.Provider value={{ contribuitor, setContribuitor }}>
      {props.children}
    </ContribuitorContext.Provider>
  );
};

export default ContribuitorStorage;
