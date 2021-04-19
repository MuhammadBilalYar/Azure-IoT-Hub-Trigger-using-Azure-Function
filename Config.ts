export default class Config {
    protected static get(varName: string): string {
        const value = process.env[varName];
        if (value)
            return value;
        else
            throw new Error(`${varName} environment variable is missing.`);
    }
    public static get ServiceBusConnection(): string {
        return Config.get("SERVICEBUS_CONNECTION_STRING");
    }

    public static get ServiceBusTopic(): string {
        return Config.get("TOPIC_NAME");
    }
}