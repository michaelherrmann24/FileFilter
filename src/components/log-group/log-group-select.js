import React,{Component} from 'react';
import {GlobalContext} from "../../context/global-context";
import FormControl from "react-bootstrap/FormControl";
import {CloudWatchLogsService} from "../../service/log-event-service";

import {AddLogGroups,SelectLogGroup} from "../../actions/actions";

export class LogGroupSelect extends Component{
    static contextType = GlobalContext;

    constructor(props){
        super(props);
        this.region = undefined;
        this.key = undefined;
        this.secret = undefined;
    };

    componentDidUpdate() {
        
        let profile = this.context.selectedProfile;

        let region = (profile && profile.options && profile.options.region) || this.region;
        let key = (profile && profile.credentials && profile.credentials.aws_access_key_id) || this.key;
        let secret = (profile && profile.credentials && profile.credentials.aws_secret_access_key) || this.secret;

        if(this.region !== region || this.key !== key || this.secret !== secret){
            
            this.region = region;
            this.key = key;
            this.secret = secret; 

            this.fetchLogGroups();   
        }
        
    } 

    async fetchLogGroups(){
        console.log("fetchLogGroups",this);
        if(this.key && this.secret && this.region){
            console.log("fetchLogGroups fetching",this);
            let cloudWatchLogsService = new CloudWatchLogsService(this.key,this.secret,this.region);
            try {
                let logGroups =  await cloudWatchLogsService.getLogGroups();
                this.context.dispatch(new AddLogGroups(logGroups));
            }catch(err){
                console.log(err);
            }
        }
    }

    componentDidMount(){
        let profile = this.context.selectedProfile;

        this.region = (profile && profile.options && profile.options.region) || null;
        this.key = (profile && profile.credentials && profile.credentials.aws_access_key_id) || null;
        this.secret = (profile && profile.credentials && profile.credentials.aws_secret_access_key) || null;

        console.log("componentDidMount",this);

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