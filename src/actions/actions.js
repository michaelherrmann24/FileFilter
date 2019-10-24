
export class AddLogGroups{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        return {...state,logGroups:this.value};
    }
}
export class SelectLogGroup{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        return {...state,selectedGroup:this.value};
    }
}

export class SetPage{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        return {
            ...state,
            page:this.value
        };
    }
}


export class SetTail{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        return {
            ...state,
            tail:this.value
        };
    }
}

export class SetIndex{
    constructor(value){
        this.value = value;
    }
    reduce(state){
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
        return {
            ...state,
            filters:{
                ...state.filters,
                regexFilter:this.value
            }
        };
    }
}

export class SetAWSProfile{
    constructor(profile, value){
        this.value = value; 
        this.profile = profile;
    }
    reduce(state){
        let results = {
            ...state,
            aws:{
                ...state.aws,
                [this.profile]:{
                    ...state.aws[this.profile],
                    options:{
                        ...(state.aws[this.profile] && state.aws[this.profile].options),
                        ...(this.value && this.value.options)
                    },
                    credentials:{
                        ...(state.aws[this.profile] && state.aws[this.profile].credentials),
                        ...(this.value && this.value.credentials)
                    }
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
        return {
            ...state,
            views:{
                ...state.views,
                ...this.value
            }
        }
    }
}
export class SetPagination{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        return {
            ...state,
            pagination:{
                ...state.pagination,
                ...this.value
            }
        }
    }
}

export class SyncData{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        return {
            ...this.value
        }
    }
}

export class SetLogEventFilters{
    constructor(value){
        this.value = value;
    }
    reduce(state){
        return {
            ...state,
            logEventFilters:{
                ...state.logEventFilters,
                ...this.value
            }
        }
    }
}