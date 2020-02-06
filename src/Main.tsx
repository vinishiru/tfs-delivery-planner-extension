import * as React from "react";
import * as SDK from 'azure-devops-extension-sdk'

import { Header, TitleSize } from "azure-devops-ui/Header";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { ZeroData, ZeroDataActionType } from "azure-devops-ui/ZeroData";

import { showRootComponent } from "./Common"

export interface IDeliveryPlannerState {
    nomeUsuario?: string;
}

class DeliveryPlanner extends React.Component<{}, IDeliveryPlannerState> {

    constructor(props: {}) {
        super(props);

        this.state = {};
    }

    public async componentDidMount() {
        SDK.init();
        await SDK.ready();

        this.setState({ nomeUsuario: SDK.getUser().displayName });
    }

    public render(): JSX.Element {
        return (
            <Page className="flex-grow">
                <Header title="Delivery Planner"
                    commandBarItems={this.getCommandBarItems()}
                    description="Descrição do componente."
                    titleSize={TitleSize.Large} />

                <TabBar
                    onSelectedTabChanged={this.criarNovaEntrega}
                    selectedTabId="entregasPlanejadas"
                    tabSize={TabSize.Compact}>

                    <Tab name="Entregas Planejadas" id="entregasPlanejadas" />
                </TabBar>

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
                            <p>Olá {this.state.nomeUsuario}!</p>
                            <p>
                                Planeje entregas, facilite o acompanhamento dos seus projetos e tenha uma <strong>estimativa</strong> de entrega!
                        </p>
                        </div>
                    }
                    imageAltText="Delivery Planner"
                    imagePath="../static/checklist.png"
                    actionText="Criar Entrega"
                    actionType={ZeroDataActionType.ctaButton}
                    onActionClick={this.criarNovaEntrega}
                />
            </div>
        );
    }

    private getCommandBarItems(): IHeaderCommandBarItem[] {
        return [
            {
                id: "criarEntrega",
                text: "Criar Entrega",
                onActivate: () => { this.criarNovaEntrega() },
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

    private criarNovaEntrega() {
        alert('Ops! Ainda em construção!');
    }

}

showRootComponent(<DeliveryPlanner />);