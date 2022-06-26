import * as fs from 'fs';
import * as path from 'path';

// import * as fuels from 'typechain-target-fuels';

import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode';

interface ParsedAbi {
  name: string;
  functions: ContractFunction;
}

export class ContractProvider implements TreeDataProvider<ContractFunction | Contract>
{
  private _onDidChangeTreeData: EventEmitter<Contract | undefined | void> =
    new EventEmitter<Contract | undefined | void>();
  readonly onDidChangeTreeData: Event<Contract | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(
    contract?: ContractFunction | Contract
  ): ProviderResult<Contract[]> {
    if (!this.workspaceRoot) {
      window.showInformationMessage('No contract in empty workspace');
      return Promise.resolve([]);
    }

    return contract ? Promise.resolve(contract['children']) : this.getContracts();
  }

  /**
   * Reads contracts from the ABI.
   */
  private async getContracts(): Promise<Contract[]> {
    const abiDirectory = `${this.workspaceRoot}/out/debug/`;
    const abiFilePaths = await fs.promises.readdir(abiDirectory);
    return abiFilePaths
      .filter(filename => filename.endsWith('-abi.json'))
      .map(filename => {
		const filetpath = `${abiDirectory}${filename}`;
        let buffer = fs.readFileSync(filetpath);
        let abi: Object[] = JSON.parse(buffer.toString());
        const functions = abi
          .filter(obj => obj['type'] === 'function')
          .map(func => new ContractFunction(func['name']));
        return new Contract(filetpath, functions);
      });
  }
}

export class Contract extends TreeItem {
  constructor(
    public readonly filepath: string,
    readonly children: ContractFunction[]
  ) {
	const contractName = path.parse(filepath).name;
    super(
		contractName,
      children
        ? TreeItemCollapsibleState.Collapsed
        : TreeItemCollapsibleState.None
    );

	this.label = contractName;
    this.tooltip = contractName;
  }

  contextValue = 'contract';
}

export class ContractFunction extends TreeItem {
  constructor(public readonly label: string) {
    super(label, TreeItemCollapsibleState.None);

    this.tooltip = this.label;
  }

  contextValue = 'contractFunction';
}
