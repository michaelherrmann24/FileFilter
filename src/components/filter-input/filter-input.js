import React,{useContext} from 'react';
import {GlobalContext} from "../../context/global-context";
import {SetRegexFilter} from "../../actions/actions";
import FormControl from "react-bootstrap/FormControl";

export function RegexFilterInput({...rest}){
    
    const {filters,dispatch} = useContext(GlobalContext);

    const handleChange = (event)=>{
        dispatch(new SetRegexFilter(new RegExp(event.target.value)));
    }

    return (
        <div {...rest}>
            <FormControl className="" as="input" type="text"  onChange={handleChange} placeholder="regex filter" defaultValue={filters.regexFilter} ></FormControl>
        </div>
    )
}