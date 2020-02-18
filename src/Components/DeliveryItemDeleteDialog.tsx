import * as React from "react";

import { Dialog } from "azure-devops-ui/Dialog";

import { IDeliveryItem } from "../Interfaces/IDeliveryItem";

interface IDeliveryItemDeleteDialogProps {
    deliveryItem: IDeliveryItem;
    onDismiss: () => void;
    onDelete: (deliveryItem: IDeliveryItem) => void;
}

export class DeliveryItemDeleteDialog extends React.Component<IDeliveryItemDeleteDialogProps> {
    public render(): JSX.Element {
        return (
            <Dialog
                titleProps={{ text: "Confirmar Exclusão" }}
                footerButtonProps={[
                    {
                        text: "Cancelar",
                        onClick: () => { this.props.onDismiss() }
                    },
                    {
                        text: "Excluir",
                        onClick: () => { this.props.onDelete(this.props.deliveryItem); },
                        primary: true
                    }
                ]}
                onDismiss={this.props.onDismiss}
            >
                Tem certeza que deseja excluir a entrega '{this.props.deliveryItem.name}'?
                    </Dialog>
        );
    }

}
