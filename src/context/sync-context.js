import React,{createContext,useReducer} from "react"; 

export const InitSyncState = {
    aws:{
        
    }
};

export const SyncContext = createContext(InitSyncState);

export const reducer = (state, action) => {
    return (action && action.reduce && action.reduce(state)) || state;
}

export const SyncState = ({ children }) => {
    
    const [state, dispatch] = useReducer(reducer, InitSyncState);

    return (
      <SyncContext.Provider value={{...state, dispatch}}>
        {children}
      </SyncContext.Provider>
    )
  }


