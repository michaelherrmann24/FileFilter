import React,{createContext,useReducer} from "react"; 

export const InitGlobalState = {
    logGroups:[],
    selectedGroup:{},
    page:[],
    filters:{},
    pagination:{
        page:0,
        pageSize:500
    },
};

export const GlobalContext = createContext(InitGlobalState);

export const reducer = (state, action) => {
    return (action && action.reduce && action.reduce(state)) || state;
}

export const GlobalState = ({ children }) => {
    
    const [state, dispatch] = useReducer(reducer, InitGlobalState);

    return (
      <GlobalContext.Provider value={{...state, dispatch}}>
        {children}
      </GlobalContext.Provider>
    )
  }


