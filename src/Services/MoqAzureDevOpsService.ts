import { IAzureDevOpsService } from "../Interfaces/IAzureDevOpsService"
import { IDeliveryItem } from "../Interfaces/IDeliveryItem"

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

    async getAllDeliveryItens(): Promise<IDeliveryItem[]> {
        return [
            {
                deliveryId: "asdf",
                name: "Projeto A",
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
                description: "Entrega do Projeto B",
                relatedWits: [{ id: 2, name: "PBI B" }]
            }
        ];
    }
}