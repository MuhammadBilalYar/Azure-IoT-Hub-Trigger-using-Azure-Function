import { ServiceBusClient, ServiceBusMessage } from "@azure/service-bus";
import Config from "../Config";

export default class AzureServiceBusClient {
    private readonly _sbClient;
    private readonly _sender;
    public constructor() {
        this._sbClient = new ServiceBusClient(Config.ServiceBusConnection);
        this._sender = this._sbClient.createSender(Config.ServiceBusTopic)
    }
    public async Send(messages: any) {
        try {
            let batch = await this._sender.createMessageBatch();

            for (let i = 0; i < messages.length; i++) {
                const message = messages[i];
                if (!batch.tryAddMessage(message)) {
                    // Send the current batch as it is full and create a new one
                    await this._sender.sendMessages(batch);
                    batch = await this._sender.createMessageBatch();

                    if (!batch.tryAddMessage(messages[i])) {
                        throw new Error("Message too big to fit in a batch");
                    }
                }
            }
            // Send the batch
            await this._sender.sendMessages(batch);

            // Close the sender
            await this._sender.close();
        } catch (error) {
            throw new Error(error);
        } finally {
            this._sender.close();
        }
    }
}