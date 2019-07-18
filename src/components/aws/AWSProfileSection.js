import React,{Component} from "react";
import {Row,Col, Button} from 'react-bootstrap';
import {GlobalContext} from "../../context/global-context";
import {SyncContext} from "../../context/sync-context";
import {AWSProfileSelect} from "./AWSProfileSelect";
import {AWSRegionSelect} from "./AWSRegionSelect";
import {LogGroupSelect} from "../log-group/log-group-select";
import {LoadAWSProfiles} from "./AWSConfigFileDrop";
import {SetViewSection,AWSProfilesLoaded} from "../../actions/actions";
import "./AWSProfileSection.css";


const LOAD = "load";
const SELECT = "select";
const ROLES = "role";
const FILTERS = "filters";

export class AWSProfileSection extends Component{
    static contextType = GlobalContext;

    constructor(props){
        super(props);
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
        console.log("loadedProfilesHandler - executing");;
        this.context.dispatch(new SetViewSection({left:"select"}));
        this.context.dispatch(new AWSProfilesLoaded(true));
    }

    renderRoleSection(){
        return (<div>Roles</div>)
    }

    renderAWSFiltersSection(){
        return (<div>AWS LOG Filter Section</div>)
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