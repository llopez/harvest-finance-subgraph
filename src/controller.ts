import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";
import { VaultContract } from "../generated/Controller/VaultContract";
import { ERC20Contract } from "../generated/Controller/ERC20Contract";
import { Vault, VaultFee } from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { findOrInitializeToken } from "./utils/tokens";

export function handleAddVaultAndStrategy(call: AddVaultAndStrategyCall): void {
  let vaultAddress = call.inputs._vault;

  let vaultContract = VaultContract.bind(vaultAddress);

  let vault = Vault.load(vaultAddress.toHexString());

  if (vault) return;

  vault = new Vault(vaultAddress.toHexString());

  const underlying = vaultContract.try_underlying().value;
  const erc20Contract = ERC20Contract.bind(underlying);

  let inputToken = findOrInitializeToken(
    underlying,
    erc20Contract.try_name().value,
    erc20Contract.try_symbol().value,
    erc20Contract.try_decimals().value
  );
  inputToken.save();

  let outputToken = findOrInitializeToken(
    vaultAddress,
    vaultContract.try_name().value,
    vaultContract.try_symbol().value,
    vaultContract.try_decimals().value
  );
  outputToken.save();

  vault.inputToken = inputToken.id;
  vault.outputToken = outputToken.id;

  vault.depositLimit = BigInt.fromI32(0);

  // TODO: Remove this placeholder after logic implementation
  const fee = new VaultFee("DEPOSIT_FEE-".concat(vaultAddress.toHexString()));
  fee.feePercentage = BigDecimal.fromString("1.5");
  fee.feeType = "DEPOSIT_FEE";
  fee.save();
  vault.fees = [fee.id];

  vault.name = vault.name = vaultContract.try_name().value;
  vault.symbol = vaultContract.try_symbol().value;
  vault.createdTimestamp = call.block.timestamp;
  vault.createdBlockNumber = call.block.number;
  vault.totalValueLockedUSD = BigDecimal.fromString("0");
  vault.inputTokenBalance = BigInt.fromI32(0);

  vault.save();
}
