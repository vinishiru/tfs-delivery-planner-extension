import * as React from "react";
import { Card } from "azure-devops-ui/Card";
import { IHeaderCommandBarItem, HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { SimpleTableCell, renderSimpleCell, Table, ITableColumn, ITableRowDetails, ITableRow } from "azure-devops-ui/Table";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Status, StatusSize, IStatusProps } from "azure-devops-ui/Status";
import { Link } from "azure-devops-ui/Link";
import Skeleton from 'react-loading-skeleton';
import ProgressBar from 'react-bootstrap/ProgressBar'
import Badge from 'react-bootstrap/Badge'
import * as _ from "lodash";

import { IDeliveryItem } from "../Interfaces/IDeliveryItem";
import { DeliveryItemDeleteDialog } from "./DeliveryItemDeleteDialog";


import SdkService from "../index"
import { CustomHeader, HeaderTitleArea, HeaderTitleRow, HeaderTitle, TitleSize, HeaderDescription, Header } from "azure-devops-ui/Header";
import { DeliveryItemCardTableRow } from "./DeliveryItemCardTableRow";

const Fade = require('react-reveal/Fade');


export interface IRelatedWitTableItem {
    status: IStatusProps;
    id: number;
    title: string;
    effort: number;
    column: string;
    totalTaskWorkPlanned: number;
    totalTaskWorkDone: number;
    totalTaskWorkLeft: number;
    todoTasksCount: number;
    inProgressTaskCount: number;
    doneTaskCount: number;
    tasks?: IRelatedWitTaskTableItem[];
}

export interface IRelatedWitTaskTableItem {
    status: IStatusProps;
    id: number;
    title: string;
    column: string;
    workPlanned: number;
    workDone: number;
    workLeft: number;
}

export interface ITableItemSummary {
    totalWits: number;
    totalTasks: number;
    totalWorkPlanned: number;
    totalWorkDone: number;
    totalWorkLeft: number;
}

export function onSizeSizable(event: MouseEvent, index: number, width: number) {
    (sizableColumns[index].width as ObservableValue<number>).value = width;
}

export let sizableColumns: ITableColumn<any>[] = [
    {
        id: "id",
        name: "ID",
        width: 100,
        minWidth: 100,
        renderCell: renderIdColumn
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
        name: "Horas Realizadas/Previstas/Restando",
        // maxWidth: 180,
        width: new ObservableValue(-15),
        renderCell: renderTaskWorkCell,
        onSize: onSizeSizable
    },
    {
        id: "progress",
        name: "Progresso de Tasks",
        // maxWidth: 300,
        width: new ObservableValue(-20),
        renderCell: renderProgressColumn,
        onSize: onSizeSizable
    }
];

export let summaryColumns: ITableColumn<any>[] = [
    {
        id: "totalWits",
        name: "Total de Work Itens",
        width: new ObservableValue(-20),
        renderCell: renderBoldCell,
        onSize: onSizeSizable
    },
    {
        id: "totalTasks",
        name: "Total de Tasks",
        width: new ObservableValue(-20),
        renderCell: renderBoldCell,
        onSize: onSizeSizable
    },
    {
        id: "totalWorkPlanned",
        name: "Total Horas Planejadas",
        width: new ObservableValue(-20),
        renderCell: renderBoldCell,
        onSize: onSizeSizable
    },
    {
        id: "totalWorkDone",
        name: "Total Horas Realizadas",
        // maxWidth: 100,
        width: new ObservableValue(-20),
        renderCell: renderBoldCell,
        onSize: onSizeSizable
    },
    {
        id: "totalWorkLeft",
        name: "Total Horas Restando",
        // maxWidth: 300,
        width: new ObservableValue(-20),
        renderCell: renderBoldCell,
        onSize: onSizeSizable
    }
];

function renderBoldCell(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<ITableItemSummary>,
    tableItem: any
): JSX.Element {
    const value = parseFloat(tableItem[tableColumn.id] || 0);
    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
            contentClassName="font-weight-semibold font-size-l scroll-hidden"
        >
            {value.toFixed(1)}
        </SimpleTableCell>
    );
}

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
                    onClick={() => SdkService.openWorkItem(tableItem.id)}>
                    {tableItem.id}
                </Link>
            </div>
        </SimpleTableCell>
    );
}

function renderTaskWorkCell(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IRelatedWitTableItem>,
    tableItem: IRelatedWitTableItem
): JSX.Element {
    const deadlineReached = tableItem.totalTaskWorkDone > tableItem.totalTaskWorkPlanned;
    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
            contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
        >
            <h5>
                <Badge variant={deadlineReached ? "danger" : "primary"}>{tableItem.totalTaskWorkDone.toFixed(1)}/{tableItem.totalTaskWorkPlanned.toFixed(1)}/{tableItem.totalTaskWorkLeft.toFixed(1)}</Badge>
            </h5>
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
    var porcentagemTodo = tableItem.todoTasksCount / totalTasks * 100;

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
            contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
        >
            <ProgressBar className={"flex-grow"}>
                <ProgressBar variant="success" now={porcentagemDone} label={`${tableItem.doneTaskCount} Done`} key={1} />
                <ProgressBar animated now={porcentagemInProgress} label={`${tableItem.inProgressTaskCount} In Progress`} key={2} />
                <ProgressBar className={"bg-secondary"} now={porcentagemTodo} label={`${tableItem.todoTasksCount} To Do`} key={3} />
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
    activatedRowsIndexes: number[];
}

