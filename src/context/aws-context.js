import React,{createContext,useReducer} from "react"; 

export const InitAWSState = {
    aws:{
        
    },
    profilesLoaded:false

};

export const AWSContext = createContext(InitAWSState);

export const reducer = (state, action) => {
    return (action && action.reduce && action.reduce(state)) || state;
}

export const AWSState = ({ children }) => {
    
    const [state, dispatch] = useReducer(reducer, InitAWSState);

    return (
      <AWSContext.Provider value={{...state, dispatch}}>
        {children}
      </AWSContext.Provider>
    )
  }


