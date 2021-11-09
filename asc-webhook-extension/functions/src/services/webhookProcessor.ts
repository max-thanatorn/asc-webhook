import axios from 'axios';
import * as crypto from "crypto";
import * as functions from "firebase-functions";
const env: AmityEnvWebhookConfig = functions.config().env;

export async function processEvent(event: AmityEvent, webhooks: AmityWebhookConfig[], topic: string) {
    await Promise.all(webhooks.map(async webhookConfig => {
        const { secretKey, callbackUrl } = webhookConfig;
        console.timeLog('webhook_'+topic, "Relay start webhook: "+ callbackUrl);
        try{
            const response = await axios({
                method: 'post',
                url: callbackUrl,
                headers: {
                    'x-amity-signature': generateHMACSignature(secretKey, event)
                },
                data: event,
                timeout: Number(env.webhook_timeout)
            });
            console.timeLog('webhook_'+topic, "Relay completed webhook: "+ callbackUrl);
            if (response.status !== 200) {
                console.error("Error while relaying webhook: " + response.status + " with data " + response.data);
            }
        }
        catch(err){
            console.error("Error while relaying webhook topic:"+topic+" to "+callbackUrl+" error: "+err);
        }
    }));
}

function generateHMACSignature(secret: string, payload: AmityEvent) {
    return crypto.createHmac('SHA256', secret).update(JSON.stringify(payload)).digest('base64');
}