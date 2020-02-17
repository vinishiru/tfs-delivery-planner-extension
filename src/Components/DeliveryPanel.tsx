import * as React from "react";

import { Panel } from "azure-devops-ui/Panel";
import { FormItem } from "azure-devops-ui/FormItem";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";
import { Toggle } from "azure-devops-ui/Toggle";

interface IDeliveryPanelProps {
    onDismiss: () => void
    deliveryId?: string;
    name?: string;
    description?: string;
    booleano?: boolean;
}

interface IDeliveryPanelState {
    deliveryId?: string;
    name?: string;
    description?: string;
    booleano?: boolean;
}

export class DeliveryPanel extends React.Component<IDeliveryPanelProps, IDeliveryPanelState> {

    constructor(props: IDeliveryPanelProps) {
        super(props);

        this.state = {};
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    public async componentDidMount() {

    }

    public render(): JSX.Element {

        const { name, description, booleano } = this.state;

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
                        text: "Salvar", primary: true
                    }
                ]}>
                <div className="flex-column rhythm-vertical-16">
                    <FormItem
                        label={"Nome da entrega:"}
                        message="Use an exciting spy name for identification"
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
                        message="Use an exciting spy name for identification"
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

                    <Toggle
                        offText={"Não"}
                        onText={"Sim"}
                        checked={booleano}
                        onChange={(e, value) => this.setState({ booleano: value })}
                    />
                </div>
            </Panel>
        );
    }

    private handleDismiss() {
        this.props.onDismiss();
    }

}
