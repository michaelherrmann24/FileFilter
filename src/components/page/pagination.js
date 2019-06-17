import React,{Component} from "react";
import { Pagination } from "react-bootstrap";
import { GlobalContext } from "../../context/global-context";


export class Pagination extends Component{
    
    static contextType = GlobalContext;

    render(){

        let pages = (this.context.pages / this.context.pageSize) + (this.context.pages % this.context.pageSize > 0)?1:0;
        let pageSize = this.context.pagination.pageSize;
        

        
        //display pages = first prev ... (current - 2) -> (current + 2) ... next last 


        return 
            (<Row>
                <Pagination>
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis />

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis />
                    <Pagination.Item>{20}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
                <label>pageSize</label>
                <FormControl as="input" type="number" value={this.context.pagination.pageSize}></FormControl>
            </Row>
            )
    }

}