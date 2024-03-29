import { Statuses } from "azure-devops-ui/Status";

import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"
import { IDeliveryItem, IRelatedWit } from "../Interfaces/IDeliveryItem"
import { IRelatedWitTableItem, IRelatedWitTaskTableItem } from "../Components/DeliveryItemCard";
import { IPeoplePickerProvider, IPersonaConnections, IIdentity } from "azure-devops-ui/IdentityPicker";

class MoqPeoplePickerProvider implements IPeoplePickerProvider {

    private _identities: IIdentity[] = [{
        entityId: "123",
        entityType: "user",
        originDirectory: "",
        originId: "",
        displayName: "Vinícius Oliveira"
    },
    {
        entityId: "456",
        entityType: "user",
        originDirectory: "",
        originId: "",
        displayName: "Ana Rita"
    },
    {
        entityId: "789",
        entityType: "user",
        originDirectory: "",
        originId: "",
        displayName: "Ivo Pereira"
    }];

    addIdentitiesToMRU?: ((identities: IIdentity[]) => Promise<boolean>) | undefined

    onFilterIdentities: (filter: string, selectedItems?: IIdentity[] | undefined) => IIdentity[] | PromiseLike<IIdentity[]> | null =
        (filter: string, selectedItems?: IIdentity[] | undefined) => {
            return this._identities.filter(m => m.displayName!.includes(filter));
        };

    onEmptyInputFocus?: (() => IIdentity[] | PromiseLike<IIdentity[]> | null) | undefined;

    onRequestConnectionInformation: (entity: IIdentity, getDirectReports?: boolean | undefined) => IPersonaConnections | PromiseLike<IPersonaConnections> =
        (entity: IIdentity, getDirectReports?: boolean | undefined) => {
            return {};
        };

    getEntityFromUniqueAttribute: (entityId: string) => IIdentity | PromiseLike<IIdentity> =
        (entityId: string) => {
            return this._identities.find(m => m.entityId === entityId)!;
        };

    removeIdentitiesFromMRU?: ((identities: IIdentity[]) => Promise<boolean>) | undefined;
}

export class MoqAzureDevOpsService implements IAzureDevOpsService {


    peoplePickerProvider: IPeoplePickerProvider = new MoqPeoplePickerProvider();

    _deliveryItens: IDeliveryItem[] = [];
    _allDeliveryItemsMock: IDeliveryItem[] = [
        {
            id: "123456",
            name: "Projeto A",
            creationDate: new Date(),
            description: "Entrega do Projeto A",
            relatedWits: [
                {
                    id: 40123,
                    title: "PBI A"
                },
                {
                    id: 40456,
                    title: "PBI XPTO"
                }
            ]
        },
        {
            id: "789456",
            name: "Projeto B",
            creationDate: new Date(),
            description: "Entrega do Projeto B",
            relatedWits: [{ id: 40789, title: "PBI B" }]
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
        // let deliveryItens = this._deliveryItens;

        // if (filter)
        //     deliveryItens = deliveryItens.filter(item =>
        //         item.name.includes(filter)
        //         || item.relatedWits.find(m => m.id.toString().includes(filter)));

        // return deliveryItens.sort((a, b) => a.creationDate < b.creationDate ? -1 : 1);
        return this._allDeliveryItemsMock;
    }

    async getWitDetails(witId: number): Promise<IRelatedWitTableItem> {
        const wit = await this.getWit(witId);
        return Promise.resolve({
            status: Statuses.Success,
            id: wit!.id,
            title: wit!.title,
            effort: 10,
            column: "Dev Done",
            totalTaskWorkPlanned: 80,
            totalTaskWorkDone: 40,
            totalTaskWorkLeft: 10,
            todoTasksCount: 8,
            inProgressTaskCount: 4,
            doneTaskCount: 10,
            tasks: [
                {
                    status: Statuses.Waiting,
                    column: "To Do",
                    id: 1234,
                    title: "Implementação do Front",
                    workDone: 10,
                    workPlanned: 40,
                    workLeft: 30
                },
                {
                    status: Statuses.Success,
                    column: "Done",
                    id: 1234,
                    title: "Implementação do Back",
                    workDone: 45,
                    workPlanned: 40,
                    workLeft: 0
                }
            ]
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