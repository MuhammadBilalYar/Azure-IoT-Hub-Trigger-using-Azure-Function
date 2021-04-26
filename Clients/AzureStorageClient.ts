import { ContainerClient, BlobServiceClient, BlobDownloadResponseModel } from "@azure/storage-blob";
import { config } from "node:process";
import Config from "../Config";
export default class AzureStorageClient {
    private readonly _blobServiceClient: BlobServiceClient;
    private readonly _containerClient: ContainerClient;
    private readonly _fileName = "cert.pem"
    public constructor() {
        const connectionString = Config.StorageConnection;
        this._blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this._containerClient = this._blobServiceClient.getContainerClient(Config.ContainerName);
    }

    public async GetBlob(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const blobClient = this._containerClient.getBlobClient(this._fileName);
                const isExist = await blobClient.exists();
                if (isExist) {
                    const response: BlobDownloadResponseModel = await blobClient.download(0);

                    const stringContent = await this.streamToString(response.readableStreamBody);
                    resolve(stringContent);
                } else {
                    reject("Certificate with name " + this._fileName + " not found.")
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    private async streamToString(readableStream: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: any = [];
            readableStream.on("data", (data: any) => {
                chunks.push(data.toString());
            });
            readableStream.on("end", () => {
                resolve(chunks.join(""));
            });
            readableStream.on("error", reject);
        });
    }
}