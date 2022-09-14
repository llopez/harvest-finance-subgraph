import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";
import { VaultContract } from "../generated/Controller/VaultContract";
import { ERC20Contract } from "../generated/Controller/ERC20Contract";
import { Vault, VaultFee } from "../generated/schema";
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { findOrInitializeToken } from "./utils/tokens";
import { initializeVault } from "./utils/vaults";
import { findOrInitializeProtocol } from "./utils/protocols";

export function handleAddVaultAndStrategy(call: AddVaultAndStrategyCall): void {
  let vaultAddress = call.inputs._vault;

  let vaultContract = VaultContract.bind(vaultAddress);

  let vault = Vault.load(vaultAddress.toHexString());

  if (vault) return;
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

  vault = initializeVault(
    vaultAddress,
    vaultContract.try_name().value,
    vaultContract.try_symbol().value,
    underlying,
    vaultAddress,
    BigInt.fromI32(0),
    call.block.timestamp,
    call.block.number,
    BigDecimal.fromString("0"),
    BigInt.fromI32(0),
    ""
  );

  // TODO: Remove this placeholder after logic implementation
  const fee = new VaultFee("DEPOSIT_FEE-".concat(vaultAddress.toHexString()));
  fee.feePercentage = BigDecimal.fromString("1.5");
  fee.feeType = "DEPOSIT_FEE";
  fee.save();
  vault.fees = [fee.id];

  const protocol = findOrInitializeProtocol(
    Address.fromString("0x222412af183bceadefd72e4cb1b71f1889953b1c"),
    "Harvest Finance",
    "harvest-finance",
    "0.0.1",
    "0.0.1",
    "0.0.1",
    "MAINNET",
    "YIELD",
    BigDecimal.fromString("0"),
    BigDecimal.fromString("0"),
    BigDecimal.fromString("0"),
    BigDecimal.fromString("0"),
    BigDecimal.fromString("0"),
    0
  );

  protocol.save();

  vault.protocol = protocol.id;

  vault.save();
}
