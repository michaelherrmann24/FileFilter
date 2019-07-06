import React, { Component } from "react";
import { Row, Col, Container,Form} from "react-bootstrap";

import { GlobalContext } from "../../context/global-context";
import {ScrollTo} from "../scroll-to";
import "./page.css";

export class Page extends Component {
  static contextType = GlobalContext;

  constructor(props){
    super(props);
    this.state= {showLine:true,showNumbers:true}
  }

  groupRender(line,regexResponse,colWidth){
    if(regexResponse && !this.state.showLine){
      return (<Row className="page-line-row">{Object.values(regexResponse.groups).map((groupVal)=>{return (<Col md={colWidth}>{groupVal}</Col>) })}</Row>)
    }
    return this.lineRender(line,regexResponse,colWidth);
  }
  captureRender(line,regexResponse,colWidth){
    if(regexResponse && !this.state.showLine){
      return (<Row className="page-line-row">{regexResponse.splice(1,regexResponse.length).map((capt)=>{ return (<Col md={colWidth}>{capt}</Col>) })}</Row>)
    }
    return this.lineRender(line,regexResponse,colWidth);
  }
  lineRender(line,regexResponse,colWidth){
    return line;
  }
  showLineHandler(evt){
    this.setState({...this.state,showLine:evt.target.checked})
  }
  showNumbersHandler(evt){
    this.setState({...this.state,showNumbers:evt.target.checked})
  }
  render() {
    let pageNo = this.context.pagination.page;
    let size = this.context.pagination.pageSize;

    let start = pageNo * size;
    let end = start + size;
    let grouped = false;
    let headers = []; 
    let renderType = this.lineRender.bind(this);

    let colWidth = "auto";

    let pageRender = this.context.page
    .filter((line,i )=> {
      return this.context.index[i];
    })
    .slice(start,end)
    .map((line, index) => {
      let regexResponse = this.context.filters && this.context.filters.regexFilter && this.context.filters.regexFilter.exec(line);
      if(index === 0 && regexResponse && regexResponse.length > 1){
        grouped = true;
        if(regexResponse.groups){
          renderType = this.groupRender.bind(this);
          headers = Object.keys(regexResponse.groups);
          if(headers.length > 0){
            colWidth = Math.max(Math.floor(12/headers.length),1);  
          }
        }else{
          renderType = this.captureRender.bind(this);
        }
      }
      
      return (
        <Row className="line-row" key={index}>
          { this.state.showNumbers && (<div className="num-col text-center">{index}</div>)}  
          <Col md={this.state.showNumbers?11:12} className="page-line">{renderType(line,regexResponse,colWidth)}</Col>
        </Row>
      );
    })


    
      
       

    return (
      <Container fluid={true}>
        <Row>
          {pageRender.length > 0 && (<Form.Check inline label="numbers" type="checkbox" id="showlinecheckbox" checked={ this.state.showNumbers} onChange={this.showNumbersHandler.bind(this)}/>)}
          {
            grouped && <Form.Check inline label="raw" type="checkbox" id="showlinecheckbox" checked={ this.state.showLine} onChange={this.showLineHandler.bind(this)}/>
          }  
        </Row>      
        {
          headers.length > 0 && (
          <Row>
            <div className="num-col text-center"></div>
            <Col md={11} className="page-line">
              <Row >{headers.map((header)=>{ return (<Col md={colWidth}>{header}</Col>) })}</Row>
            </Col>
            
          </Row>)
        }
        {pageRender}
      </Container>
    );
  }
}
