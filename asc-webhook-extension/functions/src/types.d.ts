export { }

declare global {
  export interface AmityEvent {
    event: string;
    data: any;
    timestamp: string
  }
  export interface AmityEnvWebhookConfig {
    webhook_timeout: string,
    config_cache_age: string,
    network: {
      api_key: string;
      topic: string;
      api_endpoint: string;
    }[];
  }
  export interface AmityWebhookConfig{
    _id: string,
    networkId: string,
    callbackUrl: string,
    secretKey: string,
    createdAt: string,
    updatedAt: string,
    __v: number
  }
}
