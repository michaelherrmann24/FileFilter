import React, { Component} from "react";
import {FormControl} from "react-bootstrap";
import { AWSContext } from "../../context/aws-context";
import {AWSSelectProfile} from "../../actions/actions";
// import {SetAWSCredential,SetAWSOptions, SetAWSProfile,A

const DEFAULT_REGION = "ap-southeast-2";
export class AWSRegionSelect extends Component{
    static contextType = AWSContext;

    changeHandler(event){
        this.context.dispatch(new AWSSelectProfile({options:{region:event.target.value}}));
    }

    render(){
        let selectedRegion =  this.context.selectedProfile && this.context.selectedProfile.options && this.context.selectedProfile.options.region || DEFAULT_REGION

        return (
            <>
                <label>Region</label>
                <FormControl as="select" onChange={this.changeHandler.bind(this)} defaultValue={selectedRegion}>
                    {   Object.entries(this.context.regions).map( ([key,value])=>{
                            return (
                                    <option key={key} value={key}>{value}</option>
                                )   
                        })
                    } 
                </FormControl> 
            </>
        )
    
    }
}
