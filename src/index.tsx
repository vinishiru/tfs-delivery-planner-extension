import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";
import { IAzureDevOpsService } from "./Interfaces/IAzureDevOpsService";
import { MoqAzureDevOpsService } from "./Services/MoqAzureDevOpsService";

import { DeliveryPanel } from "./Components/DeliveryPanel";

import { showRootComponent } from "./Common"

export interface IDeliveryPlannerState {
    sdkService?: IAzureDevOpsService
    userDisplayName?: string;
    creatingNewDelivery: boolean
}

export interface IDeliveryPlannerProps {
    sdkService: IAzureDevOpsService
}

class DeliveryPlanner extends React.Component<IDeliveryPlannerProps, IDeliveryPlannerState> {

    sdkService: IAzureDevOpsService;

    constructor(props: IDeliveryPlannerProps) {
        super(props);

        this.sdkService = props.sdkService;
        this.state = { creatingNewDelivery: false };

        this.createNewDelivery = this.createNewDelivery.bind(this);
        this.handleDeliveryPanelDismiss = this.handleDeliveryPanelDismiss.bind(this);
    }

    public async componentDidMount() {
        this.sdkService.initialize();
        await this.sdkService.ready();

        this.setState({ userDisplayName: this.sdkService.getUserDisplayName() });
    }

    public render(): JSX.Element {
        return (
            <Page className="flex-grow">
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
                    <DeliveryPanel onDismiss={this.handleDeliveryPanelDismiss} />
                )}

                {this.getPageContent()}
            </Page>
        );
    }

    public getPageContent() {
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

}

let sdkService = new MoqAzureDevOpsService();

showRootComponent(<DeliveryPlanner sdkService={sdkService} />);
