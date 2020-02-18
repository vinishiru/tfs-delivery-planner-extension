import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"
import { IDeliveryItem } from "../Interfaces/IDeliveryItem"

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
        return this._deliveryItens;
        // return [
        //     {
        //         deliveryId: "asdf",
        //         name: "Projeto A",
        //         description: "Entrega do Projeto A",
        //         relatedWits: [
        //             {
        //                 id: 1,
        //                 name: "PBI A"
        //             },
        //             {
        //                 id: 2,
        //                 name: "PBI XPTO"
        //             }
        //         ]
        //     },
        //     {
        //         deliveryId: "qwer",
        //         name: "Projeto B",
        //         description: "Entrega do Projeto B",
        //         relatedWits: [{ id: 2, name: "PBI B" }]
        //     }
        // ];
    }
}