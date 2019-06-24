import React,{Component} from 'react';
import {GlobalContext} from "../../context/global-context";
import {SetRegexFilter} from "../../actions/actions";
import FormControl from "react-bootstrap/FormControl";

export class  RegexFilterInput extends Component{
    static contextType = GlobalContext

    constructor(props){
        super(props);
        this.state = {};
    }

    handleChange (event){
        let reg = null;
        
        try{
            reg = new RegExp(event.target.value.trim());
        }catch(e){
            console.error("should probably handle bad input here ",e);
            this.setState({error:"Invalid Regular Expression."});
        }

        if(reg){
            this.setState({error:undefined});
            this.context.dispatch(new SetRegexFilter(reg));
        }
    }
    render(){
        return (
            <div {...this.props}>
                {this.state.error && ( <div class="text-warning">{this.state.error}</div>)}
                <FormControl className="" as="input" type="text"  onChange={this.handleChange.bind(this)} placeholder="regex filter" defaultValue={this.context.filters.regexFilter} ></FormControl>
            </div>
        )
    }
}