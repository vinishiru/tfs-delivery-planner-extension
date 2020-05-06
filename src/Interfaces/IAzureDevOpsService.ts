import { IDeliveryItem, IRelatedWit } from "./IDeliveryItem";
import { IRelatedWitTableItem } from "../Components/DeliveryItemCard";
import { IPeoplePickerProvider } from "azure-devops-ui/IdentityPicker";

export interface IAzureDevOpsService {
    initialize(): void;
    ready(): Promise<void>;
    getUserDisplayName(): string;
    getDeliveryItem(id: string): Promise<IDeliveryItem | undefined>;
    getDeliveryItens(filter?: string): Promise<IDeliveryItem[]>;
    saveDeliveryItem(deliveryItem: IDeliveryItem): Promise<void>;
    deleteDeliveryItem(deliveryItem: IDeliveryItem): Promise<void>;
    getWitDetails(witId: number): Promise<IRelatedWitTableItem | undefined>;
    getWit(witId: number): Promise<IRelatedWit | undefined>;
    openWorkItem(witId: number): void;
    peoplePickerProvider?: IPeoplePickerProvider;
}