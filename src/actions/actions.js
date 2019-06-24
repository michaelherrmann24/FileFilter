
export class AddLogGroups{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("AddLogGroups",this.value);
        return {...state,logGroups:this.value};
    }
}
export class SelectLogGroup{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SelectLogGroup",this.value);
        return {...state,selectedGroup:this.value};
    }
}

export class SetPage{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SetPage",this.value);
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
        console.log("SetIndex",this.value);
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
        console.log("SetRegexFilter",this.value);
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
        console.log("SetAWSCredential",this.value);
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
        console.log("SetAWSOptions",this.value);
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
        console.log("SetAWSProfile",this.value);
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
        console.log("AWSProfilesLoaded",this.value);
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
        console.log("AWSSelectProfile",this.value);
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
}
export class SetViewSection{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SetViewSection",this.value);
        return {
            ...state,
            views:{
                ...state.views,
                ...this.value
            }
        }
    }
}
export class SetPagination{SetAWSCredential
    constructor(value){
        this.value = value;
    }
    reduce(state){
        console.log("SetPagination",this.value);
        return {
            ...state,
            pagination:{
                ...state.pagination,
                ...this.value
            }
        }
    }
}

