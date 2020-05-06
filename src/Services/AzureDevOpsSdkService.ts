import * as SDK from 'azure-devops-extension-sdk'
import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"
import { IExtensionDataManager, IExtensionDataService, CommonServiceIds, IProjectPageService } from 'azure-devops-extension-api';
import { PeoplePickerProvider } from 'azure-devops-extension-api/Identities'
import { getClient } from 'azure-devops-extension-api';
import { WorkItemTrackingRestClient, WorkItemExpand, WorkItem, WorkItemRelation, WorkItemTrackingServiceIds, IWorkItemFormNavigationService } from 'azure-devops-extension-api/WorkItemTracking';
import { IDeliveryItem, IRelatedWit } from '../Interfaces/IDeliveryItem';
import { IRelatedWitTableItem } from '../Components/DeliveryItemCard';
import { Statuses } from 'azure-devops-ui/Components/Status/Status';
import { IStatusProps } from 'azure-devops-ui/Status';
import _ from 'lodash';

export class AzureDevOpsSdkService implements IAzureDevOpsService {
    peoplePickerProvider?: import("azure-devops-ui/IdentityPicker").IPeoplePickerProvider;

    private COLLECTION_NAME: string = "DeliveryItemCollection";
    private _dataManager?: IExtensionDataManager;
    private _workItemTrackingClient?: WorkItemTrackingRestClient;
    private _formService?: IWorkItemFormNavigationService;
    private _projectService?: IProjectPageService;
    // private _identitiesService?: IVssIdentityService;

    initialize(): void {
        SDK.init();
    }
    async ready(): Promise<void> {
        await SDK.ready();

        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        this._formService = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        this._projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        // this._identitiesService = await SDK.getService<IVssIdentityService>(IdentityServiceIds.IdentityService);
        this.peoplePickerProvider = new PeoplePickerProvider();

        const project = await this._projectService.getProject();
        this.COLLECTION_NAME += project!.name;

        this._dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
        this._workItemTrackingClient = getClient(WorkItemTrackingRestClient);
    }

    getUserDisplayName(): string {
        return SDK.getUser().displayName;
    }
    async getDeliveryItem(id: string): Promise<IDeliveryItem | undefined> {
        return await this._dataManager!.getDocument(this.COLLECTION_NAME, id);
    }
    async getDeliveryItens(filter?: string | undefined): Promise<IDeliveryItem[]> {

        if (!filter)
            return await this._dataManager!.getDocuments(this.COLLECTION_NAME) as IDeliveryItem[];

        let deliveryItens: IDeliveryItem[] = [];
        let collection = await this._dataManager!.queryCollectionsByName([this.COLLECTION_NAME]);

        if (collection!.length === 0)
            return await Promise.resolve(deliveryItens);

        deliveryItens = collection[0].documents;
        deliveryItens = deliveryItens.filter(item =>
            item.name.includes(filter)
            || item.relatedWits.find(m => m.id.toString().includes(filter)));

        return await Promise.resolve(deliveryItens);
    }
    async saveDeliveryItem(deliveryItem: IDeliveryItem): Promise<void> {
        _.merge(deliveryItem, { __etag: -1 });
        await this._dataManager!.setDocument(this.COLLECTION_NAME, deliveryItem);
    }
    async deleteDeliveryItem(deliveryItem: IDeliveryItem): Promise<void> {
        await this._dataManager!.deleteDocument(this.COLLECTION_NAME, deliveryItem.id);
    }
    async getWitDetails(witId: number): Promise<IRelatedWitTableItem | undefined> {
        var wit = await this._workItemTrackingClient!.getWorkItem(witId, undefined, undefined, undefined, WorkItemExpand.All);

        if (!wit)
            return;

        var tasks = await this.getChildTasks(wit!);

        console.log(witId);
        console.log(tasks);

        var totalTaskWorkDone = tasks.reduce((a, b) => a + (b.fields["Simply.HorasRealizadas"] || 0), 0);
        var totalTaskWorkPlanned = tasks.reduce((a, b) => a + (b.fields["Simply.HorasPrevistas"] || 0), 0);

        console.log(`${totalTaskWorkDone}/${totalTaskWorkPlanned}`);

        var relatedWitTableItem: IRelatedWitTableItem = {
            status: this.getWitStatus(wit),
            id: wit.fields["System.Id"],
            title: wit.fields["System.Title"],
            effort: wit.fields["Microsoft.VSTS.Scheduling.Effort"],
            column: wit.fields["System.BoardColumn"] + (wit.fields["System.BoardColumnDone"] ? " Done" : ""),
            totalTaskWorkDone: totalTaskWorkDone,
            totalTaskWorkPlanned: totalTaskWorkPlanned,
            todoTasksCount: tasks.filter(m => m.fields["System.State"] === "To Do").length,
            inProgressTaskCount: tasks.filter(m => m.fields["System.State"] === "In Progress").length,
            doneTaskCount: tasks.filter(m => m.fields["System.State"] === "Done").length
        };

        console.log(relatedWitTableItem);

        return await Promise.resolve(relatedWitTableItem);

    }

    private getWitStatus(wit: WorkItem): IStatusProps {
        var witState = wit.fields["System.State"];

        if (wit.fields["System.Tags"].includes("Impedimento"))
            return Statuses.Warning;

        switch (witState) {
            case "New":
                return Statuses.Queued;
            case "Approved":
                return Statuses.Waiting;
            case "Commited":
                return Statuses.Running;
            case "Done":
                return Statuses.Success;
            case "Removed":
                return Statuses.Canceled;
            default:
                break;
        }
        return Statuses.Information;
    }

    async getWit(witId: number): Promise<IRelatedWit | undefined> {
        var wit = await this._workItemTrackingClient!.getWorkItem(witId, undefined, undefined, undefined, WorkItemExpand.All);

        if (!wit)
            return;

        return Promise.resolve({
            id: wit.fields["System.Id"],
            title: wit.fields["System.Title"],
        });
    }

    openWorkItem(witId: number): void {
        this._formService!.openWorkItem(witId);
    }

    private async getChildTasks(wit: WorkItem): Promise<WorkItem[]> {
        var tasks: WorkItem[] = new Array<WorkItem>();

        if (!wit.relations)
            return Promise.resolve(tasks);

        for (let relation of wit.relations)
            if (relation.rel === "System.LinkTypes.Hierarchy-Forward"
                && relation.attributes["name"] === "Child") {
                var taskId = this.getTaskId(relation);
                var task = await this._workItemTrackingClient!.getWorkItem(taskId, undefined, undefined, undefined, WorkItemExpand.All);
                tasks.push(task);
            }

        return Promise.resolve(tasks);
    }


    private getTaskId(relation: WorkItemRelation): number {
        var index = relation.url.lastIndexOf("/");
        return +relation.url.slice(index + 1, relation.url.length);
    }
}