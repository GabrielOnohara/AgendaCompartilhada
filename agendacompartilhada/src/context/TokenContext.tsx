import React from "react";

export const TokenContext = React.createContext<any>("");

const TokenStorage = (props: any) => {
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    async function verifyToken(token: string) {
      try {
        const url = "api/token/validate";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "x-access-token": token,
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        if (response.status == 200) {
          setToken(token);
        } else {
          setToken("");
        }
      } catch (error) {
        console.log(error);
      }
    }
    const token = window.localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      verifyToken("");
    }
  }, []);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {props.children}
    </TokenContext.Provider>
  );
};

export default TokenStorage;
