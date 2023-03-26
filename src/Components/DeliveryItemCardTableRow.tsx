import { Link } from "azure-devops-ui/Components/Link/Link";
import { Status } from "azure-devops-ui/Components/Status/Status";
import { StatusSize } from "azure-devops-ui/Components/Status/Status.Props";
import { renderColumns, renderEmptyCell, renderSimpleCell, SimpleTableCell, Table, TableRow } from "azure-devops-ui/Components/Table/Table";
import { ITableColumn } from "azure-devops-ui/Components/Table/Table.Props";
import { ObservableValue, useObservable } from "azure-devops-ui/Core/Observable";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import SdkService from "..";
import { IRelatedWitTableItem, IRelatedWitTaskTableItem, onSizeSizable, sizableColumns } from "./DeliveryItemCard";
const Fade = require('react-reveal/Fade');

export interface IDeliveryItemCardTableRowProps {
    rowDetails: any;
    rowIndex: number;
    item: Partial<IRelatedWitTableItem | undefined>;
    isActivated: boolean;
}
export interface IDeliveryItemCardTableRowState {
    isActivated: boolean;
}

let sizableTasksColumns: ITableColumn<any>[] = [
    {
        id: "blank",
        name: "",
        width: 100,
        minWidth: 100,
        renderCell: renderEmptyCell
    },
    {
        id: "id",
        name: "Task ID",
        width: 100,
        minWidth: 100,
        renderCell: renderIdColumn
    },
    {
        id: "title",
        name: "Título",
        width: new ObservableValue(-30),
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
        width: new ObservableValue(-30),
        renderCell: renderTaskWorkCell,
        onSize: onSizeSizable
    }
];

function renderIdColumn(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IRelatedWitTaskTableItem>,
    tableItem: IRelatedWitTaskTableItem
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
    tableColumn: ITableColumn<IRelatedWitTaskTableItem>,
    tableItem: IRelatedWitTaskTableItem
): JSX.Element {
    const deadlineReached = tableItem.workDone > tableItem.workPlanned;
    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
            contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
        >
            <h5>
                <Badge variant={deadlineReached ? "danger" : "primary"}>{tableItem.workDone.toFixed(1)}/{tableItem.workPlanned.toFixed(1)}/{tableItem.workLeft.toFixed(1)}</Badge>
            </h5>
        </SimpleTableCell>
    );
}

export class DeliveryItemCardTableRow extends React.Component<IDeliveryItemCardTableRowProps, IDeliveryItemCardTableRowState> {
    classIndexer: string = '';
    relatedTasks: ArrayItemProvider<IRelatedWitTaskTableItem>;

    constructor(props: IDeliveryItemCardTableRowProps) {
        super(props);
        this.state = { isActivated: false };
        this.classIndexer = "table-row-" + props.item!.id!;
        this.relatedTasks = new ArrayItemProvider<IRelatedWitTaskTableItem>(props.item!.tasks!);
    }

    componentDidMount(): void {
        const domElement = document.getElementsByClassName(this.classIndexer)[0];
        if (!domElement)
            return;
        domElement.addEventListener('click', () => {
            this.setState({ isActivated: !this.state.isActivated });
        });
    }

    public render(): JSX.Element {
        return (
            <React.Fragment key={this.props.rowIndex}>
                <TableRow
                    className={"single-click-activation " + this.classIndexer}
                    details={this.props.rowDetails}
                    index={this.props.rowIndex}
                    linkProps={(this.props.item as any).linkProps}
                    children={renderColumns(this.props.rowIndex, sizableColumns, this.props.item, this.props.rowDetails)}
                />
                {this.state.isActivated &&
                    <tr>
                        <td colSpan={sizableColumns.length + 1}>
                            <Fade>
                                <Table<Partial<IRelatedWitTaskTableItem>>
                                    columns={sizableTasksColumns}
                                    itemProvider={this.relatedTasks}
                                />
                            </Fade>
                        </td>
                    </tr>
                }
            </React.Fragment>
        );
    }
}