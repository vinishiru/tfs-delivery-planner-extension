import * as SDK from 'azure-devops-extension-sdk'
import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"

export class AzureDevOpsSdkService implements IAzureDevOpsService {
    deleteDeliveryItem(deliveryItem: import("../Interfaces/IDeliveryItem").IDeliveryItem): void {
        throw new Error("Method not implemented.");
    }
    saveDeliveryItem(deliveryItem: import("../Interfaces/IDeliveryItem").IDeliveryItem): void {
        throw new Error("Method not implemented.");
    }
    getAllDeliveryItens(): Promise<import("../Interfaces/IDeliveryItem").IDeliveryItem[]> {
        throw new Error("Method not implemented.");
    }
    initialize(): void {
        SDK.init();
    }
    async ready(): Promise<void> {
        await SDK.ready();
    }
    getUserDisplayName(): string {
        return SDK.getUser().displayName;
    }
}