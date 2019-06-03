import React, { Component } from "react";
import "./file-loader.css";
export class FileLoader extends Component {
  constructor() {
    super();
    this.dropRef = React.createRef();
  }

  handleDrag(e) {
    console.log('drag',e);
  }
  handleDragIn(e) {
    console.log('drag in',e);
  }
  handleDragOut(e) {
    console.log('drag out',e);
  }
  handleDrop(e) {
    console.log('drop',e);
  }

  componentDidMount() {
    let div = this.dropRef.current;
    if (div) {
      div.addEventListener("dragenter", this.handleDragIn);
      div.addEventListener("dragleave", this.handleDragOut);
      div.addEventListener("dragover", this.handleDrag);
      div.addEventListener("drop", this.handleDrop);
    }
  }

  componentWillUnmount() {
    let div = this.dropRef.current;
    if (div) {
      div.removeEventListener("dragenter", this.handleDragIn);
      div.removeEventListener("dragleave", this.handleDragOut);
      div.removeEventListener("dragover", this.handleDrag);
      div.removeEventListener("drop", this.handleDrop);
    }
  }

  render() {
    return (
      <div className="file-load-wrapper" ref={this.dropRef}>
        <div className="file-load">Drop File</div>
      </div>
    );
  }
}
