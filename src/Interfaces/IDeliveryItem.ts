export interface IDeliveryItem {
    id: string,
    name: string,
    description: string,
    creationDate: Date,
    relatedWits: IRelatedWit[]
}

export interface IRelatedWit {
    id: number,
    title: string
}