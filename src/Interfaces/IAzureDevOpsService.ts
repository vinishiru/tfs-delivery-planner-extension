import { IDeliveryItem } from "./IDeliveryItem";

export interface IAzureDevOpsService {
    initialize(): void,
    ready(): Promise<void>,
    getUserDisplayName(): string,
    getAllDeliveryItens(): Promise<IDeliveryItem[]>
}