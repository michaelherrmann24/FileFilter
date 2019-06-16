import React,{Component} from 'react';
// import {FileDrop} from './components/file-drop/file-drop';
import {GlobalState,GlobalContext} from "./context/global-context";
import {Row,Col} from "react-bootstrap";
import {AWSState,AWSContext} from "./context/aws-context";
import {AWSProfileTabs} from "./components/aws/profile-tabs"
import {LoadAWSProfiles} from "./components/aws/AWSConfigFileDrop";
import {LogGroupSelect} from "./components/log-group/log-group-select";
import {RegexFilterInput} from "./components/filter-input/filter-input"
import {LogEvents} from "./components/log-events/log-events";
import './App.css';





export class App extends Component {

  render(){
    return  (
      <GlobalState>
        <AWSState>
          <div className="content-holder">
            <header>
              
                <AWSContext.Consumer>
                  { ctx => ( (ctx.profilesLoaded && (
                    <>
                    <Row><Col md={6}><AWSProfileTabs></AWSProfileTabs></Col></Row>
                    <Row><Col md={6}><LogGroupSelect test="test" profile={ctx.selectedProfile}></LogGroupSelect></Col></Row>
                    </>
                    )  ) || <Row className="p-4" ><Col md={6}><LoadAWSProfiles></LoadAWSProfiles></Col></Row> ) }
                </AWSContext.Consumer>
                
                {/*  */}
              
              <Row><Col md={12}><RegexFilterInput></RegexFilterInput></Col></Row>
            </header>
            <div className="content">
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
              
            </div>
            <footer ></footer>
          </div>
        </AWSState>
      </GlobalState>
      )
  }
  
}
