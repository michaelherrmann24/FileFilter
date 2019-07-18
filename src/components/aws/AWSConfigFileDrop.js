import React, { Component} from "react";

import {FileDrop} from "../file-drop/file-drop";
import {FileReaderService} from "../../service/FileReader";
import { SyncContext } from "../../context/sync-context";
import {SetAWSProfile} from "../../actions/actions";

const SPLIT_LINES_REGEX =/\r\n|\n/;
const PROFILE_REGEX = /\[(.*?)\]/;
const KEY_VALUE_REGEX = /(.*?)=(.*)/;       

export class LoadAWSProfiles extends Component{
    static contextType = SyncContext;

    constructor({loadedHandler,rest}){
        super(rest);
        this.profilesLoaded = loadedHandler;
        this.profiles = {};
    }

    async processFile(fileEntry){

        if(fileEntry.name === 'credentials' || fileEntry.name === 'config'){
            let reader = FileReaderService.getInstance();

            let baseProfile = {credentials:{},options:{}}
            let actionValue = (fileEntry.name === 'credentials')? baseProfile.credentials:baseProfile.options;
            
            let content = await reader.readFile(await new Promise((resolve,reject)=>fileEntry.file(resolve,reject)));
            let currentProfile = null;



            content.split(SPLIT_LINES_REGEX).forEach((line)=>{
                
                let profRegRes = PROFILE_REGEX.exec(line);      
                if(profRegRes && profRegRes[1]){
                    currentProfile = profRegRes[1];
                }

                let keyVal = KEY_VALUE_REGEX.exec(line);
                if(keyVal && keyVal[1] && keyVal[2]){
                    actionValue[keyVal[1].trim()] = keyVal[2].trim();                                
                }

                this.profiles[currentProfile] = {
                    options:{
                        ...(this.profiles[currentProfile] && this.profiles[currentProfile].options),
                        ...baseProfile.options
                    },
                    credentials:{
                        ...(this.profiles[currentProfile] && this.profiles[currentProfile].credentials),
                        ...baseProfile.credentials
                    }
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
                if(this.profilesLoaded){
                    Object.entries(this.profiles).forEach(([key,value])=>{
                        this.context.dispatch(new SetAWSProfile(key,value));
                    });
                    this.profilesLoaded();
                }
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
