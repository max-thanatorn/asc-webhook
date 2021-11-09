# Amity Social Cloud Webhook Extension

ASC Webhook extension is a service built from NodeJS + firebase cloud function + Google Pub/Sub to subscribe to all events and relay them to webhook. Webhook configuration is retrieved from setting on ASC Console.

## Setup

```
cd functions
npm install
```
## Environment Setup
Open file env.json 
```
{
    "webhook_timeout" : "3000" // Timeout to wait for each webhook relay
    "config_cache_age" : "60000" // Cache age for webhook configuration 
    "network.0"={
        "topic"="{GOOGLE_PUBSUB_TOPIC}"
        "api_key"="{API Key of ASC app}",
        "api_endpoint"="{API Endpoint of ASC app}"
    },
    "network.1"={
        // You can keep adding new mapping with the same json as `network.0` item to allow the function to capture from multiple network at once
    }
}

```

## Development
```bash
npm run serve
```

## Deployment
```bash
npm run deploy
```
