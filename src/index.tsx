import * as React from "react";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { IFilter, Filter, FILTER_CHANGE_EVENT, IFilterState } from "azure-devops-ui/Utilities/Filter";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";

import { IAzureDevOpsService } from "./Interfaces/IAzureDevOpsService";
import { MoqAzureDevOpsService } from "./Services/MoqAzureDevOpsService";
import { DeliveryPanel } from "./Components/DeliveryPanel";
import { DeliveryItemCard } from "./Components/DeliveryItemCard";
import { showRootComponent } from "./Common"
import { IDeliveryItem } from "./Interfaces/IDeliveryItem";
import { AzureDevOpsSdkService } from "./Services/AzureDevOpsSdkService";

export interface IDeliveryPlannerState {
    userDisplayName?: string;
    creatingOrEditingDelivery: boolean;
    editingDeliveryId?: string;
    activeFilter?: string

    allDeliveryItens: IDeliveryItem[];
}

class DeliveryPlanner extends React.Component<{}, IDeliveryPlannerState> {

    FILTRO_KEY: string = "keyword";
    sdkService: IAzureDevOpsService;
    filter: IFilter;

    constructor(props: {}) {
        super(props);

        this.sdkService = SdkService;
        this.state = { creatingOrEditingDelivery: false, allDeliveryItens: [] };
        this.filter = new Filter();

        this.createNewDelivery = this.createNewDelivery.bind(this);
        this.handleDeliveryPanelDismiss = this.handleDeliveryPanelDismiss.bind(this);
        this.handleDeliveryPanelSave = this.handleDeliveryPanelSave.bind(this);
        this.handleDeliveryItemDelete = this.handleDeliveryItemDelete.bind(this);
        this.handleDeliveryItemEdit = this.handleDeliveryItemEdit.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);

        this.filter.subscribe(this.handleFilterChange, FILTER_CHANGE_EVENT);
    }

    public async componentDidMount() {
        this.sdkService.initialize();
        await this.sdkService.ready();

        const deliveryItens = await this.sdkService.getDeliveryItens();
        this.setState({ userDisplayName: this.sdkService.getUserDisplayName(), allDeliveryItens: deliveryItens });
    }

    public render(): JSX.Element {
        const deliveryItemCards = this.state.allDeliveryItens.map(item =>
            <DeliveryItemCard key={item.id} deliveryItem={item} onDelete={this.handleDeliveryItemDelete} onEdit={this.handleDeliveryItemEdit} />
        );
        return (
            <Page className="flex-grow rhythm-vertical-16">
                <Header title="Delivery Planner"
                    commandBarItems={this.getCommandBarItems()}
                    description="Planeje entregas, facilite o acompanhamento dos seus projetos."
                    titleSize={TitleSize.Large} />

                <FilterBar
                    filter={this.filter}>
                    <KeywordFilterBarItem placeholder={"Filtrar"}
                        filterItemKey={this.FILTRO_KEY} />
                </FilterBar>

                <TabBar
                    onSelectedTabChanged={() => { }}
                    selectedTabId="entregasPlanejadas"
                    tabSize={TabSize.Compact}>
                    <Tab name="Entregas Planejadas" id="entregasPlanejadas" />
                    <Tab name="Entregas Concluídas" id="entregasConcluidas" />
                </TabBar>

                {(this.state.creatingOrEditingDelivery) && (
                    <DeliveryPanel deliveryId={this.state.editingDeliveryId} onDismiss={this.handleDeliveryPanelDismiss} onSave={this.handleDeliveryPanelSave} />
                )}
                {this.hasItems() &&
                    <div className="padding-16 rhythm-vertical-16">
                        {deliveryItemCards}
                    </div>
                }

                {!this.hasItems() &&
                    this.renderZeroData()
                }
            </Page >
        );
    }

    private hasItems(): boolean {
        return this.state.allDeliveryItens.length !== 0;
    }

    private renderZeroData(): JSX.Element {
        return (
            <div>
                <ZeroData
                    primaryText="Delivery Planner"
                    secondaryText={
                        <div>
                            <p>Olá {this.state.userDisplayName}!</p>
                            <p>
                                Planeje entregas, facilite o acompanhamento dos seus projetos e tenha uma <strong>estimativa</strong> de entrega!
                        </p>
                        </div>
                    }
                    imageAltText="Delivery Planner"
                    imagePath={require("./static/checklist.png")}
                    actionText="Criar Entrega"
                    actionType={ZeroDataActionType.ctaButton}
                    onActionClick={this.createNewDelivery}
                />
            </div>
        );
    }

    private getCommandBarItems(): IHeaderCommandBarItem[] {
        return [
            {
                id: "criarEntrega",
                text: "Criar Entrega",
                onActivate: () => { this.createNewDelivery() },
                iconProps: {
                    iconName: 'Add'
                },
                isPrimary: true,
                tooltipProps: {
                    text: "Criar nova entrega."
                }
            }
        ];
    }

    private createNewDelivery() {
        this.setState({ creatingOrEditingDelivery: true, editingDeliveryId: undefined });
    }

    private async handleFilterChange(changedState: IFilterState) {
        const filter = this.filter.getFilterItemValue(this.FILTRO_KEY) as string;
        const deliveryItens = await this.sdkService.getDeliveryItens(filter)
        this.setState({ allDeliveryItens: deliveryItens, activeFilter: filter });
    }

    private handleDeliveryPanelDismiss() {
        this.setState({ creatingOrEditingDelivery: false, editingDeliveryId: undefined });
    }

    private async handleDeliveryPanelSave(deliveryItem: IDeliveryItem) {
        await this.sdkService.saveDeliveryItem(deliveryItem);
        const deliveryItens = await this.sdkService.getDeliveryItens(this.state.activeFilter)
        this.setState({ allDeliveryItens: deliveryItens, creatingOrEditingDelivery: false, editingDeliveryId: undefined });
    }

    private async handleDeliveryItemDelete(deliveryItem: IDeliveryItem) {
        await this.sdkService.deleteDeliveryItem(deliveryItem);
        const deliveryItens = await this.sdkService.getDeliveryItens(this.state.activeFilter)
        this.setState({ allDeliveryItens: deliveryItens });
    }

    private handleDeliveryItemEdit(id: string) {
        this.setState({ creatingOrEditingDelivery: true, editingDeliveryId: id });
    }

}

const SdkService = new AzureDevOpsSdkService();
export default SdkService;

showRootComponent(<DeliveryPlanner />);
