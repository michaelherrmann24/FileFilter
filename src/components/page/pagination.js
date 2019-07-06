import React,{Component} from "react";
import { Pagination,Row,Col,FormControl,Container} from "react-bootstrap";
import { GlobalContext } from "../../context/global-context";
import {SetPagination,SetTail} from "../../actions/actions";

const PAGING_OFFSET = -2;
const PAGING_TO_DISPLAY = 5;

export class Paging extends Component{
    
    static contextType = GlobalContext;

    toPage(nextPage){
        this.context.dispatch(new SetTail(false));
        this.context.dispatch(new SetPagination({page:(nextPage-1)}));
    }

    pageSizeChange(){

    }

    componentDidUpdate(){
       
    }

    render(){

        
        let pagination = this.context.pagination;

        //display pages = first prev ... (current - 2) -> (current + 2) ... next last 
        if(pagination.lines && pagination.lines > pagination.pageSize){
            let pages = Math.ceil(pagination.lines / pagination.pageSize);

            let pageSize = pagination.pageSize;

            let offset = (pagination.page + PAGING_OFFSET);
            if(offset < 0){
                offset = 0;
            }
            if(offset > (pages - PAGING_TO_DISPLAY)){
                offset = pages - PAGING_TO_DISPLAY
            }

            let displayPages = [];

            for(let i=0;i<5;i++){
                if((i+offset + 1) > 0){
                    displayPages[i] = (i + offset + 1);
                }
            }

            let nextpage = (pagination.page + 2 >= pages )?pages:pagination.page + 2;
            let prevPage = (pagination.page < 1)?1:pagination.page;

            return  (<Row>
                <Col md={9}>
                    <Pagination>
                        <Pagination.First onClick={this.toPage.bind(this,1)}/>
                        <Pagination.Prev onClick={this.toPage.bind(this,prevPage)}/>
                        {
                            (displayPages[0] > 1 && <Pagination.Item key={1} active={0 === pagination.page} onClick={this.toPage.bind(this,1)}>{1}</Pagination.Item>) || <></>
                        }
                        {
                            (displayPages[0] > 1 && <Pagination.Ellipsis />) || <></>
                        }
                        {
                            displayPages.map((page,index)=>{

                                return <Pagination.Item key={page} active={page-1 === pagination.page} onClick={this.toPage.bind(this,page)}>{page}</Pagination.Item>
                            })
                        }
                        {
                            (displayPages[4] < pages && <Pagination.Ellipsis />) || <></>
                        }
                        {
                            (displayPages[4] < pages && <Pagination.Item key={pages} active={pages-1 === pagination.page} onClick={this.toPage.bind(this,pages)}>{pages}</Pagination.Item>) || <></>
                        }
                        <Pagination.Next onClick={this.toPage.bind(this,nextpage)}/>
                        <Pagination.Last onClick={this.toPage.bind(this,pages)}/>
                    </Pagination>
                </Col>
                <Col md={3}>
                    <Container className="justify-content-end">
                    <Row >
                        <Col><label className="col-form-label">Page Size</label></Col>
                        <Col><FormControl className="" as="input" type="number" value={pageSize} onChange={this.pageSizeChange.bind(this)}></FormControl></Col>
                    </Row>
                    </Container>
                    
                </Col>
            </Row>
            )
            ;
        }else{return <></>}
        
    }

}