import React from "react";

interface CurrentUserContextType {
  username: string;
}

export const UserContext = React.createContext<any>(undefined);

const UserStorage = (props:any) => {
  const [loggedIn, setLoggedIn] = React.useState(false);

  return (
    <UserContext.Provider value={{loggedIn, setLoggedIn}}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserStorage;