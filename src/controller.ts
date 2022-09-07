import { AddVaultAndStrategyCall } from "../generated/Controller/Controller";
import { Vault } from "../generated/schema";

export function handleAddVaultAndStrategy(call: AddVaultAndStrategyCall): void {
  let vaultAddress = call.inputs._vault;
  // let strategyAddress = call.inputs._strategy;

  let vault = new Vault(vaultAddress.toHexString());
  vault.save();
}
