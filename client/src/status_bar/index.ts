import { StatusBarItem } from "vscode";
import { Config } from "../config";
import { getFuelCoreStatus } from "./fuelCoreStatus";
  
export class StatusBarItems {
    constructor(readonly config: Config) {}
  
    get(): StatusBarItem[] {
      return [getFuelCoreStatus()];
    }
}
  