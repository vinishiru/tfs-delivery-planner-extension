import { Statuses } from "azure-devops-ui/Status";

import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"
import { IDeliveryItem } from "../Interfaces/IDeliveryItem"
import { IRelatedWitTableItem } from "../Components/DeliveryItemCard";

export class MoqAzureDevOpsService implements IAzureDevOpsService {

    _deliveryItens: IDeliveryItem[];

    constructor() {
        this._deliveryItens = [];
    }

    deleteDeliveryItem(deliveryItem: IDeliveryItem): void {
        this._deliveryItens = this._deliveryItens.filter(item => item.deliveryId !== deliveryItem.deliveryId);
    }

    saveDeliveryItem(deliveryItem: IDeliveryItem): void {
        deliveryItem.deliveryId = Math.random().toString();
        deliveryItem.relatedWits = [{ id: 1, name: "WIT A" }, { id: 2, name: "WIT B" }, { id: 2, name: "WIT C" }]
        this._deliveryItens.push(deliveryItem);
    }
    initialize(): void {
        //faz nada
    }

    async ready(): Promise<void> {
        //finge que fez
    }

    getUserDisplayName(): string {
        return "Dummy User";
    }

    async getAllDeliveryItens(): Promise<IDeliveryItem[]> {
        // return this._deliveryItens;
        return [
            {
                deliveryId: "asdf",
                name: "Projeto A",
                creationDate: new Date(),
                description: "Entrega do Projeto A",
                relatedWits: [
                    {
                        id: 1,
                        name: "PBI A"
                    },
                    {
                        id: 2,
                        name: "PBI XPTO"
                    }
                ]
            },
            {
                deliveryId: "qwer",
                name: "Projeto B",
                creationDate: new Date(),
                description: "Entrega do Projeto B",
                relatedWits: [{ id: 2, name: "PBI B" }]
            }
        ];
    }

    getWitDetails(witId: number): IRelatedWitTableItem {
        return {
            status: Statuses.Success,
            id: witId,
            title: "Wit Id X",
            effort: 10,
            column: "Dev Done",
            totalTaskWork: "10/80",
            todoTasksCount: 0,
            inProgressTaskCount: 4,
            doneTaskCount: 10
        };
    }

}