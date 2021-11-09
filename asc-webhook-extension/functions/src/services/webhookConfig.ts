import axios from 'axios';
import * as admin from 'firebase-admin';
import * as functions from "firebase-functions";
const dbCollection = admin.firestore().collection("webhook");
const env : AmityEnvWebhookConfig = functions.config().env;

export async function retrieveWebhookConfig(topic: string): Promise<AmityWebhookConfig[]>{
    const networkConfig = getEnvConfigByTopicName(topic);
    return (await getCache(networkConfig.api_key, networkConfig.topic)) ?? 
                        (await refreshCache(networkConfig.api_key, networkConfig.api_endpoint, networkConfig.topic));
}

function getEnvConfigByTopicName(topic: string){
    for(let networkConfig of env.network){
        if(networkConfig.topic === topic) return networkConfig;
    }
    throw new Error("Network config for topic: "+topic+" doesn't exist");
}

async function refreshCache(apiKey: string, apiEndpoint: string, topic: string){
    console.timeLog('webhook_'+topic, "Refreshing cache for "+topic+" to "+apiEndpoint);
    const response = await axios({
        method: 'get',
        url: `${apiEndpoint}/admin/v1/webhooks`,
        headers: { 
            'x-api-key': apiKey
        }
    });
    if(response.status === 200){
        const json : AmityWebhookConfig[] = response.data;
        console.timeLog(`Webhook response received for ${topic} with type ${typeof(json)} , response `, json);
        setCache(apiKey, json);
        return json;
    }
    else{
        const msg ="Error while retreiving webhook: "+response.status+" with data "+response.data
        console.error(msg);
        throw new Error(msg);
    }
}

async function setCache(apiKey: string, json: AmityWebhookConfig[]){
    return await dbCollection.doc(apiKey).set({webhooks:json, updated: Date.now()});
}

async function getCache(apiKey: string, topic: string) : Promise<AmityWebhookConfig[] | null>{
    console.timeLog('webhook_'+topic, "Checking cache");
    const doc = await dbCollection.doc(apiKey).get();
    console.timeLog('webhook_'+topic, "Cache retrieved");
    if(doc.exists && doc.data()?.updated >= (Date.now() - Number(env.config_cache_age))){
        return doc.data()?.webhooks as AmityWebhookConfig[] ?? null;
    }
    return null;
}