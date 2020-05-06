import * as React from "react";

import { Panel } from "azure-devops-ui/Panel";
import { FormItem } from "azure-devops-ui/FormItem";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { IdentityPickerDropdown } from "azure-devops-ui/IdentityPicker";

import { IDeliveryItem, IRelatedWit, IIdentity } from "../Interfaces/IDeliveryItem";
import { WorkItemPicker } from "./WorkItemPicker";
import SdkService from "..";

interface IDeliveryPanelProps {
    onDismiss: () => void;
    onSave: (deliveryItem: IDeliveryItem) => Promise<void>;
    deliveryId?: string;
}

interface IDeliveryPanelState {
    owner?: IIdentity;
    deliveryId?: string;
    name?: string;
    description?: string;
    relatedWits?: IRelatedWit[];
    creationDate?: Date;

    nameError: boolean;
    descriptionError: boolean;
    relatedWitError: boolean;
}

export class DeliveryPanel extends React.Component<IDeliveryPanelProps, IDeliveryPanelState> {

    private _identitySelected?: import("azure-devops-ui/IdentityPicker").IIdentity;

    constructor(props: IDeliveryPanelProps) {
        super(props);

        this.state = { nameError: false, descriptionError: false, relatedWitError: false };

        this.handleUpdatedRelatedWits = this.handleUpdatedRelatedWits.bind(this);
        this.handleOwnerChange = this.handleOwnerChange.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    public async componentDidMount() {

        if (!this.props.deliveryId)
            return;

        var deliveryItem = await SdkService.getDeliveryItem(this.props.deliveryId!);


        if (!deliveryItem)
            return;

        this._identitySelected = deliveryItem.owner && await SdkService.peoplePickerProvider.getEntityFromUniqueAttribute(deliveryItem!.owner!.identityId!);

        this.setState({
            owner: this._identitySelected ? {
                displayName: this._identitySelected.displayName!,
                identityId: this._identitySelected.entityId,
            } : undefined,
            name: deliveryItem.name,
            description: deliveryItem.description,
            relatedWits: deliveryItem.relatedWits,
            creationDate: deliveryItem.creationDate
        });

    }

    public render(): JSX.Element {

        const { name, description, relatedWits } = this.state;

        return (
            <Panel
                onDismiss={this.handleDismiss}
                titleProps={{ text: "Planejar Entrega" }}
                description={"Dê um nome para sua entrega e adicione as PBIs necessárias para concluí-la."}
                footerButtonProps={[
                    {
                        text: "Cancelar", onClick: () => { this.handleDismiss() }
                    },
                    {
                        text: "Salvar", primary: true, onClick: async () => { await this.handleSave() }
                    }
                ]}>
                <div className="flex-column rhythm-vertical-16">

                    <FormItem
                        label={"Responsável:"}
                    >
                        <IdentityPickerDropdown
                            onChange={(item) => this.handleOwnerChange(item)}
                            editPlaceholder={"Informe um usuário."}
                            noResultsFoundText={"Nenhum usuário encontrado."}
                            placeholder={"Informe um usuário."}
                            pickerProvider={SdkService.peoplePickerProvider}
                            value={this._identitySelected}
                        />
                    </FormItem>

                    <FormItem
                        label={"Nome da entrega:"}
                        error={this.state.nameError}
                        message={this.state.nameError && "Informe um nome."}
                    >
                        <TextField
                            value={name}
                            onChange={(e, value) => this.setState({ name: value })}
                            placeholder="ex: projeto do cliente A"
                            width={TextFieldWidth.standard}
                        />
                    </FormItem>

                    <FormItem
                        label={"Descrição:"}
                        error={this.state.descriptionError}
                        message={this.state.descriptionError && "Informe uma descrição."}
                    >
                        <TextField
                            autoAdjustHeight={true}
                            value={description}
                            onChange={(e, value) => this.setState({ description: value })}
                            placeholder="ex: primeira parte do projeto do cliente A"
                            multiline={true}
                            width={TextFieldWidth.standard}
                        />
                    </FormItem>
                    <FormItem
                        label={"Work Itens:"}
                        error={this.state.descriptionError}
                        message={this.state.descriptionError && "Informe alguns work itens."}>
                        <WorkItemPicker relatedWits={relatedWits || []} updateRelatedWits={this.handleUpdatedRelatedWits} />
                    </FormItem>

                </div>
            </Panel>
        );
    }

    private handleOwnerChange(item: import("azure-devops-ui/IdentityPicker").IIdentity | undefined) {
        if (!item)
            return;

        this.setState({ owner: { displayName: item!.displayName!, identityId: item!.entityId } });
    }

    private handleUpdatedRelatedWits(relatedWits: IRelatedWit[]) {
        this.setState({ relatedWits: relatedWits });
    }

    private handleDismiss() {
        this.props.onDismiss();
    }
    private async handleSave() {

        var validationErrors = { ...this.state };

        if (!this.state.name)
            validationErrors.nameError = true;
        else
            validationErrors.nameError = false;

        if (!this.state.description)
            validationErrors.descriptionError = true;
        else
            validationErrors.descriptionError = false;


        if (validationErrors.nameError || validationErrors.descriptionError) {
            this.setState(validationErrors);
            return;
        }

        var deliveryItem: IDeliveryItem;
        deliveryItem = {
            id: this.props.deliveryId!,
            creationDate: this.state.creationDate! || new Date(),
            name: this.state.name!,
            description: this.state.description!,
            relatedWits: this.state.relatedWits!,
            owner: this.state.owner
        };
        await this.props.onSave(deliveryItem);
    }
}
