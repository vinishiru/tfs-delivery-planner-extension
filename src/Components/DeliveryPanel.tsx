import * as React from "react";

import { Panel } from "azure-devops-ui/Panel";
import { FormItem } from "azure-devops-ui/FormItem";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";

import { IDeliveryItem, IRelatedWit } from "../Interfaces/IDeliveryItem";
import { WorkItemPicker } from "./WorkItemPicker";
import SdkService from "..";

interface IDeliveryPanelProps {
    onDismiss: () => void;
    onSave: (deliveryItem: IDeliveryItem) => void;
    deliveryId?: string;
}

interface IDeliveryPanelState {
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

    constructor(props: IDeliveryPanelProps) {
        super(props);

        this.state = { nameError: false, descriptionError: false, relatedWitError: false };

        this.handleUpdatedRelatedWits = this.handleUpdatedRelatedWits.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    public async componentDidMount() {

        if (!this.props.deliveryId)
            return;

        var deliveryItem = await SdkService.getDeliveryItem(this.props.deliveryId!);

        if (deliveryItem)
            this.setState({
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
                        text: "Salvar", primary: true, onClick: () => { this.handleSave() }
                    }
                ]}>
                <div className="flex-column rhythm-vertical-16">
                    <FormItem
                        label={"Nome da entrega:"}
                        error={this.state.nameError}
                        message={this.state.nameError && "Informe uma descrição."}
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
                        message={this.state.descriptionError && "Informe uma descrição."}>
                        <WorkItemPicker relatedWits={relatedWits || []} updateRelatedWits={this.handleUpdatedRelatedWits} />
                    </FormItem>

                </div>
            </Panel>
        );
    }

    private handleUpdatedRelatedWits(relatedWits: IRelatedWit[]) {
        this.setState({ relatedWits: relatedWits });
    }

    private handleDismiss() {
        this.props.onDismiss();
    }
    private handleSave() {

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
            deliveryId: this.props.deliveryId!,
            creationDate: this.state.creationDate! || new Date(),
            name: this.state.name!,
            description: this.state.description!,
            relatedWits: this.state.relatedWits!
        };
        this.props.onSave(deliveryItem);
    }
}
