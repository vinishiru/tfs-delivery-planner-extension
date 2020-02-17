export interface IDeliveryItem {
    deliveryId: string,
    name: string,
    description: string,
    relatedWits: IRelatedWit[]
}

export interface IRelatedWit {
    id: number,
    name: string
}