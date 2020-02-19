import { IDeliveryItem } from "./IDeliveryItem";
import { IRelatedWitTableItem } from "../Components/DeliveryItemCard";

export interface IAzureDevOpsService {
    initialize(): void,
    ready(): Promise<void>,
    getUserDisplayName(): string,
    getAllDeliveryItens(): Promise<IDeliveryItem[]>,
    saveDeliveryItem(deliveryItem: IDeliveryItem): void
    deleteDeliveryItem(deliveryItem: IDeliveryItem): void
    getWitDetails(witId: number): IRelatedWitTableItem
}