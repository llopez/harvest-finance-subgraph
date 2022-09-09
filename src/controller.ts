import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";

import { VaultContract } from "../generated/Controller/VaultContract";
import { ERC20Contract } from "../generated/Controller/ERC20Contract";
import { Token, Vault } from "../generated/schema";

export function handleAddVaultAndStrategy(call: AddVaultAndStrategyCall): void {
  let vaultAddress = call.inputs._vault;

  let vaultContract = VaultContract.bind(vaultAddress);

  let vault = Vault.load(vaultAddress.toHexString());

  if (!vault) {
    vault = new Vault(vaultAddress.toHexString());
  }

  const underlying = vaultContract.try_underlying().value;

  const erc20Contract = ERC20Contract.bind(underlying);

  let inputToken = new Token(underlying.toHexString());
  inputToken.name = erc20Contract.try_name().value;
  inputToken.symbol = erc20Contract.try_symbol().value;
  inputToken.decimals = erc20Contract.try_decimals().value;
  inputToken.save();

  let outputToken = new Token(vaultAddress.toHexString());
  outputToken.name = vaultContract.try_name().value;
  outputToken.symbol = vaultContract.try_symbol().value;
  outputToken.decimals = vaultContract.try_decimals().value;
  outputToken.save();

  vault.inputToken = inputToken.id;
  vault.outputToken = outputToken.id;

  vault.name = vaultContract.try_name().value;
  vault.symbol = vaultContract.try_symbol().value;
  vault.save();
}
