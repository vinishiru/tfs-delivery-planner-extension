import { IDeliveryItem, IRelatedWit } from "./IDeliveryItem";
import { IRelatedWitTableItem } from "../Components/DeliveryItemCard";

export interface IAzureDevOpsService {
    initialize(): void,
    ready(): Promise<void>,
    getUserDisplayName(): string,
    getDeliveryItem(id: string): Promise<IDeliveryItem | undefined>,
    getDeliveryItens(filter?: string): Promise<IDeliveryItem[]>,
    saveDeliveryItem(deliveryItem: IDeliveryItem): void
    deleteDeliveryItem(deliveryItem: IDeliveryItem): void
    getWitDetails(witId: number): IRelatedWitTableItem
}