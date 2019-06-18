import React, { Component} from "react";
import {FormControl} from "react-bootstrap";
import { AWSContext } from "../../context/aws-context";
// import {SetAWSCredential,SetAWSOptions, SetAWSProfile,A
export class AWSRegionSelect extends Component{
    static contextType = AWSContext;

    render(){
        console.log("ctx",this.context);
        return (
            <>
                <label>Profile</label>
                <FormControl as="select"  defaultValue={this.context.selectedProfile.region}>
                    {
                        Object.entries(this.context.regions).map( ([key,value])=>{
                            return (<option key={key} >{value}</option>)
                        })
                    } 
                </FormControl> 
            </>
        )
    }
    
}
