import React,{Component} from "react";
import {Row,Col, Button} from 'react-bootstrap';
import {AWSContext} from "../../context/aws-context";
import {AWSProfileSelect} from "./AWSProfileSelect";
import {AWSRegionSelect} from "./AWSRegionSelect";
import {LogGroupSelect} from "../log-group/log-group-select";
import {LoadAWSProfiles} from "./AWSConfigFileDrop";
import {SetViewSection} from "../../actions/actions";
import "./AWSProfileSection.css";


const LOAD = 'load';
const SELECT = 'select'

export class AWSProfileSection extends Component{
    static contextType = AWSContext;

    constructor(){
        super();
    }

    toggleView(){
        this.context.dispatch(new SetViewSection(this.context.viewSection === LOAD?SELECT:LOAD));
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
                <Button onClick={this.toggleView.bind(this)} variant="secondary" className="profile-load">{this.context.viewSection === SELECT?'Load Profile':'Select Profile'}</Button>
                {this.context.viewSection === SELECT?this.renderSelectProfile():this.renderLoadProfile()}
            </>
        );
    }
}