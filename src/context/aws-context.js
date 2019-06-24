import React,{createContext,useReducer} from "react"; 

export const InitAWSState = {
    aws:{
        
    },
    profilesLoaded:false,
    selectedProfile:{
      options:{},
      credentials:{}
    },
    regions:{
      "us-east-2" : "US East (Ohio)",
      "us-east-1" : "US East (N. Virginia)",
      "us-west-1" : "US West (N. California)",
      "us-west-2" : "US West (Oregon)",
      "ap-east-1" : "Asia Pacific (Hong Kong)",
      "ap-south-1" : "Asia Pacific (Mumbai)",
      "ap-northeast-3" : "Asia Pacific (Osaka-Local)",
      "ap-northeast-2" : "Asia Pacific (Seoul)",
      "ap-southeast-1" : "Asia Pacific (Singapore)",
      "ap-southeast-2" : "Asia Pacific (Sydney)",
      "ap-northeast-1" : "Asia Pacific (Tokyo)",
      "ca-central-1" : "Canada (Central)",
      "cn-north-1" : "China (Beijing)",
      "cn-northwest-1" : "China (Ningxia)",
      "eu-west-1" : "EU (Ireland)",
      "eu-west-2" : "EU (London)",
      "eu-west-3" : "EU (Paris)",
      "eu-north-1" : "EU (Stockholm)",
      "sa-east-1" : "South America (São Paulo)",
      "us-gov-east-1" : "AWS GovCloud (US-East)",	
      "us-gov-west-1" : "AWS GovCloud (US)"		
    },
    viewSection:'load'

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


