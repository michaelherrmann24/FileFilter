import React,{Component} from 'react';
import {Row,Col,Container} from "react-bootstrap";

import {GlobalContext} from "../../context/global-context";

import {CloudWatchLogsService} from "../../service/log-event-service";

import {LogEventsReceived} from "../../actions/actions";

import "./log-events.css";

export class LogEvents extends Component{
    
    static contextType = GlobalContext;

    constructor(props){
        super(props)
    }


    async fetchEvents(){
        let {profile,logGroup} = this.props;
        let region = profile.options.region;
        let key = profile.credentials.aws_access_key_id;
        let secret = profile.credentials.aws_secret_access_key; 

        if(key && secret){
            let cloudWatchLogsService = new CloudWatchLogsService(key,secret,region);
            try{
                let logEvents =  await cloudWatchLogsService.getLogEvents({logGroupName:logGroup,logStreamNamePrefix:"20"});
                this.context.dispatch(new LogEventsReceived(logEvents));
            }catch(err){
                console.log(err);
            }
        }
    }

    componentDidMount(){
        this.fetchEvents();
    }

    componentDidUpdate(prevProps) {
    
        let {profile,logGroup} = this.props;
        if(profile && logGroup && profile !== prevProps.profile && logGroup !== prevProps.logGroup ){
            this.fetchEvents();
        }
    }

    render(){
        return (
            <Container fluid={true}>
                {this.context.logevents.filter((evt)=>{
                    return  (this.context.filters && this.context.filters.regexFilter)?this.context.filters.regexFilter.test(evt.message):true;
                }).map((evt,index)=>{
                    return (
                        <Row key={index}>
                        <div className="num-col text-center">{index}</div>
                        <Col md={11} >{evt.message}</Col>
                    </Row>)
                })}
            </Container>
        )
    }
}