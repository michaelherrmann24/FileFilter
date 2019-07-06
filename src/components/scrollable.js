import React,{Component} from "react";
import {ScrollTo} from "./scroll-to";

export class Scrollable extends Component {
    constructor(props) {
        super(props);
        this.scrollRef = React.createRef()   // Create a ref object 
    }
   

    render() {
        return (
            <div ref={this.scrollRef} {...this.props}>
                {this.props.children}
                <ScrollTo scrollable={this.scrollRef}></ScrollTo>
            </div>
        ) 
    }   // attach the ref property to a dom element
  
}