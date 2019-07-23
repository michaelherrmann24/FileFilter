import {CloudWatchLogs} from "aws-sdk";

export class CloudWatchLogsService {

    constructor(key, secret, region){
        this.awsCloudWatchLogs = new CloudWatchLogs({accessKeyId:key,secretAccessKey:secret,region:region});
    }

    async getLogGroups(){
        return new Promise((resolve,reject)=>{
            this.awsCloudWatchLogs.describeLogGroups((err,resp)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                if(resp){
                    console.log(resp);
                    resolve(resp.logGroups);
                }
            });
        });    
    }

    async getLogEvents(options){
        let logEvents = [];
        try{
            let results = await this.getEvents(options);
            logEvents = logEvents.concat(results.events);
            while(results.nextToken){
                let opt = Object.assign({nextToken:results.nextToken},options);
                results = await this.getEvents(opt);
                logEvents = logEvents.concat(results.events);
            }
        }catch(e){
            throw e;
        }
        return logEvents;
    }

    async getEvents(options){
        return new Promise((resolve,reject)=>{
            this.awsCloudWatchLogs.filterLogEvents(options,(err,resp)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                if(resp){
                    resolve(resp);
                }
            });
        });
    }
}