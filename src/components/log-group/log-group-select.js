import React,{Component} from 'react';
import {GlobalContext} from "../../context/global-context";
import FormControl from "react-bootstrap/FormControl";
import {CloudWatchLogsService} from "../../service/log-event-service";

import {AddLogGroups,SelectLogGroup} from "../../actions/actions";

export class LogGroupSelect extends Component{
    static contextType = GlobalContext;

    constructor(props){
        super(props);
    }

    async componentDidUpdate(prevProps) {
        
        let {profile} = this.props;
        
        if( profile && profile !== prevProps.profile){
           let region = profile.options.region;
            let key = profile.credentials.aws_access_key_id;
            let secret = profile.credentials.aws_secret_access_key; 

            if(key && secret){
                let cloudWatchLogsService = new CloudWatchLogsService(key,secret,region);
                try {
                    let logGroups =  await cloudWatchLogsService.getLogGroups();
                    this.context.dispatch(new AddLogGroups(logGroups));
                }catch(err){
                    console.log(err);
                }
            }
        }
  
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