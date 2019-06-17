import React,{Component} from "react";
import {FormControl} from "react-bootstrap";
import {FileDrop} from "../file-drop/file-drop"
import {FileReaderService} from "../../service/FileReader"
import { SetPage } from "../../actions/actions";
import { GlobalContext } from "../../context/global-context";
const SPLIT_LINES_REGEX =/\r\n|\n/;

export class FileInput extends Component{
    static contextType = GlobalContext;
    constructor(props){
        super(props);
        this.state = {files:[]};
    }

    async processFile(file){
        let reader = FileReaderService.getInstance();

        //should probably check the file size and split it up into chunks. then join lines together later.


        let content = await reader.readFile(file);

        let lines = content.split(SPLIT_LINES_REGEX);
        this.context.dispatch(new SetPage(lines));
    }

    async handleDrop(files){
        console.log("files",files);
        let filArr = []
        if(files && files.length > 0){
            let responses = [];
            for(let i=0;i<files.length;i++){
                filArr.push(files[i]);
            }
            this.setState({files:filArr});
            this.processFile(filArr[0]);
        }

    }

    selectFile(event){
        let selectedFile = this.state.files.filter((file)=>{
            return event.target.value === file.name;
        }).reduce((cur,value)=>{
            return value;
        })
        this.processFile(selectedFile);
    }

    render(){
        console.log("state",this.state);
        if(this.state.files.length > 0){
            return (
                <>
                    <label>Files</label>
                    <FormControl as="select" onChange={this.selectFile.bind(this)} defaultValue={this.state.files[0]}>
                        {
                            this.state.files.map((file)=>{
                                console.log(file);
                                return (<option key={file.name} value={file.name} title={file.name} >{file.name}</option>)
                            })
                        } 
                    </FormControl> 
                </> 
            )
        }else{
            return (<FileDrop theme="light" handleDrop={this.handleDrop.bind(this)}>Drop file</FileDrop>)
        }

        
    }
}