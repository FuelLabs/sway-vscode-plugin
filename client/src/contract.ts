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

export class ContractProvider
  implements TreeDataProvider<Contract | ContractFunction>
{
  private _onDidChangeTreeData: EventEmitter<Contract | undefined | void> =
    new EventEmitter<Contract | undefined | void>();
  readonly onDidChangeTreeData: Event<Contract | undefined | void> =
    this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Contract): TreeItem {
    return element;
  }

  getChildren(
    contract?: Contract
  ): ProviderResult<Contract[] | ContractFunction[]> {
    if (!this.workspaceRoot) {
      window.showInformationMessage('No contract in empty workspace');
      return Promise.resolve([]);
    }

    return Promise.resolve(contract?.children ?? this.getContracts());
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
        let buffer = fs.readFileSync(`${abiDirectory}${filename}`);
        let abi: Object[] = JSON.parse(buffer.toString());
        const functions = abi
          .filter(obj => obj['type'] === 'function')
          .map(func => new ContractFunction(func['name']));
		const contractName = path.parse(filename).name;
        return new Contract(contractName, functions);
      });
  }
}

export class Contract extends TreeItem {
  constructor(
    public readonly label: string,
    readonly children: ContractFunction[]
  ) {
    super(
      label,
      children
        ? TreeItemCollapsibleState.Collapsed
        : TreeItemCollapsibleState.None
    );

    this.tooltip = this.label;
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
