import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"

export class MoqAzureDevOpsService implements IAzureDevOpsService {
    initialize(): void {
        //faz nada
    }
    async ready(): Promise<void> {
        //finge que fez
    }
    getUserDisplayName(): string {
        return "Dummy User";
    }
}