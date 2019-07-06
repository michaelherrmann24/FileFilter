import React, { Component } from "react";

import "./file-drop.css";
const themes = {
  dark:{
    "--color": "midnightblue",
    "--highlight-color":"yellow",
    "--opacity":"0.9",
  },
  light:{
      "--color":"white",
      "--highlight-color":"yellow",
      "--opacity":"0.6",
  }
};

export class FileDrop extends Component {
  constructor(props) {
    super(props);
    this.dropRef = React.createRef();
    this.state = {highlight:""};
  }

  stopEvent(e){
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragOver(e) {
    this.stopEvent(e);
    this.setHighlight(true);
  }
  handleDragIn(e) {
    this.stopEvent(e);
    this.setHighlight(true);
  }
  handleDragOut(e) {
    this.stopEvent(e);
    this.setHighlight(false);
  }

  async traverseDirectory(dir){
    let returnFiles = [];

      let direntries = await this.readDirectory(dir);
      for(let entry of direntries){
        if(entry.isDirectory){
          let entries = await this.traverseDirectory(entry);
          returnFiles = returnFiles.concat(entries);
        }else{
          returnFiles = returnFiles.concat([entry])
        }
      }
      return returnFiles;
  }

  readDirectory(dir){
    return new Promise((resolve,reject)=>{
      dir.createReader().readEntries((entries)=>{
        resolve(entries);
      },(err)=>{
        reject(err);
      });
    });
  }

  async handleDrop(e) {
    this.stopEvent(e);
    this.setHighlight(false);
    let files =[];

    for(let item of e.dataTransfer.items){

      let entry  = item.webkitGetAsEntry();

      if(entry.isDirectory){
        let entries = await this.traverseDirectory(entry);
        files = files.concat(entries);
      }else{
        files = files.concat([entry])
      }
    }

    if(this.props.handleDrop){
      try{
        this.props.handleDrop(files);
      }catch(e){
        console.error("error handling Drop event",e);
      }
      
    }
  }

  setHighlight(highlight){
    this.setState((state)=>{
      return {...state, highlight:(highlight)? "highlight" : ""};
    });
  }

  componentDidMount() {

    this.updateCSSVariables(themes[this.props.theme]);
    // this.setHighlight(false);
    let div = this.dropRef.current;
    if (div) {
      div.addEventListener("dragenter", this.handleDragIn.bind(this));
      div.addEventListener("dragleave", this.handleDragOut.bind(this));
      div.addEventListener("dragover", this.handleDragOver.bind(this));
      div.addEventListener("drop", this.handleDrop.bind(this));
    }
  }

  componentWillUnmount() {
    let div = this.dropRef.current;

    if (div) {
      div.removeEventListener("dragenter", this.handleDragIn);
      div.removeEventListener("dragleave", this.handleDragOut);
      div.removeEventListener("dragover", this.handleDragOver);
      div.removeEventListener("drop", this.handleDrop);
    }
  }

  updateCSSVariables(theme) {
    Object.entries(theme).forEach(([prop, value]) => this.dropRef.current.style.setProperty(prop, value));
  }

  render() {
    return (
      <div className={`file-drop-wrapper ${this.state.highlight}`} ref={this.dropRef}>
        <div className={`file-drop ${this.state.highlight}`}>{this.props.children}</div>
      </div>
    );
  }
}
