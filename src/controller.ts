import {
  AddVaultAndStrategyCall,
  ControllerContract,
  SetFeeRewardForwarderCall,
} from "../generated/Controller/ControllerContract";
import { FeeRewardForwarderContract } from "../generated/Controller/FeeRewardForwarderContract";
import { VaultContract } from "../generated/Controller/VaultContract";
import { ERC20Contract } from "../generated/Controller/ERC20Contract";
import { Global, VaultFee } from "../generated/schema";
import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { extractErc20Values } from "./utils/tokens";
import { extractVaultValues } from "./utils/vaults";
import { Vault as VaultTemplate } from "../generated/templates";
import Token from "./models/Token";
import Protocol from "./models/Protocol";
import Vault from "./models/Vault";
import RewardToken from "./models/RewardToken";

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

  // rewardTokens

  let global = Global.load("current");

  if (!global) {
    global = new Global("current");
  }

  // enters just the first time
  // we just create the RewardToken for first time
  // we will handle the update on another contract call (setFeeRewardForwarder)

  if (!global.controllerFeeRewardForwarder) {
    const controllerContract = ControllerContract.bind(
      Address.fromString("0x222412af183bceadefd72e4cb1b71f1889953b1c")
    );

    const call = controllerContract.try_feeRewardForwarder();

    if (!call.reverted) {
      const feeRewardForwarder = call.value;
      global.controllerFeeRewardForwarder = feeRewardForwarder.toHexString();
      global.save();

      const feeRewardForwarderContract = FeeRewardForwarderContract.bind(
        feeRewardForwarder
      );

      const farmCall = feeRewardForwarderContract.try_farm();

      if (!farmCall.reverted) {
        const farm = farmCall.value;

        global.feeRewardForwarderFarm = farm.toHexString();
        global.save();

        RewardToken.create({
          address: farm,
          type: "DEPOSIT",
          token: farm.toHexString(),
        });

        const token = Token.fromAddress(farm);
        if (token) token.save();
      }
    }
  }

  // rewardTokens

  if (global.feeRewardForwarderFarm) {
    const rewardTokenId = RewardToken.generateId(
      "DEPOSIT",
      Address.fromString(global.feeRewardForwarderFarm as string)
    );
    vault.rewardTokens = [rewardTokenId];
  }

  vault.save();

  VaultTemplate.create(vaultAddress);
}

export function handleSetFeeRewardForwarder(
  call: SetFeeRewardForwarderCall
): void {
  const feeRewardForwarder = call.inputs._feeRewardForwarder;

  let global = Global.load("current");

  if (!global) {
    global = new Global("current");
  }

  if (global.controllerFeeRewardForwarder == feeRewardForwarder.toHexString())
    return;

  const feeRewardForwarderContract = FeeRewardForwarderContract.bind(
    feeRewardForwarder
  );

  const farmCall = feeRewardForwarderContract.try_farm();

  if (farmCall.reverted) return;

  const farm = farmCall.value;

  global.feeRewardForwarderFarm = farm.toHexString();
  global.save();

  const rewardTokenId = RewardToken.generateId("DEPOSIT", farm);

  let rewardToken = RewardToken.load(rewardTokenId);

  if (rewardToken) return;

  RewardToken.create({
    address: farm,
    type: "DEPOSIT",
    token: farm.toHexString(),
  });

  const token = Token.fromAddress(farm);
  if (token) token.save();
}
