import { Statuses } from "azure-devops-ui/Status";

import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"
import { IDeliveryItem, IRelatedWit } from "../Interfaces/IDeliveryItem"
import { IRelatedWitTableItem } from "../Components/DeliveryItemCard";

export class MoqAzureDevOpsService implements IAzureDevOpsService {
    

    _deliveryItens: IDeliveryItem[] = [];

    _allDeliveryItemsMock: IDeliveryItem[] = [
        {
            id: "123456",
            name: "Projeto A",
            creationDate: new Date(),
            description: "Entrega do Projeto A",
            relatedWits: [
                {
                    id: 1,
                    title: "PBI A"
                },
                {
                    id: 2,
                    title: "PBI XPTO"
                }
            ]
        },
        {
            id: "789456",
            name: "Projeto B",
            creationDate: new Date(),
            description: "Entrega do Projeto B",
            relatedWits: [{ id: 2, title: "PBI B" }]
        }
    ];

    _witData: IRelatedWit[] = [
        {
            id: 40123,
            title: "Transformar o sistema num robô"
        },
        {
            id: 40456,
            title: "Criar novo mecanismo de clonagem humana"
        },
        {
            id: 40789,
            title: "Atualizar teletransportador para versão Zeta"
        }
    ];

    async getDeliveryItem(id: string): Promise<IDeliveryItem | undefined> {
        return await Promise.resolve(this._deliveryItens.find(x => x.id === id));
        // return await this._allDeliveryItemsMock[0];
    }

    deleteDeliveryItem(deliveryItem: IDeliveryItem): Promise<void> {
        this._deliveryItens = this._deliveryItens.filter(item => item.id !== deliveryItem.id);
        return Promise.resolve();
    }

    saveDeliveryItem(deliveryItem: IDeliveryItem): Promise<void> {

        if (deliveryItem.id)
            this.deleteDeliveryItem(deliveryItem);
        else
            deliveryItem.id = Math.random().toString();

        this._deliveryItens.push(deliveryItem);
        return Promise.resolve();
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

    async getDeliveryItens(filter?: string): Promise<IDeliveryItem[]> {
        let deliveryItens = this._deliveryItens;

        if (filter)
            deliveryItens = deliveryItens.filter(item =>
                item.name.includes(filter));

        return deliveryItens.sort((a, b) => a.creationDate < b.creationDate ? -1 : 1);
        //return this._allDeliveryItemsMock;
    }

    async getWitDetails(witId: number): Promise<IRelatedWitTableItem> {
        const wit = await this.getWit(witId);
        return Promise.resolve({
            status: Statuses.Success,
            id: wit!.id,
            title: wit!.title,
            effort: 10,
            column: "Dev Done",
            totalTaskWork: "10/80",
            todoTasksCount: 8,
            inProgressTaskCount: 4,
            doneTaskCount: 10
        });
    }

    async getWit(witId: number): Promise<IRelatedWit | undefined> {
        return this._witData
            .filter(
                testItem => testItem.id === witId
            )[0];
    }

    openWorkItem(witId: number): void {
        alert("WIT de id " + witId);
    }

}