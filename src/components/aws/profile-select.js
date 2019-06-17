import React, { Component} from "react";
import FormControl from "react-bootstrap/FormControl";
import {AWSContext} from "../../context/aws-context";
import {AWSSelectProfile} from "../../actions/actions";

import "./profile-select.css";

export class AWSProfileSelect extends Component{
    static contextType = AWSContext;

    constructor(props) {
        super(props);
      }

    select(event){
        
        let selectedProfileEntry = Object.entries(this.context.aws).filter(([key,value])=>{
            return event.target.value === key;
        }).map(([key,value])=>{
            return value;
        }).reduce((currentValue,value)=>{
            return value;
        });

        if(selectedProfileEntry){
            this.context.dispatch(new AWSSelectProfile(selectedProfileEntry));
        }
            
    }

    componentDidMount() {
        this.context.dispatch(new AWSSelectProfile(this.context.aws['default']));
    }

    render(){
        return (
            <>
                <label>Profiles</label>
                <FormControl as="select" onChange={this.select.bind(this)} defaultValue="default">
                    {
                        Object.entries(this.context.aws).map( ([key,value])=>{
                            return (<option key={key} title={key} >{key}</option>)
                        })
                    } 
                </FormControl> 
            </>
        )
    }
}
