import React,{Component} from "react";
import {GlobalContext} from "../context/global-context";

export class ScrollTo extends Component {
    static contextType = GlobalContext;
    constructor(props) {
        super(props)
        this.scrollable = props.scrollable;
        this.scrollRef = React.createRef()   // Create a ref object 
    }
    componentDidUpdate(){
        this.context.tail && this.scrollTo();
    }
    scrollTo(){
        let scrollable =  (this.scrollable && this.scrollable.current) || window
        this.scrollRef && scrollable.scrollTo(0, this.scrollRef.current.offsetTop); // run this method to execute scrolling. 

    }

    render() {
        return <div style={{height:"1px"}} ref={this.scrollRef} ></div> 
    }   // attach the ref property to a dom element
  
}