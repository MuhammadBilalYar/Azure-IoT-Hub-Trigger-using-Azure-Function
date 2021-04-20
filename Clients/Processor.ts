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
            throw new Error('Error verifying record');
    }

    private static Decrypt(input, key, iv) {
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, new Buffer(iv)); // convert the stringified iv back to a buffer
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
    private static async Start(input: any, config: any) {
        try {
            const parsed = this.Parse(input);
            const verified = this.Verify(parsed, config.cert);
            const decrypted = this.Decrypt(verified.data, config.cipherKey, verified.iv);
            await this.Publish(decrypted);
        } catch (error) {
            throw new Error(error);
        }
    }
}