export class DeliveryItemCard extends React.Component<IDeliveryItemCardProps, IDeliveryItemCardState> {

    deliveryTableItens: ArrayItemProvider<IRelatedWitTableItem | undefined>;
    summaryTableItem: ArrayItemProvider<ITableItemSummary>;

    constructor(props: IDeliveryItemCardProps) {
        super(props);

        this.state = { deliveryItem: props.deliveryItem, isDeleting: false, relatedWitLoaded: false, activatedRowsIndexes: [] };
        this.deliveryTableItens = new ArrayItemProvider<IRelatedWitTableItem>([]);
        this.summaryTableItem = new ArrayItemProvider<ITableItemSummary>([]);
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
                        renderHeader={() => this.renderCardHeader(this.state.deliveryItem)}
                        className="flex-grow bolt-table-card"
                        titleProps={{ text: this.state.deliveryItem.name }}
                        headerCommandBarItems={this.commandBarItems(this.state.deliveryItem)}
                    >
                        {this.state.relatedWitLoaded &&
                            (
                                <React.Fragment>
                                    <div className="flex-column">
                                        <Table<Partial<IRelatedWitTableItem | undefined>>
                                            columns={sizableColumns}
                                            itemProvider={this.deliveryTableItens}
                                            renderRow={(rowIndex, item, rowDetails) => this.renderTableRow(rowIndex, item, rowDetails)}
                                        // onSelect={(event, row) => this.onRowClicked(row)}
                                        />
                                        <Table<ITableItemSummary>
                                            columns={summaryColumns}
                                            itemProvider={this.summaryTableItem}
                                            role="table"
                                            className="table-example"
                                            containerClassName="h-scroll-auto"
                                        />
                                    </div>
                                </React.Fragment>
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

    private onRowClicked(row: ITableRow<Partial<IRelatedWitTableItem | undefined>>) {
        const indexOfRow = this.state.activatedRowsIndexes.indexOf(row.index);
        var newArray = this.state.activatedRowsIndexes.slice();
        if (indexOfRow !== -1) {
            newArray.splice(indexOfRow, 1);
        }
        else {
            newArray.push(row.index);
        }
        this.setState({ activatedRowsIndexes: newArray });
    }

    private renderTableRow(rowIndex: number, item: Partial<IRelatedWitTableItem | undefined>, rowDetails: ITableRowDetails<any>): JSX.Element {
        return (
            <DeliveryItemCardTableRow
                key={item!.id}
                rowDetails={rowDetails}
                rowIndex={rowIndex}
                item={item}
                deliveryItemId={this.props.deliveryItem.id}
                isActivated={this.state.activatedRowsIndexes.includes(rowIndex)}
            />
        );
    }

    private renderCardHeader(deliveryItem: IDeliveryItem): JSX.Element {
        return (
            <CustomHeader className="bolt-header-with-commandbar">
                {/* <HeaderIcon
                    className="bolt-table-status-icon-large"
                    iconProps={{ render: this.renderStatus }}
                    titleSize={TitleSize.Large}
                /> */}
                <HeaderTitleArea>
                    <HeaderTitleRow>
                        <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                            {deliveryItem.name}
                        </HeaderTitle>
                        {deliveryItem.owner && <div>{deliveryItem.owner.displayName!}</div>}
                    </HeaderTitleRow>
                    <HeaderDescription>
                        {deliveryItem.description}
                    </HeaderDescription>
                </HeaderTitleArea>
                <HeaderCommandBar items={this.commandBarItems(this.state.deliveryItem)} />
            </CustomHeader>
        );
    }

    private async loadDeliveryTableItemInfo(): Promise<void> {
        if (this.state.deliveryItem.relatedWits) {
            this.setState({ relatedWitLoaded: false });
            const witArray = await Promise.all(this.state.deliveryItem.relatedWits.map(wit => SdkService.getWitDetails(wit.id)));
            this.deliveryTableItens = new ArrayItemProvider<IRelatedWitTableItem | undefined>(witArray);
            this.summaryTableItem = new ArrayItemProvider<ITableItemSummary>([
                {
                    totalWits: witArray.length,
                    totalTasks: witArray.map(m => m!.tasks!.length || 0).reduce((acc, curr) => acc + curr),
                    totalWorkDone: witArray.map(m => m!.totalTaskWorkDone || 0).reduce((acc, curr) => acc + curr),
                    totalWorkLeft: witArray.map(m => m!.totalTaskWorkLeft || 0).reduce((acc, curr) => acc + curr),
                    totalWorkPlanned: witArray.map(m => m!.totalTaskWorkPlanned || 0).reduce((acc, curr) => acc + curr)
                }
            ]);
            this.setState({ relatedWitLoaded: true });
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