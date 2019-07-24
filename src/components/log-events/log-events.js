import React, { Component } from "react";

import { GlobalContext } from "../../context/global-context";

import { CloudWatchLogsService } from "../../service/log-event-service";

import { SetPage, SetIndex } from "../../actions/actions";
import {Filter} from "../../components/filter-input/filter";

export class LogEvents extends Component {
  static contextType = GlobalContext;

  async fetchEvents() {
    let { profile, logGroup , filters} = this.props;
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
        let options = {
          logGroupName: logGroup
        };
        console.log("filters", filters, this.context);
        if(filters){
          options.startTime = filters.startTime;
        }

        let logEvents = (await cloudWatchLogsService.getLogEvents(options))
        .map((logEvent)=>{
            return logEvent.message;
        });
        this.context.dispatch(new SetPage(logEvents));
      } catch (err) {
        console.log(err);
      }
    }
  }

  componentDidMount() {
    this.fetchEvents();
  }

  componentDidUpdate(prevProps) {
    let { profile, logGroup, filters} = this.props;
    if (
      profile &&
      logGroup &&
      (profile !== prevProps.profile || logGroup !== prevProps.logGroup || filters != prevProps.filters)
    ) {
      this.fetchEvents();
    }
  }

  render() {
    return ( <Filter></Filter>)
  }
}
