import React, { Component} from "react";

import {FileDrop} from "../file-drop/file-drop";
import {FileReaderService} from "../../service/FileReader";
import { AWSContext } from "../../context/aws-context";
import {SetAWSCredential,SetAWSOptions, SetAWSProfile,AWSProfilesLoaded,SetViewSection} from "../../actions/actions";

const SPLIT_LINES_REGEX =/\r\n|\n/;
const PROFILE_REGEX = /\[(.*?)\]/;
const KEY_VALUE_REGEX = /(.*?)=(.*)/;

export class LoadAWSProfiles extends Component{
    static contextType = AWSContext;

    async processFile(fileEntry){

        if(fileEntry.name === 'credentials' || fileEntry.name === 'config'){
            let reader = FileReaderService.getInstance();
            let actionClass = (fileEntry.name === 'credentials')? SetAWSCredential:SetAWSOptions;
            
            let content = await reader.readFile(await new Promise((resolve,reject)=>fileEntry.file(resolve,reject)));
            let currentProfile = null;

            content.split(SPLIT_LINES_REGEX).forEach((line)=>{
                
                let profRegRes = PROFILE_REGEX.exec(line);      
                if(profRegRes && profRegRes[1]){
                    currentProfile = profRegRes[1];

                    this.context.dispatch(new SetAWSProfile(currentProfile,{[currentProfile]:{}}));
                }

                let keyVal = KEY_VALUE_REGEX.exec(line);
                if(keyVal && keyVal[1] && keyVal[2]){
                    let value = {};
                    value[keyVal[1].trim()] = keyVal[2].trim();
                    
                    let actionInst = new actionClass(currentProfile,value);
                    this.context.dispatch(actionInst);
                    this.context.dispatch(new SetViewSection({left:"select"}))
                }

            });
        }
        return ;
    }

    async handleDrop(files){
        if(files && files.length > 0){
            let responses = [];
            for(let i=0;i<files.length;i++){
                responses.push(this.processFile(files[i]));
            }
            try{
                await Promise.all(responses);    
                this.context.dispatch(new AWSProfilesLoaded(true));
            }catch(e){
                console.error(e)
            }

        }
    }

    render(){
        return (
            <FileDrop theme="light" handleDrop={this.handleDrop.bind(this)}>Drop AWS profile files</FileDrop>
        );
    }
    
}
