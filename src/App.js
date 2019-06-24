import React,{Component} from 'react';
// import {FileDrop} from './components/file-drop/file-drop';
import {GlobalState,GlobalContext} from "./context/global-context";
import {Row,Col,Tabs,Tab, Pagination} from "react-bootstrap";
import {AWSState,AWSContext} from "./context/aws-context";
import {AWSProfileSection} from "./components/aws/AWSProfileSection"
import {RegexFilterInput} from "./components/filter-input/filter-input"
import {LogEvents} from "./components/log-events/log-events";
import {FileInput} from "./components/file/file-input"; 
import {Filter} from "./components/filter-input/filter";
import {Paging} from "./components/page/pagination";

import './App.css';

export class App extends Component {

  constructor(props){
    super(props)
    this.state = {selectedTab:"file"};
  }

  tabSelect(keyEvent){
    this.setState({selectedTab:keyEvent})
  }

  render(){
    return  (
      <GlobalState>
        <AWSState>
          <div className="content-holder">
            <header>
                <Tabs onSelect={this.tabSelect.bind(this)}>
                  <Tab eventKey="file" title="File">
                    <Row><Col md={12}><FileInput></FileInput></Col></Row>
                  </Tab>
                  <Tab eventKey="aws" title="AWS">
                    <AWSProfileSection></AWSProfileSection>
                  </Tab>
                </Tabs>
              <Row><Col md={12}><RegexFilterInput></RegexFilterInput></Col></Row>
              <Paging></Paging>
            </header>
            <div className="content">
              {
                this.state.selectedTab === "file" && 
                (
                  <GlobalContext.Consumer>
                    {gCtx => ( <Filter></Filter>)}
                  </GlobalContext.Consumer>
                )
              }
              { this.state.selectedTab === "aws" && 
                (
                  <AWSContext.Consumer>
                    {
                      aCtx =>( 
                        aCtx.profilesLoaded && aCtx.selectedProfile && 
                        (
                          <GlobalContext.Consumer>
                            {gCtx => ( gCtx.selectedGroup && gCtx.selectedGroup.logGroupName && (<LogEvents profile={aCtx.selectedProfile} logGroup={gCtx.selectedGroup.logGroupName}></LogEvents> ))}
                          </GlobalContext.Consumer>
                        ) 
                      )
                    }
                  </AWSContext.Consumer>
                )
              }
              
              
            </div>
            <footer ></footer>
          </div>
        </AWSState>
      </GlobalState>
      )
  }
  
}
