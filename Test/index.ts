import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import AzureServiceBusClient from "../Clients/AzureServiceBusClient";
import { ServiceBusMessage } from "@azure/service-bus";
import AzureStorageClient from "../Clients/AzureStorageClient";
import Processor from "../Clients/Processor";
import Config from "../Config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const payload = req.body;
    // const messages: ServiceBusMessage[] = [
    //     { body: responseMessage }
    // ];
    // const client = new AzureServiceBusClient();
    // await client.Send(messages);

    // const client = new AzureStorageClient();
    // const CERT = await client.GetBlob();
    const x = new Buffer(Config.EncryptedCipherKey, 'base64')
    // const payload = new Buffer(data, 'base64').toString('ascii');
    // await Processor.Start(payload, { cipherKey: Config.EncryptedCipherKey, cert: CERT })

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: x
    };

};

export default httpTrigger;