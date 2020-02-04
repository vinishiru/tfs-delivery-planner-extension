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

    }

    public async componentDidMount() {
        SDK.init();
        await SDK.ready();

        this.setState({ nomeUsuario: SDK.getUser().displayName });
    }

    public reender(): JSX.Element {
        return (
            <Page className="flex-grow">
                <Header title="Delivery Planner"
                    commandBarItems={this.getCommandBarItems()}
                    description="Descrição do componnente."
                    titleSize={TitleSize.Large} />

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
                            <span>Olá {this.state.nomeUsuario}!</span>
                            <span>
                                Planeje entregas, facilite o acompanhamento dos seus projetos e tenha uma <strong>estimativa</strong> de entrega!
                        </span>
                        </div>
                    }
                    imageAltText="Delivery Planner"
                    imagePath={""}
                    actionText="Nova Entrega"
                    actionType={ZeroDataActionType.ctaButton}
                    onActionClick={this.criarNovaEntrega}
                />
            </div>
        );
    }

    private getCommandBarItems(): IHeaderCommandBarItem[] {
        return [
            {
                id: "panel",
                text: "Panel",
                onActivate: () => { this.criarNovaEntrega() },
                iconProps: {
                    iconName: 'Add'
                },
                isPrimary: true,
                tooltipProps: {
                    text: "Planejar nova entrega."
                }
            }
        ];
    }

    private criarNovaEntrega() {
        alert('Ops! Ainda em construção!');
    }

}

showRootComponent(<DeliveryPlanner />);