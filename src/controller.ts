import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";
import { VaultContract } from "../generated/Controller/VaultContract";
import { ERC20Contract } from "../generated/Controller/ERC20Contract";
import { VaultFee } from "../generated/schema";
import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { extractErc20Values } from "./utils/tokens";
import { extractVaultValues } from "./utils/vaults";
import { Vault as VaultTemplate } from "../generated/templates";
import Token from "./models/Token";
import Protocol from "./models/Protocol";
import Vault from "./models/Vault";
import { getPricePerToken } from "./utils/prices";

export function handleAddVaultAndStrategy(call: AddVaultAndStrategyCall): void {
  let vaultAddress = call.inputs._vault;

  let vault = Vault.load(vaultAddress.toHexString());

  if (vault) return;

  let vaultContract = VaultContract.bind(vaultAddress);

  const vaultValues = extractVaultValues(vaultContract);

  if (!vaultValues) {
    log.debug("VaultCall Reverted block: {}, tx: {}", [
      call.block.number.toString(),
      call.transaction.hash.toHexString(),
    ]);
    return;
  }

  const underlying = vaultValues.underlying;

  const erc20Contract = ERC20Contract.bind(underlying);

  const erc20Values = extractErc20Values(erc20Contract);

  if (!erc20Values) {
    log.debug("Erc20Call Reverted block: {}, tx: {}", [
      call.block.number.toString(),
      call.transaction.hash.toHexString(),
    ]);
    return;
  }

  let inputToken = Token.findOrInitialize({
    id: underlying.toHexString(),
    name: erc20Values.name,
    symbol: erc20Values.symbol,
    decimals: erc20Values.decimals,
  });

  inputToken.lastPriceUSD = getPricePerToken(underlying);
  inputToken.lastPriceBlockNumber = call.block.number;

  inputToken.save();

  let outputToken = Token.findOrInitialize({
    id: vaultAddress.toHexString(),
    name: vaultValues.name,
    symbol: vaultValues.symbol,
    decimals: vaultValues.decimals,
  });
  outputToken.save();

  vault = Vault.build({
    address: vaultAddress,
    name: vaultValues.name,
    symbol: vaultValues.symbol,
    inputToken: underlying,
    outputToken: vaultAddress,
    depositLimit: BigInt.fromI32(0),
    createdTimestamp: call.block.timestamp,
    createdBlockNumber: call.block.number,
    totalValueLockedUSD: BigDecimal.fromString("0"),
    inputTokenBalance: BigInt.fromI32(0),
    protocol: "",
  });

  // TODO: Remove this placeholder after logic implementation
  const fee = new VaultFee("DEPOSIT_FEE-".concat(vaultAddress.toHexString()));
  fee.feePercentage = BigDecimal.fromString("1.5");
  fee.feeType = "DEPOSIT_FEE";
  fee.save();
  vault.fees = [fee.id];

  const protocol = Protocol.findOrInitialize({
    id: "0x222412af183bceadefd72e4cb1b71f1889953b1c",
    name: "Harvest Finance",
    slug: "harvest-finance",
    schemaVersion: "0.0.1",
    subgraphVersion: "0.0.1",
    methodologyVersion: "0.0.1",
    network: "MAINNET",
    type: "YIELD",
    totalValueLockedUSD: BigDecimal.fromString("0"),
    protocolControlledValueUSD: BigDecimal.fromString("0"),
    cumulativeSupplySideRevenueUSD: BigDecimal.fromString("0"),
    cumulativeProtocolSideRevenueUSD: BigDecimal.fromString("0"),
    cumulativeTotalRevenueUSD: BigDecimal.fromString("0"),
    cumulativeUniqueUsers: 0,
  });

  protocol.save();

  vault.protocol = protocol.id;

  vault.save();

  VaultTemplate.create(vaultAddress);
}
