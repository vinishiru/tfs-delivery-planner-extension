import * as React from "react";
import { Card } from "azure-devops-ui/Card";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { SimpleTableCell, renderSimpleCell, Table, ITableColumn } from "azure-devops-ui/Table";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Status, StatusSize, IStatusProps } from "azure-devops-ui/Status";
import { Link } from "azure-devops-ui/Link";
import Skeleton from 'react-loading-skeleton';
import ProgressBar from 'react-bootstrap/ProgressBar'
import _ from "lodash";

import { IDeliveryItem } from "../Interfaces/IDeliveryItem";
import { DeliveryItemDeleteDialog } from "./DeliveryItemDeleteDialog";


import SdkService from "../index"

const Fade = require('react-reveal/Fade');


export interface IRelatedWitTableItem {
    status: IStatusProps;
    id: number;
    title: string;
    effort: number;
    column: string;
    totalTaskWork: string;
    todoTasksCount: number;
    inProgressTaskCount: number;
    doneTaskCount: number;
}

function onSizeSizable(event: MouseEvent, index: number, width: number) {
    (sizableColumns[index].width as ObservableValue<number>).value = width;
}

let sizableColumns: ITableColumn<any>[];
sizableColumns = [
    {
        id: "id",
        name: "ID",
        width: new ObservableValue(-5),
        renderCell: renderIdColumn,
        onSize: onSizeSizable
    },
    {
        id: "title",
        name: "Título",
        width: new ObservableValue(-35),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "effort",
        name: "Pontos",
        // maxWidth: 100,
        width: new ObservableValue(-5),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "column",
        name: "Coluna",
        // maxWidth: 300,
        width: new ObservableValue(-20),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "totalTaskWork",
        name: "Horas Realizadas/Planejadas",
        // maxWidth: 180,
        width: new ObservableValue(-15),
        renderCell: renderSimpleCell,
        onSize: onSizeSizable
    },
    {
        id: "progress",
        name: "Progresso",
        // maxWidth: 300,
        width: new ObservableValue(-20),
        renderCell: renderProgressColumn,
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

function renderProgressColumn(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IRelatedWitTableItem>,
    tableItem: IRelatedWitTableItem
): JSX.Element {

    var totalTasks = tableItem.todoTasksCount + tableItem.inProgressTaskCount + tableItem.doneTaskCount;
    var porcentagemDone = tableItem.doneTaskCount / totalTasks * 100;
    var porcentagemInProgress = tableItem.inProgressTaskCount / totalTasks * 100;

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
            contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
        >
            <ProgressBar className={"flex-grow"}>
                <ProgressBar variant="success" now={porcentagemDone} key={1} />
                <ProgressBar animated now={porcentagemInProgress} key={2} />
            </ProgressBar>
        </SimpleTableCell>
    );
}

interface IDeliveryItemCardProps {
    deliveryItem: IDeliveryItem;
    onDelete: (deliveryItem: IDeliveryItem) => void;
    onEdit: (id: string) => void;

    isEditing?: ObservableValue<boolean>;
}

interface IDeliveryItemCardState {
    deliveryItem: IDeliveryItem;
    isDeleting: boolean;
    relatedWitLoaded: boolean;
}

export class DeliveryItemCard extends React.Component<IDeliveryItemCardProps, IDeliveryItemCardState> {

    deliveryTableItens: ArrayItemProvider<IRelatedWitTableItem>;

    constructor(props: IDeliveryItemCardProps) {
        super(props);

        this.state = { deliveryItem: props.deliveryItem, isDeleting: false, relatedWitLoaded: false };
        this.deliveryTableItens = new ArrayItemProvider<IRelatedWitTableItem>([]);
    }

    public async componentDidMount() {
        await this.loadDeliveryTableItemInfo();
    }

    public async componentWillReceiveProps(props: IDeliveryItemCardProps) {
        if (!_.isEqual(this.state.deliveryItem, props.deliveryItem)) {
            this.setState({ deliveryItem: props.deliveryItem }, async () => {
                await this.loadDeliveryTableItemInfo();
            });
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <Fade left distance={"5%"}>
                    <Card
                        className="flex-grow bolt-table-card"
                        titleProps={{ text: this.state.deliveryItem.name }}
                        headerCommandBarItems={this.commandBarItems(this.state.deliveryItem)}
                    >
                        {this.state.relatedWitLoaded &&
                            (
                                <Table<Partial<IRelatedWitTableItem>>
                                    columns={sizableColumns}
                                    itemProvider={this.deliveryTableItens}
                                />
                            )}

                        {!this.state.relatedWitLoaded && this.state.deliveryItem.relatedWits &&
                            (
                                <div className={"flex-grow padding-16"} >
                                    <Skeleton count={this.state.deliveryItem.relatedWits.length + 1} />
                                </div>
                            )}
                    </Card>
                </Fade>

                {this.state.isDeleting &&
                    (
                        <DeliveryItemDeleteDialog
                            key={this.state.deliveryItem.id}
                            deliveryItem={this.state.deliveryItem}
                            onDismiss={() => this.setState({ isDeleting: false })}
                            onDelete={() => {
                                this.props.onDelete(this.state.deliveryItem);
                                this.setState({ isDeleting: false });
                            }} />
                    )}
            </div>
        );
    }



    private async loadDeliveryTableItemInfo(): Promise<void> {
        if (this.state.deliveryItem.relatedWits) {
            this.setState({ relatedWitLoaded: false });
            const witArray = await Promise.all(this.state.deliveryItem.relatedWits.map(wit => SdkService.getWitDetails(wit.id)));
            this.deliveryTableItens = new ArrayItemProvider<IRelatedWitTableItem>(witArray);
            setTimeout(() => { this.setState({ relatedWitLoaded: true }); }, 2500);
        }
        else
            this.setState({ relatedWitLoaded: true });
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
                    alert("Atualizar item " + deliveryItem.id);
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
                    this.props.onEdit(deliveryItem.id);
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