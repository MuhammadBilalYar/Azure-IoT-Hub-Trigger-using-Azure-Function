import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import AzureStorageClient from "../Clients/AzureStorageClient";
import Processor from "../Clients/Processor";
import Config from "../Config";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const payload = req.body;
    try {
        const client = new AzureStorageClient();
        const Cert = await client.GetBlob();
        if (Cert === undefined || Cert === "")
            throw new Error("Certificate not found");
        await Processor.Start(payload, { cipherKey: Config.EncryptedCipherKey, cert: Cert })

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: payload
        };
    } catch (err) {
        context.done(err);
    }
};

export default httpTrigger;