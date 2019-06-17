import React,{Component} from "react";
import { Pagination } from "react-bootstrap";
import { GlobalContext } from "../../context/global-context";
import { SetPagination, SetIndex } from "../../actions/actions";
import {Page} from "../../components/page/page"



export class Filter extends Component{
    
    static contextType = GlobalContext;

    constructor(props){
        super(props);
        this.state = {page:[],filters:[]};
    }

    
    componentDidUpdate(prevProps,prevState,snapshots){
        

        let reindex = false;
        if(this.state.page != this.context.page){
            reindex = true;
        }
        if(this.state.filters != this.context.filters){
            reindex = true;
        }
        if(reindex){
            let index = this.context.page
                .map(line => {
                    return this.context.filters && this.context.filters.regexFilter ? this.context.filters.regexFilter.test(line) : true;
                });

            let lines = index.filter((iVal)=>iVal);
            
            this.context.dispatch(new SetIndex(index));
            this.context.dispatch(new SetPagination({lines:lines.length}));
        
            this.setState((state)=>{
                return {
                    page:this.context.page,
                    filters:this.context.filters
                }
            })
        }
    }

    render(){

        let pages = (this.context.pages / this.context.pageSize) + (this.context.pages % this.context.pageSize > 0)?1:0;
        let pageSize = this.context.pagination.pageSize;
        

        console.log(this.context.pagination);
        //display pages = first prev ... (current - 2) -> (current + 2) ... next last 


        return  ( <Page></Page>);
    }

}