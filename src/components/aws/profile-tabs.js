import React, { Component} from "react";
import {Row,Col} from 'react-bootstrap';
import {AWSContext} from "../../context/aws-context";
import {AWSSelectProfile} from "../../actions/actions";

import "./profile-tabs.css";

export class AWSProfileTabs extends Component{
    static contextType = AWSContext;

    constructor(props) {
        super(props);
        this.state = {selected:"default"};
      }

    select(key,value){
        return (evt)=>{
            console.log(this.context,key,value);
            this.setState({selected:key});
            this.context.dispatch(new AWSSelectProfile(value));
        }
    }

    componentDidMount() {
        this.context.dispatch(new AWSSelectProfile(this.context.aws[this.state.selected]));
    }

    render(){
        return (
            <Row>
                {
                    Object.entries(this.context.aws).map( ([key,value])=>{
                        return (<Col className={`tab + ${(this.state.selected === key)?' selected':''}` } md="auto" key={key} onClick={this.select(key,value)}>{key}</Col>)
                    })
                } 
            </Row>
        )
    }
}
