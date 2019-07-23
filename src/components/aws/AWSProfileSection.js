import React,{Component} from "react";
import {Row,Col, Button} from 'react-bootstrap';
import {GlobalContext} from "../../context/global-context";
import {SyncContext} from "../../context/sync-context";
import {AWSProfileSelect} from "./AWSProfileSelect";
import {AWSRegionSelect} from "./AWSRegionSelect";
import {LogGroupSelect} from "../log-group/log-group-select";
import {LoadAWSProfiles} from "./AWSConfigFileDrop";
import {SetViewSection,AWSProfilesLoaded,SetLogEventFilters} from "../../actions/actions";
import "./AWSProfileSection.css";


const LOAD = "load";
const SELECT = "select";
const ROLES = "role";
const FILTERS = "filters";


const PERIOD_CHANGE_OPTIONS =[
    ()=>0,
    (value)=>new Date().setMonths(new Date().getMonths() - value),
    (value)=>new Date().setDate(new Date().getDate() - (7 * value)),
    (value)=>new Date().setDate(new Date().getDate() - value),
    (value)=>new Date().setHours(new Date().getHours() - value),
    (value)=>new Date().setMinutes(new Date().getMinutes() - value),
    (value)=>new Date().setSeconds(new Date().getSeconds() - value)
];

export class AWSProfileSection extends Component{
    static contextType = GlobalContext;

    constructor(props){
        super(props);

        this.state = {
            periodFn : PERIOD_CHANGE_OPTIONS[0],
            timeValue : 0
        }
    }

    toggleLeftSide(){
        this.context.dispatch(new SetViewSection({left:this.context.views.left === LOAD?SELECT:LOAD}));
    }
    toggleRightSide(){
        this.context.dispatch(new SetViewSection({right:this.context.views.right === ROLES?FILTERS:ROLES}));
    }

    render(){
        return (
            <>
                {
                    this.context.profilesLoaded && (
                        <div className="aws-section-button-container">
                            <Button onClick={this.toggleLeftSide.bind(this)} variant="secondary" className="aws-section-btn profile-load">{this.context.views.left === SELECT?'Load Profiles':'Use Profiles'}</Button>
                            <Button onClick={this.toggleRightSide.bind(this)} variant="secondary" className="aws-section-btn assume-role">{this.context.views.right === FILTERS?'Assume Rule':'Log Filters'}</Button>
                        </div>
                    )
                }
                <Row>
                    <Col className="p-0">{this.context.views.left === SELECT?this.renderSelectProfile():this.renderLoadProfile()}</Col>
                    {
                        this.context.profilesLoaded && (
                            <Col className="p-0">{this.context.views.right === FILTERS?this.renderAWSFiltersSection():this.renderRoleSection()}</Col>
                        )
                    }
                </Row>
                {
                    this.context.profilesLoaded && (
                        <Row className="profile-display">
                            <Col md={6} ><LogGroupSelect profile={this.context.selectedProfile}></LogGroupSelect></Col>
                        </Row>
                    )
                } 
            </>
        );
    }

    loadedProfilesHandler(){
        this.context.dispatch(new SetViewSection({left:"select"}));
        this.context.dispatch(new AWSProfilesLoaded(true));
    }

    handleTimeChange(evt){
        this.setState({timeValue : evt.target.value});
        this.context.dispatch(new SetLogEventFilters({startTime:this.state.periodFn(evt.target.value)}));
    }
    handlePeriodChange(evt){
        let fn = PERIOD_CHANGE_OPTIONS[evt.target.value]
        this.setState({periodFn : fn});
        this.context.dispatch(new SetLogEventFilters({startTime:fn(this.state.timeValue)}));
    }

    renderRoleSection(){
        return (<div>Roles</div>)
    }

    renderAWSFiltersSection(){
        return (<div>
            <Row className="p-0">
                <Col>
                <label>Filter Start Time</label>
                <div className="form-inline">
                <input className="form-control" type="number" placeholder="num" onChange={this.handleTimeChange.bind(this)}/>
                <select className="form-control" onChange={this.handlePeriodChange.bind(this)}>
                    <option value={0}>All time</option>
                    <option value={1}>Months</option>
                    <option value={2}>Weeks</option>
                    <option value={3}>Days</option>
                    <option value={4}>Hours</option>
                    <option value={5}>Mins</option>
                    <option value={6}>Seconds</option>
                </select>
                </div>
                </Col>
            </Row>
        </div>
        )
    }

    renderLoadProfile(){
        return (
            <Row className="profile-display" ><Col md={12}><LoadAWSProfiles loadedHandler={this.loadedProfilesHandler.bind(this)}></LoadAWSProfiles></Col></Row>
        )
    }
    renderSelectProfile(){
        return (
            <Row className="profile-display p-0">
                <Col md={6} >
                    <SyncContext.Consumer>
                        {ctx=>(<AWSProfileSelect profiles={ctx.aws}></AWSProfileSelect>)}
                    </SyncContext.Consumer>
                </Col>    
                <Col md={6} ><AWSRegionSelect></AWSRegionSelect></Col>
            </Row>
        )
    }
}