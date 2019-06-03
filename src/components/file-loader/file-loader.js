import React, { Component } from "react";
import "./file-loader.css";
export class FileLoader extends Component {
  constructor() {
    super();
    this.dropRef = React.createRef();
  }

  handleDrag(e) {
    console.log(e);
  }
  handleDragIn(e) {
    console.log(e);
  }
  handleDragOut(e) {
    console.log(e);
  }
  handleDrop(e) {
    console.log(e);
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
      <div class="file-load-wrapper" ref={this.dropRef}>
        <div class="file-load">Drop File</div>
      </div>
    );
  }
}
