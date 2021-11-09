import * as functions from "firebase-functions";

import * as admin from 'firebase-admin';
admin.initializeApp();

import { processEvent } from "./services/webhookProcessor";
import { retrieveWebhookConfig } from "./services/webhookConfig";


const env : AmityEnvWebhookConfig = functions.config().env;

exports.ascWebhookExtension = {};
for(let network of env.network){
    exports.ascWebhookExtension['webhooker_'+network.topic.replace(/[\-\.]/g,'_')] = functions.region('asia-southeast2').pubsub.topic(network.topic).onPublish(
        async (message, context) => {
            console.time('webhook_'+network.topic);
            const event = JSON.parse(Buffer.from(message.data, 'base64').toString());
            console.timeLog('webhook_'+network.topic, "ascEvent received: " + JSON.stringify(event));
            const webhooks = await retrieveWebhookConfig(network.topic);
            await processEvent(event, webhooks, network.topic);
        }
    );

    exports.ascWebhookExtension['mock_webhooker_'+network.topic.replace(/[\-\.]/g,'_')] = functions.region('asia-southeast2').pubsub.topic('mock_'+network.topic).onPublish(
        async (message, context) => {
            console.time('webhook_'+network.topic);
            const event = JSON.parse(Buffer.from(message.data, 'base64').toString());
            console.timeLog('webhook_'+network.topic, "ascEvent received: " + JSON.stringify(event));
            const webhooks = await retrieveWebhookConfig(network.topic);
            await processEvent(event, webhooks, network.topic);
        }
    );
}