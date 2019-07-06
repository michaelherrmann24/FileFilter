import {STS} from "aws-sdk";

export class STSService {

    constructor(key, secret){
        this.stsClient = new STS({accessKeyId:key,secretAccessKey:secret,region:region});
    }

    async assumeRole(accountId, role){
        let params = {
            RoleArn:`arn:aws:iam::${accountId}:role/${role}`,
            RoleSessionName:`${role}@${accountId}`
        };
        return new Promise((resolve,reject)=>{
            
            this.stsClient.assumeRole((err,resp)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                if(resp){
                    resolve(resp.credentials);
                }
            });
        });    
    }
}