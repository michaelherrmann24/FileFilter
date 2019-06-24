
export class AddLogGroups{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("AddLogGroups");
        return {...state,logGroups:this.value};
    }
}
export class SelectLogGroup{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SelectLogGroup");
        return {...state,selectedGroup:this.value};
    }
}

export class SetPage{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SetPage");
        return {
            ...state,
            page:this.value
        };
    }
}

export class SetIndex{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SetIndex");
        return {
            ...state,
            index:this.value
        };
    }
}


export class SetRegexFilter{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SetRegexFilter");
        return {
            ...state,
            filters:{
                ...state.filters,
                regexFilter:this.value
            }
        };
    }
}

export class SetAWSCredential{
    constructor(profile,value){
        this.value = value;
        this.profile = profile;
    }
    reduce(state){
        console.log("SetAWSCredential");
        let results = {
            ...state,
            aws:{
                ...state.aws,
                [this.profile]:{
                    ...state.aws[this.profile],
                    credentials:{
                        ...state.aws[this.profile].credentials,
                        ...this.value
                    }
                }
            }
        };
        return results;
    }
}

export class SetAWSOptions{
    constructor(profile,value){
        this.value = value;
        this.profile = profile;
    }
    reduce(state){
        console.log("SetAWSOptions");
        let results = {
            ...state,
            aws:{
                ...state.aws,
                [this.profile]:{
                    ...state.aws[this.profile],
                    options:{
                        ...state.aws[this.profile].options,
                        ...this.value
                    }
                }
            }
        };
        return results;
    }
}
export class SetAWSProfile{
    constructor(profile, value){
        this.value = value; 
        this.profile = profile;
    }
    reduce(state){
        console.log("SetAWSProfile");
        let results = {
            ...state,
            aws:{
                ...state.aws,
                [this.profile]:{
                    ...state.aws[this.profile],
                    ...this.value[this.profile]      
                }
            }
        };
        return results;
    }
}

export class AWSProfilesLoaded{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("AWSProfilesLoaded");
        return {
            ...state,
            profilesLoaded:this.value
        }
    }
}

export class AWSSelectProfile{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("AWSSelectProfile");
        return {
            ...state,
            selectedProfile:{
                ...state.selectedProfile,
                options:{
                   ...state.selectedProfile.options,
                    ...this.value.options
                },
                credentials:{
                    ...state.selectedProfile.credentials,
                    ...this.value.credentials
                }
            }
        }
    }
}export class SetPagination{SetAWSCredential
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SetPagination");
        return {
            ...state,
            pagination:{
                ...state.pagination,
                ...this.value
            }
        }
    }
}

