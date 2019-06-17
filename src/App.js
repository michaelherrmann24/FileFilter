import React,{Component} from 'react';
// import {FileDrop} from './components/file-drop/file-drop';
import {GlobalState,GlobalContext} from "./context/global-context";
import {Row,Col,Tabs,Tab} from "react-bootstrap";
import {AWSState,AWSContext} from "./context/aws-context";
import {AWSProfileSelect} from "./components/aws/profile-select"
import {LoadAWSProfiles} from "./components/aws/AWSConfigFileDrop";
import {LogGroupSelect} from "./components/log-group/log-group-select";
import {RegexFilterInput} from "./components/filter-input/filter-input"
import {LogEvents} from "./components/log-events/log-events";
import {FileInput} from "./components/file/file-input"; 
import {Page} from "./components/page/page";

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
                    <FileInput></FileInput>
                  </Tab>
                  <Tab eventKey="aws" title="AWS">
                    <AWSContext.Consumer>
                      { 
                        ctx => ( 
                          (
                            ctx.profilesLoaded && (
                              <>
                                <Row><Col md={6}><AWSProfileSelect></AWSProfileSelect></Col></Row>
                                <Row><Col md={6}><LogGroupSelect test="test" profile={ctx.selectedProfile}></LogGroupSelect></Col></Row>
                              </>
                            )  
                          ) || (
                            <Row className="p-4" ><Col md={6}><LoadAWSProfiles></LoadAWSProfiles></Col></Row>
                          ) 
                        ) 
                      }
                    </AWSContext.Consumer>

                  </Tab>
                </Tabs>
              <Row><Col md={12}><RegexFilterInput></RegexFilterInput></Col></Row>
            </header>
            <div className="content">
              {
                this.state.selectedTab === "file" && 
                (
                  <GlobalContext.Consumer>
                    {gCtx => ( <Page></Page>)}
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
