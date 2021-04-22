import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import AzureStorageClient from "../Clients/AzureStorageClient";
import Processor from "../Clients/Processor";
import Config from "../Config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const payload = req.body;

    const client = new AzureStorageClient();
    const CERT = await client.GetBlob();

    await Processor.Start(payload, { cipherKey: Config.EncryptedCipherKey, cert: CERT })

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: payload
    };

};

export default httpTrigger;