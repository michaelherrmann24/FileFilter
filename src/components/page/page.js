import React, { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";

import { GlobalContext } from "../../context/global-context";

import "./page.css";

export class Page extends Component {
  static contextType = GlobalContext;

  render() {
      let pageNo = this.context.pagination.page;
      let size = this.context.pagination.pageSize;

      let start = pageNo * size;
      let end = start + size;
      
    return (
      <Container fluid={true}>
        {this.context.page
          .filter((line,i )=> {
            return this.context.index[i];
          })
          .slice(start,end)
          .map((line, index) => {
            return (
              <Row key={index}>
                <div className="num-col text-center">{index}</div>
                <Col md={11}>{line}</Col>
              </Row>
            );
          })}
      </Container>
    );
  }
}
