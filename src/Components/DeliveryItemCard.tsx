import * as React from "react";
import { Card } from "azure-devops-ui/Card";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { SimpleTableCell, renderSimpleCell, Table, ITableColumn } from "azure-devops-ui/Table";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { IDeliveryItem, IRelatedWit } from "../Interfaces/IDeliveryItem";
import { Status, StatusSize, Statuses, IStatusProps } from "azure-devops-ui/Status";
import { Link } from "azure-devops-ui/Link";
import { DeliveryItemDeleteDialog } from "./DeliveryItemDeleteDialog";

const Fade = require('react-reveal/Fade');


interface IRelatedWitTableItem {
    status: IStatusProps;
    id: number;
    title: string;
    effort: number;
    column: string;
    totalTaskWork: string;
}

function onSizeSizable(event: MouseEvent, index: number, width: number) {
    (sizableColumns[index].width as ObservableValue<number>).value = width;
}

let sizableColumns: ITableColumn<any>[];
sizableColumns = [
    {
        id: "id",
        name: "ID",
        minWidth: 15,
        width: new ObservableValue(100),
        renderCell: renderIdColumn,
        onSize: onSizeSizable
    },
    {
        id: "title",
        name: "Título",
        maxWidth: 300,
        width: new ObservableValue(200),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "effort",
        name: "Pontos",
        maxWidth: 100,
        width: new ObservableValue(100),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "column",
        name: "Coluna",
        maxWidth: 300,
        width: new ObservableValue(200),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "totalTaskWork",
        name: "Total de Horas",
        maxWidth: 150,
        width: new ObservableValue(150),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "progress",
        name: "Progresso",
        maxWidth: 300,
        width: new ObservableValue(300),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    }
];

function renderIdColumn(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IRelatedWitTableItem>,
    tableItem: IRelatedWitTableItem
): JSX.Element {
    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
            contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
        >
            <Status
                {...tableItem.status}
                className="icon-large-margin"
                size={StatusSize.m}
            />
            <div className="flex-row scroll-hidden">

                <Link className="fontSizeMS font-size-ms secondary-text bolt-table-link bolt-table-inline-link"
                    onClick={() => alert("WIT de id " + tableItem.id)}>
                    {tableItem.id}
                </Link>
            </div>
        </SimpleTableCell>
    );
}

interface IDeliveryItemCardProps {
    deliveryItem: IDeliveryItem
    onDelete: (deliveryItem: IDeliveryItem) => void;
}

interface IDeliveryItemCardState {
    isDeleting: boolean;
}

export class DeliveryItemCard extends React.Component<IDeliveryItemCardProps, IDeliveryItemCardState> {

    deliveryTableItens: ArrayItemProvider<IRelatedWitTableItem>;

    constructor(props: IDeliveryItemCardProps) {
        super(props);

        this.state = { isDeleting: false };
        this.deliveryTableItens = new ArrayItemProvider<IRelatedWitTableItem>([]);
    }

    public async componentDidMount() {
        const witArray = this.props.deliveryItem.relatedWits.map(wit => this.getDeliveryTableItemInfo(wit));
        this.deliveryTableItens = new ArrayItemProvider<IRelatedWitTableItem>(witArray);

        this.setState({});
    }

    getDeliveryTableItemInfo(wit: IRelatedWit): IRelatedWitTableItem {
        let tableItem: IRelatedWitTableItem;

        tableItem = {
            status: Statuses.Success,
            id: wit.id,
            title: wit.name,
            effort: 10,
            column: "Dev Done",
            totalTaskWork: "10/80"
        };

        return tableItem;
    }

    public render(): JSX.Element {
        return (
            <div>
                <Fade left distance={"5%"}>
                    <Card
                        className="bolt-table-card"
                        titleProps={{ text: this.props.deliveryItem.name }}
                        headerCommandBarItems={this.commandBarItems(this.props.deliveryItem)}
                    >
                        <Table<Partial<IRelatedWitTableItem>>
                            columns={sizableColumns}
                            itemProvider={this.deliveryTableItens}
                        />
                    </Card>
                </Fade>

                {this.state.isDeleting &&
                    (<DeliveryItemDeleteDialog
                        deliveryItem={this.props.deliveryItem}
                        onDismiss={() => this.setState({ isDeleting: false })}
                        onDelete={() => {
                            this.props.onDelete(this.props.deliveryItem);
                            this.setState({isDeleting: false});
                        }} />
                    )}
            </div>
        );
    }

    private commandBarItems(deliveryItem: IDeliveryItem): IHeaderCommandBarItem[] {
        return [
            {
                id: "delete",
                text: "Excluir",
                onActivate: () => {
                    this.setState({ isDeleting: true });
                },
                iconProps: {
                    iconName: "Delete"
                }
            },
            {
                id: "refresh",
                text: "Atualizar",
                onActivate: (e, i) => {
                    alert("Atualizar item " + deliveryItem.deliveryId);
                },
                iconProps: {
                    iconName: "Refresh"
                }
            },
            {
                important: true,
                id: "edit",
                text: "Editar",
                onActivate: () => {
                    alert("Editar item " + deliveryItem.deliveryId);
                },
                iconProps: {
                    iconName: "Edit"
                },
                isPrimary: true,
                tooltipProps: {
                    text: "Edite os itens da entrega."
                }
            }
        ];
    }
}