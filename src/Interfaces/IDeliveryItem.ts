export interface IDeliveryItem {
    deliveryId: string,
    name: string,
    description: string,
    creationDate: Date,
    relatedWits: IRelatedWit[]
}

export interface IRelatedWit {
    id: number,
    title: string
}