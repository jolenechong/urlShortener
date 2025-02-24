import { useState, createContext, useEffect } from "react";
import api from "../api";

export const UserContext = createContext([null, () => null]);

export const UserContextProvider = (props) => {
  const { children } = props; 
  const [ui, setUI] = useState(null);

  useEffect(() => {

    // TODO: why does context load twice
    let ignore = false;
    if (!ignore) {
      api.post("/api/auth/verify", {}, { withCredentials: true })
        .then(({ data }) => {

          if (!data) {
            // not authenticated
            setUI({ isAuthenticated: false });
          } else {
            const settingUI = data;
            settingUI.isAuthenticated = true;
            setUI(settingUI);
          }
        })
        .catch(({ response }) => {
          console.log(response);
        });

      return () => {
        ignore = true;
      };
    }
  }, []);

  return (
    <UserContext.Provider value={[ui, setUI]}>{children}</UserContext.Provider>
  );
};

export const withUserContext = (Component) => (props) => {
  return (
    <UserContextProvider>
      <Component {...props} />
    </UserContextProvider>
  );
};