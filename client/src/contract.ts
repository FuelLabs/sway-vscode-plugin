// import * as fs from 'fs';
// import * as path from 'path';
import { Event, EventEmitter, ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window } from 'vscode';

export class ContractProvider implements TreeDataProvider<Contract | ContractFunction> {

	private _onDidChangeTreeData: EventEmitter<Contract | undefined | void> = new EventEmitter<Contract | undefined | void>();
	readonly onDidChangeTreeData: Event<Contract | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Contract): TreeItem {
		return element;
	}

	getChildren(contract?: Contract): ProviderResult<Contract[] | ContractFunction[]> {
		if (!this.workspaceRoot) {
			window.showInformationMessage('No contract in empty workspace');
			return Promise.resolve([]);
		}

        return Promise.resolve(contract?.children ?? this.getContracts())
    }

	/**
	 * Read all contracts from the ABI.
	 */
	private getContracts(): Contract[] {
        const function1 = new ContractFunction('function 1');
		const contracts = ['contract name 1', 'contract name 2'].map(name => new Contract(name, [function1]));
		return contracts;
	}
}

export class Contract extends TreeItem {
	constructor(
		public readonly label: string,
        readonly children: ContractFunction[],
	) {
        super(
            label,
            children ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None);
    
		this.tooltip = this.label;
	}

	contextValue = 'contract';
}

export class ContractFunction extends TreeItem {
	constructor(
		public readonly label: string,
	) {
		super(label, TreeItemCollapsibleState.None);

		this.tooltip = this.label;
	}

	contextValue = 'contractFunction';
}
