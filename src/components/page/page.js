import React, { Component } from "react";
import { Row, Col, Container } from "react-bootstrap";

import { GlobalContext } from "../../context/global-context";

import "./page.css";

export class Page extends Component {
  static contextType = GlobalContext;

  render() {
    return (
      <Container fluid={true}>
        {this.context.page
          .filter(line => {
            return this.context.filters && this.context.filters.regexFilter
              ? this.context.filters.regexFilter.test(line)
              : true;
          })
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
