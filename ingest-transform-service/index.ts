import { AzureFunction, Context } from "@azure/functions"
import AzureStorageClient from "../Clients/AzureStorageClient";
import Processor from "../Clients/Processor";
import Config from "../Config";

const IoTHubTrigger: AzureFunction = async function (context: Context, IoTHubMessages: any[]): Promise<void> {
    context.log(`Eventhub trigger function called for message array: ${IoTHubMessages}`);

    context.log('NumRecords', IoTHubMessages.length);

    const client = new AzureStorageClient();
    const CERT = await client.GetBlob();
    IoTHubMessages.forEach(async message => {
        context.log(message);
        await Processor.Start(message, { cipherKey: Config.EncryptedCipherKey, cert: CERT })
    });
};

export default IoTHubTrigger;
