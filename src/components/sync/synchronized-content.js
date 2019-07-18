import React,{Component} from "react";
import {SyncContext,InitSyncState} from "../../context/sync-context";
import {SyncData,AWSProfilesLoaded,SetViewSection} from "../../actions/actions";

const PUSH_EVENT_KEY = "push_ss_file_filter";
const PULL_EVENT_KEY = "pull_ss_file_filter";

export class SynchronizedContent extends Component{
    static contextType = SyncContext;
    constructor(props){
        super(props);
        this.lastEvent = InitSyncState;
    }

    componentDidUpdate(prevProps,prevState){
        let {aws} = this.context;
        if(aws && JSON.stringify(this.lastEvent) !== JSON.stringify(aws)){
            console.log("SYNC AWS", aws);
            this.push(aws);         
        } 

        let profilesLoaded = aws && Object.keys(aws).length > 0;
       
        if(profilesLoaded && this.props.gctx.profilesLoaded !== profilesLoaded) {
            window.setTimeout(()=>{ //doesnt like me doing dispatches in the same update loop. put the updates in the next one.
                this.props.gctx.dispatch(new SetViewSection({left:"select"}));
                this.props.gctx.dispatch(new AWSProfilesLoaded(profilesLoaded));
            },0);
        };
    }

    storageEventListener(event){
        let lastEventString = (this.lastEvent && JSON.stringify(this.lastEvent)) || null;
        
        if(event.key !== PULL_EVENT_KEY && event.key !== PUSH_EVENT_KEY) return; //we dont care about other events.

        let parsed = (event.newValue && JSON.parse(event.newValue)) || null;

        if(!parsed) return; // do nothing if no value to work with
        if (event.key == PULL_EVENT_KEY && lastEventString) {
            this.push(this.lastEvent); //Another tab requested content
        } else if (event.key == PUSH_EVENT_KEY && event.newValue !== lastEventString ) {
            //received new data. update context.
            this.lastEvent = parsed;
            this.context.dispatch(new SyncData({aws:parsed}));              
        }
    }

    componentWillMount(){
        window.addEventListener('storage', this.storageEventListener.bind(this) , false);
        
        this.pull();
    }

    push(value){
        this.lastEvent = value; 
        window.localStorage.setItem(PUSH_EVENT_KEY, JSON.stringify(value));
        // the other tab should now have it, so we're done with it.
        window.setTimeout(()=>{
            window.localStorage.removeItem(PUSH_EVENT_KEY); // <- could do short timeout as well.
        },10);
    }

    pull(){   
        window.localStorage.setItem(PULL_EVENT_KEY,"{}");
        window.localStorage.removeItem(PULL_EVENT_KEY);
    }

    componentWillUnmount(){
        window.removeEventListener('storage', this.storageEventListener.bind(this) , false);
    }
    render(){    
        return (<></>)
    }
}