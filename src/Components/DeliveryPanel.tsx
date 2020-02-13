import * as React from "react";

import { Panel } from "azure-devops-ui/Panel";
import { TextField, TextFieldWidth } from "azure-devops-ui/TextField";

interface IDeliveryPanelProps {
    onDismiss: () => void
}

interface IDeliveryPanelState {
    expanded: boolean;
}

export class DeliveryPanel extends React.Component<IDeliveryPanelProps, IDeliveryPanelState> {

    constructor(props: IDeliveryPanelProps) {
        super(props);

        this.handleDismiss = this.handleDismiss.bind(this);
    }

    public async componentDidMount() {

    }

    public render(): JSX.Element {
        return (
            <Panel
                className="rhythm-vertical-16"
                showSeparator={true}
                onDismiss={this.handleDismiss}
                titleProps={{ text: "Planejar Entrega" }}
                description={
                    "Dê um nome para sua entrega e adicione as PBIs necessárias para concluí-la."
                }
                footerButtonProps={[
                    {
                        text: "Cancelar", onClick: () => { this.handleDismiss() }
                    },
                    {
                        text: "Salvar", primary: true
                    }
                ]}>
                <TextField
                    value="Nenhum"
                    //onChange={(e, newValue) => (simpleObservable.value = newValue)}
                    placeholder="Search keyword"
                    width={TextFieldWidth.standard}
                />

                <TextField
                    value="Nenhum"
                    //onChange={(e, newValue) => (simpleObservable.value = newValue)}
                    placeholder="Search keyword"
                    width={TextFieldWidth.standard}
                />
            </Panel>
        );
    }

    private handleDismiss() {
        this.props.onDismiss();
        this.setState({ expanded: false });
    }

}
