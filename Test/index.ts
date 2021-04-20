import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import AzureServiceBusClient from "../Clients/AzureServiceBusClient";
import { ServiceBusMessage } from "@azure/service-bus";
import AzureStorageClient from "../Clients/AzureStorageClient";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + "."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // const messages: ServiceBusMessage[] = [
    //     { body: responseMessage }
    // ];
    // const client = new AzureServiceBusClient();
    // await client.Send(messages);

    const client = new AzureStorageClient();
    const data = await client.GetBlob();
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: data
    };

};

export default httpTrigger;