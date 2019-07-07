import React,{Component} from "react";
import {FormControl,Form,Col,Row} from "react-bootstrap";
import {FileDrop} from "../file-drop/file-drop"
import {FileReaderService} from "../../service/FileReader"
import { SetPage,SetTail,SetPagination} from "../../actions/actions";
import { GlobalContext } from "../../context/global-context";
const SPLIT_LINES_REGEX =/\r\n|\n/;

export class FileInput extends Component{
    static contextType = GlobalContext;
    constructor(props){
        super(props);
        this.state = {files:[]};
    }

    async processFile(fileEntry){
        let reader = FileReaderService.getInstance();

        //should probably check the file size and split it up into chunks. then join lines together later.
        let content = await reader.readFile(await new Promise((resolve,reject)=>fileEntry.file(resolve,reject)));

        let lines = content.split(SPLIT_LINES_REGEX);
        this.context.dispatch(new SetPage(lines));
    }

    async processFileDelta(fileEntry,start,end){
        let reader = FileReaderService.getInstance();
        let file = (await new Promise((resolve,reject)=>fileEntry.file(resolve,reject))).slice(start,end);
        let content = await reader.readFile(file);

        let lines = content.split(SPLIT_LINES_REGEX);
        this.context.dispatch(new SetPage(this.context.page.concat(lines)));
    }

    async handleDrop(files){
        let filArr = []
        if(files && files.length > 0){
            let responses = [];
            for(let i=0;i<files.length;i++){
                filArr.push(files[i]);
            }
            this.setState({files:filArr,selectedFile:filArr[0]});
            this.processFile(filArr[0]);
        }

    }

    selectFile(event){
        let selectedFile = this.state.files.filter((file)=>{
            return event.target.value === file.fullPath;
        }).reduce((cur,value)=>{
            return value;
        });
        this.setState({selectedFile:selectedFile});
        this.processFile(selectedFile); //set the file as selected. 

    }

    tailFile(fileEntry){
        
        fileEntry.file((file,err)=>{
            if(this.state.fileSize !== file.size){
                this.setState({fileSize:file.size});
            }
        });
    }

    toggleTail(event){
       this.context.dispatch(new SetTail(event.target["checked"])); 
    }

    componentDidUpdate(prevProps,prevState){



        if(this.state.tail && this.state.selectedFile && 
                !(prevState && prevState.tail && prevState.selectedFile && prevState.selectedFile === this.state.selectedFile)
            ){
            let intervalId = window.setInterval(this.tailFile.bind(this),500,this.state.selectedFile);
            this.setState({intervalId:intervalId});   
        }else if(!this.context.tail){    
            this.state.intervalId && window.clearInterval(this.state.intervalId);
        }


        if(prevState.fileSize && prevState.fileSize !== this.state.fileSize){

            if(prevState.fileSize < this.state.fileSize){
                this.processFileDelta(this.state.selectedFile,prevState.fileSize,this.state.fileSize);
            }else{
                this.processFile(this.state.selectedFile);
            }
            
            //read the file dif;
        }

        let pagination = this.context.pagination;

        if(pagination.lines && this.context.tail){
            let pages = Math.ceil(pagination.lines / pagination.pageSize);
            if(pagination.page !== pages-1){
                this.context.dispatch(new SetPagination({page:(pages-1)}));
            }
        }

        this.context.tail !== this.state.tail && this.setState({tail:this.context.tail});
    }

    
    componentWillUnmount(){
        this.state.intervalId && window.clearInterval(this.state.intervalId);
    }

    render(){
        if(this.state.files.length > 0){
            return (
                <>
                    <label>Files</label>
                    <Row>
                        <Col md={11}>
                            <FormControl as="select" onChange={this.selectFile.bind(this)} defaultValue={this.state.files[0]}>
                                {
                                    this.state.files.map((file)=>{
                                        return (<option key={file.fullPath} value={file.fullPath} >{file.fullPath}</option>)
                                    })
                                } 
                            </FormControl> 
                        </Col>
                        <Col md={1}><Form.Check type="checkbox" label="tail" onChange={this.toggleTail.bind(this)} checked={this.context.tail || false}/></Col> 
                    </Row>
                </> 
            )
        }else{
            return (<FileDrop theme="light" handleDrop={this.handleDrop.bind(this)}>Drop file</FileDrop>)
        }

        
    }
}