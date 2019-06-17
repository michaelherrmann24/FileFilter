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
                    resolve(resp.logGroups);
                }
            });
        });    
    }

    async getLogEvents(options){
        return new Promise((resolve,reject)=>{
            this.awsCloudWatchLogs.filterLogEvents(options,(err,resp)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                if(resp){
                    resolve(resp.events);
                }
              });
        });
    }

}