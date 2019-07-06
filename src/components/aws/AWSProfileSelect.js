import React, { Component} from "react";
import FormControl from "react-bootstrap/FormControl";
import {GlobalContext} from "../../context/global-context";
import {AWSSelectProfile} from "../../actions/actions";

import "./AWSProfileSelect.css";

export class AWSProfileSelect extends Component{
    static contextType = GlobalContext;

    constructor({profiles,rest}) {
        super({...profiles,...rest});
        this.state = {profiles:profiles} || {profiles:{}};
      }

    select(event){
        
        let selectedProfileEntry = Object.entries(this.state.profiles).filter(([key,value])=>{
            return event.target.value === key;
        }).map(([key,value])=>{
            return value;
        }).reduce((currentValue,value)=>{
            return value;
        });

        console.log("selectedProfileEntry",selectedProfileEntry);
        if(selectedProfileEntry){
            this.context.dispatch(new AWSSelectProfile(selectedProfileEntry));
        }
            
    }

    componentDidMount() {
       this.context.dispatch(new AWSSelectProfile(this.state.profiles['default']));
    }

    render(){
        return (
            <>
                <label>Profile</label>
                <FormControl as="select" onChange={this.select.bind(this)} defaultValue="default">
                    {
                        Object.entries(this.state.profiles).map( ([key,value])=>{
                            return (<option key={key} title={key} >{key}</option>)
                        })
                    } 
                </FormControl> 
            </>
        )
    }
}
