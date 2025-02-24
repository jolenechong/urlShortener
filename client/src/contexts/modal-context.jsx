import { createContext, ReactElement, useState, ComponentType } from "react";

export const ModelContext = createContext({ modalInfo: null, dispatchModalEvent: () => {} });

export const ModelContextProvider = (props) => {
    const { children } = props;
    const [modalInfo, setModelInfo] = useState({state: false, modalType: ''});

    const dispatchModalEvent = (actionType) => {
        switch(actionType){
          case 'openSignup':
            setModelInfo({
              state: true,
              modalType: 'signup'
            });
            return;
        case 'openLogin':
            setModelInfo({
                state: true,
                modalType: 'login'
            })
            return;
        case 'close':
          setModelInfo({
              state: false,
              modalType: modalInfo.modalType
          })
          return;
          }
      }

    return (
        <ModelContext.Provider value={{modalInfo: modalInfo, dispatchModalEvent: dispatchModalEvent}}>{children}</ModelContext.Provider>
    );
}

export const withModalContext = (Component) => (props) => {
    return (
        <ModelContextProvider>
            <Component {...props} />
        </ModelContextProvider>
    );
}