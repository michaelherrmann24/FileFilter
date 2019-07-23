import React,{Component} from 'react';
// import {FileDrop} from './components/file-drop/file-drop';
import {GlobalState,GlobalContext} from "./context/global-context";
import {Row,Col,Tabs,Tab, Pagination} from "react-bootstrap";
import {SyncState,SyncContext} from "./context/sync-context";
import {AWSProfileSection} from "./components/aws/AWSProfileSection"
import {RegexFilterInput} from "./components/filter-input/filter-input"
import {LogEvents} from "./components/log-events/log-events";
import {FileInput} from "./components/file/file-input"; 
import {Filter} from "./components/filter-input/filter";
import {Paging} from "./components/page/pagination";
import {SynchronizedContent} from "./components/sync/synchronized-content";
import {Scrollable} from "./components/scrollable";
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
        <SyncState>
        <GlobalContext.Consumer>
          {gCtx => ( <SynchronizedContent gctx={gCtx}></SynchronizedContent>)}
        </GlobalContext.Consumer>
          
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
            <Scrollable className="content">
              {
                this.state.selectedTab === "file" && (<Filter></Filter>)
              }
              { this.state.selectedTab === "aws" && 
                (
                  
                  <GlobalContext.Consumer>
                    {gCtx => ( gCtx.profilesLoaded && gCtx.selectedProfile &&  gCtx.selectedGroup && gCtx.selectedGroup.logGroupName && (
                  
                        <LogEvents profile={gCtx.selectedProfile} logGroup={gCtx.selectedGroup.logGroupName} filters={gCtx.logEventFilters}></LogEvents>
                        
                      ))}
                  </GlobalContext.Consumer>
                  
                )
              }
              
              
              </Scrollable>
            <footer ></footer>
          </div>
        </SyncState>
      </GlobalState>
      )
  }
  
}
