import React,{createContext,useReducer} from "react"; 

export const InitGlobalState = {
    logGroups:[],
    selectedGroup:{},
    page:[],
    index:[],
    filters:{},
    pagination:{
        page:0,
        pageSize:500,
    },
    selectedProfile:{
      options:{},
      credentials:{}
    },
    profilesLoaded:false,
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
    views:{
      right:"filters",
      left:"load"
    }
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


