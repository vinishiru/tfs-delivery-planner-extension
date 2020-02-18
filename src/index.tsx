import * as React from "react";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";


import { IAzureDevOpsService } from "./Interfaces/IAzureDevOpsService";
import { MoqAzureDevOpsService } from "./Services/MoqAzureDevOpsService";
import { DeliveryPanel } from "./Components/DeliveryPanel";
import { DeliveryItemCard } from "./Components/DeliveryItemCard";
import { showRootComponent } from "./Common"
import { IDeliveryItem } from "./Interfaces/IDeliveryItem";

export interface IDeliveryPlannerState {
    userDisplayName?: string;
    creatingNewDelivery: boolean
}

class DeliveryPlanner extends React.Component<{}, IDeliveryPlannerState> {

    sdkService: IAzureDevOpsService;
    allDeliveryItens: IDeliveryItem[];

    constructor(props: {}) {
        super(props);

        this.sdkService = SdkService;
        this.state = { creatingNewDelivery: false };
        this.allDeliveryItens = [];
        this.createNewDelivery = this.createNewDelivery.bind(this);
        this.handleDeliveryPanelDismiss = this.handleDeliveryPanelDismiss.bind(this);
        this.handleDeliveryPanelSave = this.handleDeliveryPanelSave.bind(this);
        this.handleDeliveryItemDelete = this.handleDeliveryItemDelete.bind(this);

    }

    public async componentDidMount() {
        this.sdkService.initialize();
        await this.sdkService.ready();

        this.allDeliveryItens = await this.sdkService.getAllDeliveryItens();
        this.setState({ userDisplayName: this.sdkService.getUserDisplayName() });
    }

    public render(): JSX.Element {
        const items = this.allDeliveryItens.map(item =>
            <DeliveryItemCard key={item.deliveryId} deliveryItem={item} onDelete={this.handleDeliveryItemDelete} />
        );
        return (
            <Page className="flex-grow rhythm-vertical-16">
                <Header title="Delivery Planner"
                    commandBarItems={this.getCommandBarItems()}
                    description="Descrição do componente."
                    titleSize={TitleSize.Large} />

                <TabBar
                    onSelectedTabChanged={this.createNewDelivery}
                    selectedTabId="entregasPlanejadas"
                    tabSize={TabSize.Compact}>

                    <Tab name="Entregas Planejadas" id="entregasPlanejadas" />
                </TabBar>

                {this.state.creatingNewDelivery && (
                    <DeliveryPanel onDismiss={this.handleDeliveryPanelDismiss} onSave={this.handleDeliveryPanelSave} />
                )}
                {this.hasItems() &&
                    <div className="flex-column flex-center padding-16 rhythm-vertical-16">
                        {items}
                    </div>
                }

                {!this.hasItems() &&
                    this.renderZeroData()
                }



            </Page >
        );
    }

    private hasItems(): boolean {
        return this.allDeliveryItens.length !== 0;
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
                    imagePath="../static/checklist.png"
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
        this.setState({ creatingNewDelivery: true });
    }

    private handleDeliveryPanelDismiss() {
        this.setState({ creatingNewDelivery: false });
    }

    private handleDeliveryPanelSave(deliveryItem: IDeliveryItem) {
        this.sdkService.saveDeliveryItem(deliveryItem);
        this.setState({ creatingNewDelivery: false });
    }

    private async handleDeliveryItemDelete(deliveryItem: IDeliveryItem) {
        this.sdkService.deleteDeliveryItem(deliveryItem);
        this.allDeliveryItens = await this.sdkService.getAllDeliveryItens();
        this.setState({});
    }

}

const SdkService = new MoqAzureDevOpsService();
export default SdkService;

showRootComponent(<DeliveryPlanner />);
