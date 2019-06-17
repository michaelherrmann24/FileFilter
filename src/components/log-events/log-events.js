import React, { Component } from "react";

import { GlobalContext } from "../../context/global-context";

import { CloudWatchLogsService } from "../../service/log-event-service";

import { SetPage, SetIndex } from "../../actions/actions";
import {Filter} from "../../components/filter-input/filter";

export class LogEvents extends Component {
  static contextType = GlobalContext;


  async fetchEvents() {
    let { profile, logGroup } = this.props;
    let region = profile.options.region;
    let key = profile.credentials.aws_access_key_id;
    let secret = profile.credentials.aws_secret_access_key;

    if (key && secret) {
      let cloudWatchLogsService = new CloudWatchLogsService(
        key,
        secret,
        region
      );
      try {
        let logEvents = (await cloudWatchLogsService.getLogEvents({
          logGroupName: logGroup,
          logStreamNamePrefix: "20"
        }))
        .map((logEvent)=>{
            return logEvent.message;
        });

        this.context.dispatch(new SetPage(logEvents));
        this.context.dispatch(new SetIndex([].fill(true,0,logEvents.length-1)));
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentDidMount() {
    this.fetchEvents();
  }

  componentDidUpdate(prevProps) {
    let { profile, logGroup } = this.props;
    if (
      profile &&
      logGroup &&
      profile !== prevProps.profile &&
      logGroup !== prevProps.logGroup
    ) {
      this.fetchEvents();
    }
  }

  render() {
    return ( <Filter></Filter>)
  }
}
