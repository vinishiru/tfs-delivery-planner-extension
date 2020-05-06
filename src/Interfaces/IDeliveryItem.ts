export interface IDeliveryItem {
    owner?: IIdentity,
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

export interface IIdentity {
    identityId: string,
    displayName: string
}