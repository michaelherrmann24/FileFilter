import React,{Component} from "react";
import {Row,Col, Button} from 'react-bootstrap';
import {AWSContext} from "../../context/aws-context";
import {AWSProfileSelect} from "./AWSProfileSelect";
import {AWSRegionSelect} from "./AWSRegionSelect";
import {LogGroupSelect} from "../log-group/log-group-select";
import {LoadAWSProfiles} from "./AWSConfigFileDrop";

import "./AWSProfileSection.css";


const LOAD = 'load';
const SELECT = 'select'

export class AWSProfileSection extends Component{
    static contextType = AWSContext;

    constructor(){
        super();
        this.state = {view:LOAD}
    }

    toggleView(){
        this.state.view === LOAD?this.setState({view:SELECT}):this.setState({view:LOAD});
    }

    renderLoadProfile(){
        return (
            <Row className="p-4 profile-display" ><Col md={6}><LoadAWSProfiles></LoadAWSProfiles></Col></Row>
        )
    }
    renderSelectProfile(){
        return (
            <>
                <Row className="profile-display">
                    <Col md={3}><AWSProfileSelect></AWSProfileSelect></Col>
                    <Col md={3}><AWSRegionSelect></AWSRegionSelect></Col>
                    <Col md={6}>
                        <Row>
                        <Col md={12}>
                            <label>Assume Role</label>
                        </Col>
                        {/* <Col md={6}>
                            <input type="text" value="" placeholder="Account"/>
                        </Col>
                        <Col md={6}>
                            <input type="text" value="" placeholder="Role"/>
                        </Col> */}
                        </Row>
                    </Col>
                </Row>
                <Row className="profile-display">
                    <Col md={6}><LogGroupSelect test="test" profile={this.context.selectedProfile}></LogGroupSelect></Col>
                </Row>
            </>
        )
    }

    render(){
        return (
            <>
                <Button onClick={this.toggleView.bind(this)} variant="secondary" className="profile-load">{this.state.view === SELECT?'Load Profile':'Select Profile'}</Button>
                {this.state.view === SELECT?this.renderSelectProfile():this.renderLoadProfile()}
            </>
        );
    }
}