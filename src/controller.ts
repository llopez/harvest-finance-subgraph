import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";

import { VaultContract } from "../generated/Controller/VaultContract";

import { Vault } from "../generated/schema";

export function handleAddVaultAndStrategy(call: AddVaultAndStrategyCall): void {
  let vaultAddress = call.inputs._vault;

  let vaultContract = VaultContract.bind(vaultAddress);

  const name = vaultContract.try_name().value;
  const symbol = vaultContract.try_symbol().value;

  let vault = new Vault(vaultAddress.toHexString());
  vault.name = name;
  vault.symbol = symbol;
  vault.save();
}
