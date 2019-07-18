import React,{Component} from 'react';
import {GlobalContext} from "../../context/global-context";
import FormControl from "react-bootstrap/FormControl";
import {CloudWatchLogsService} from "../../service/log-event-service";

import {AddLogGroups,SelectLogGroup} from "../../actions/actions";

export class LogGroupSelect extends Component{
    static contextType = GlobalContext;

    constructor({profile,rest}){
        super({...profile,...rest});
    }
    componentDidUpdate(nextProps){
        let {profile} = this.props;
        let nProfile = nextProps && nextProps.profile;

        let region = (profile && profile.options && profile.options.region) || null;
        let key = (profile && profile.credentials && profile.credentials.aws_access_key_id) || null;
        let secret = (profile && profile.credentials && profile.credentials.aws_secret_access_key) || null; 

        let nRegion = (nProfile && nProfile.options && nProfile.options.region) || null;
        let nKey = (nProfile && nProfile.credentials && nProfile.credentials.aws_access_key_id) || null;
        let nSecret = (nProfile && nProfile.credentials && nProfile.credentials.aws_secret_access_key) || null;

        return region !== nRegion || key !== nKey || secret !== nSecret;

    }
    componentDidUpdate(prevProps) {
        
        let {profile} = this.props;

        console.log("loggroup select componentDidUpdate",this);

        let prevprofile = prevProps && prevProps.profile;

        let region = (profile && profile.options && profile.options.region) || null;
        let key = (profile && profile.credentials && profile.credentials.aws_access_key_id) || null;
        let secret = (profile && profile.credentials && profile.credentials.aws_secret_access_key) || null; 

        let prevregion = (prevprofile && prevprofile.options && prevprofile.options.region) || null;
        let prevkey = (prevprofile && prevprofile.credentials && prevprofile.credentials.aws_access_key_id) || null;
        let prevsecret = (prevprofile && prevprofile.credentials && prevprofile.credentials.aws_secret_access_key) || null; 

        console.log(region,prevregion,key,prevkey,secret,prevsecret,region !== prevregion || key !== prevkey || secret !== prevsecret)
        if(region !== prevregion || key !== prevkey || secret !== prevsecret){
            this.fetchLogGroups(profile);   
        }
        
    } 
//
    async fetchLogGroups(profile){
        let region = (profile && profile.options && profile.options.region) || null;
        let key = (profile && profile.credentials && profile.credentials.aws_access_key_id) || null;
        let secret = (profile && profile.credentials && profile.credentials.aws_secret_access_key) || null; 

        console.log(key,secret,region,key && secret && region);
        if(key && secret && region){
            let cloudWatchLogsService = new CloudWatchLogsService(key,secret,region);
            try {
                let logGroups =  await cloudWatchLogsService.getLogGroups();
                this.context.dispatch(new AddLogGroups(logGroups));
            }catch(err){
                console.log(err);
            }
        }
    }

    componentDidMount(){
        let {profile} = this.props;
        this.fetchLogGroups(profile);
    }

    selectLogGroup(event){
        this.context.dispatch(new SelectLogGroup(this.context.logGroups[event.target.value]));
    }

    render(){
        return (
            <>
                <label>Log Group</label>
                <FormControl as="select" onChange={this.selectLogGroup.bind(this)} defaultValue="">
                    <option></option>
                    {
                        this.context.logGroups.map((lg,index)=>{
                            return (<option key={index} value={index} >{lg.logGroupName}</option>)
                        })
                    }
                </FormControl>        
            </>
        )
    }
}