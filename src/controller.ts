import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";
import { ERC20Contract } from "../generated/Controller/ERC20Contract";
import { VaultFee } from "../generated/schema";
import { BigDecimal, log } from "@graphprotocol/graph-ts";
import { extractErc20Values, tokens } from "./utils/tokens";
import { vaults } from "./utils/vaults";
import { Vault as VaultTemplate } from "../generated/templates";
import Protocol from "./models/Protocol";
import { Vault } from "../generated/schema";
import { getPricePerToken } from "./utils/prices";

export function handleAddVaultAndStrategy(call: AddVaultAndStrategyCall): void {
  let vaultAddress = call.inputs._vault;

  let vault = Vault.load(vaultAddress.toHexString());

  if (vault) return;

  const vaultData = vaults.getData(vaultAddress);

  if (vaultData == null) {
    log.debug("VaultCall Reverted block: {}, tx: {}", [
      call.block.number.toString(),
      call.transaction.hash.toHexString(),
    ]);
    return;
  }

  const underlying = vaultData.underlying;

  const erc20Contract = ERC20Contract.bind(underlying);

  const erc20Values = extractErc20Values(erc20Contract);

  if (!erc20Values) {
    log.debug("Erc20Call Reverted block: {}, tx: {}", [
      call.block.number.toString(),
      call.transaction.hash.toHexString(),
    ]);
    return;
  }

  let inputToken = tokens.findOrInitialize(underlying);

  inputToken.name = erc20Values.name;
  inputToken.symbol = erc20Values.symbol;
  inputToken.decimals = erc20Values.decimals;
  inputToken.lastPriceUSD = getPricePerToken(underlying);
  inputToken.lastPriceBlockNumber = call.block.number;

  inputToken.save();

  let outputToken = tokens.findOrInitialize(vaultAddress);

  outputToken.name = vaultData.name;
  outputToken.symbol = vaultData.symbol;
  outputToken.decimals = vaultData.decimals;

  outputToken.save();

  vault = vaults.initialize(vaultAddress.toHexString());

  vault.name = vaultData.name;
  vault.symbol = vaultData.symbol;
  vault.inputToken = underlying.toHexString();
  vault.outputToken = vaultAddress.toHexString();
  vault.createdTimestamp = call.block.timestamp;
  vault.createdBlockNumber = call.block.number;

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
