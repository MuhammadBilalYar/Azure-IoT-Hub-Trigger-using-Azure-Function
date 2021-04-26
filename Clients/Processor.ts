import { ServiceBusMessage } from "@azure/service-bus";
import AzureServiceBusClient from "./AzureServiceBusClient";

const crypto = require('crypto');
export default class Processor {
    private static Parse(input: any) {
        if (typeof input === "object") return input;
        else {
            const json = JSON.parse(input);
            return json;
        }
    }
    private static Verify(input, cert) {
        const record = input.record;
        const signature = input.signature;
        let verifier = crypto.createVerify('RSA-SHA256');
        let verified = verifier.update(JSON.stringify(record));
        verified = verifier.verify(cert, signature, 'base64');
        if (verified)
            return record;
        else
            throw new Error('Error verifying input data: either data or signature are incorrect.');
    }

    private static Decrypt(input, key, iv) {
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv)); // convert the stringified iv back to a buffer
        let decrypted = decipher.update(input, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        decrypted = JSON.parse(decrypted);
        return decrypted;
    }

    private static async Publish(data: any) {
        const message = (typeof data === 'string') ? data : JSON.stringify(data);

        const _messages: ServiceBusMessage[] = [
            { body: message }
        ];
        const client = new AzureServiceBusClient();
        await client.Send(_messages);
    }
    public static async Start(input: any, config: any) {
        try {
            console.log("Parsing input data.")
            const parsed = this.Parse(input);

            console.log("Verifying input data and signature.")
            const verified = this.Verify(parsed, config.cert);

            console.log("Decrypting verified data using cipher key")
            const decrypted = this.Decrypt(verified.data, config.cipherKey, verified.iv);

            console.log("Data decrypted, publishing to service bus.")
            await this.Publish(decrypted);
            console.log("Published.")
        } catch (error) {
            return Promise.reject(error);
        }
    }
}