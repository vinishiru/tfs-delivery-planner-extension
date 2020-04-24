import * as SDK from 'azure-devops-extension-sdk'
import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"
import { IExtensionDataManager, IExtensionDataService, CommonServiceIds } from 'azure-devops-extension-api';
import { getClient } from 'azure-devops-extension-api';
import { WorkItemTrackingRestClient, WorkItemExpand, WorkItem, WorkItemRelation } from 'azure-devops-extension-api/WorkItemTracking';
import { IDeliveryItem } from '../Interfaces/IDeliveryItem';
import { IRelatedWitTableItem } from '../Components/DeliveryItemCard';

export class AzureDevOpsSdkService implements IAzureDevOpsService {

    private COLLECTION_NAME: string = "DeliveryItemCollection";
    private _dataManager?: IExtensionDataManager;
    private _workItemTrackingClient?: WorkItemTrackingRestClient;

    initialize(): void {
        SDK.init();
    }
    async ready(): Promise<void> {
        await SDK.ready();

        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        this._dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
        this._workItemTrackingClient = getClient(WorkItemTrackingRestClient);
    }

    getUserDisplayName(): string {
        return SDK.getUser().displayName;
    }
    async getDeliveryItem(id: string): Promise<IDeliveryItem | undefined> {
        return await this._dataManager?.getDocument(this.COLLECTION_NAME, id);
    }
    async getDeliveryItens(filter?: string | undefined): Promise<IDeliveryItem[]> {

        if (!filter)
            return await this._dataManager?.getDocuments(this.COLLECTION_NAME) as IDeliveryItem[];

        let deliveryItens: IDeliveryItem[] = [];
        let collection = await this._dataManager?.queryCollectionsByName([this.COLLECTION_NAME]);

        if (collection?.length != 0)
            return await Promise.resolve(deliveryItens);

        deliveryItens = collection[0].documents;
        deliveryItens = deliveryItens.filter(item =>
            item.name.includes(filter));

        return await Promise.resolve(deliveryItens);
    }
    async saveDeliveryItem(deliveryItem: IDeliveryItem): void {
        await this._dataManager?.setDocument(this.COLLECTION_NAME, deliveryItem);
    }
    async deleteDeliveryItem(deliveryItem: IDeliveryItem): void {
        await this._dataManager?.deleteDocument(this.COLLECTION_NAME, deliveryItem.id);
    }
    async getWitDetails(witId: number): Promise<IRelatedWitTableItem | undefined> {
        var wit = await this._workItemTrackingClient?.getWorkItem(witId, undefined, undefined, undefined, WorkItemExpand.All);

        if (!wit)
            return;

        var tasks = await this.getChildTasks(wit!);

        return await Promise.resolve({
            status: this.getWitStatusIcon(wit),
            id: wit?.fields["System.Id"],
            title: wit?.fields["System.Title"],
            effort: wit?.fields["Microsoft.VSTS.Scheduling.Effort"],
            column: wit?.fields["System.BoardColumn"] + (wit?.fields["System.BoardColumnDone"] && "Done"),
            totalTaskWork: "10/80",
            todoTasksCount: 8,
            inProgressTaskCount: 4,
            doneTaskCount: 10
        });

    }

    async getChildTasks(wit: WorkItem): Promise<WorkItem[]> {
        var tasks: WorkItem[] = [];

        wit?.relations.forEach(async (relation) => {
            var taskId = this.getTaskId(relation);
            tasks.push(await this._workItemTrackingClient?.getWorkItem(taskId, undefined, undefined, undefined, WorkItemExpand.All)!);
        });
        return tasks;
    }

    private getTaskId(relation: WorkItemRelation): number {
        var index = relation.url.lastIndexOf("/");
        return +relation.url.slice(index + 1, relation.url.length);
    }
}