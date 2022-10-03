import { Address, ethereum } from "@graphprotocol/graph-ts";
import {
    VaultDailySnapshot,
    VaultHourlySnapshot
  } from "../../generated/schema";

import * as constants from "./constants";
import Vault from "../models/Vault";

export function getOrCreateVaultsDailySnapshots(
    vaultId: string,
    block: ethereum.Block
  ): VaultDailySnapshot {
    let id: string = vaultId
      .concat("-")
      .concat((block.timestamp.toI64() / constants.SECONDS_PER_DAY).toString());
    let vaultSnapshots = VaultDailySnapshot.load(id);
  
    if (!vaultSnapshots) {
      vaultSnapshots = new VaultDailySnapshot(id);
      vaultSnapshots.protocol = constants.PROTOCOL_ID;
      vaultSnapshots.vault = vaultId;
  
      vaultSnapshots.totalValueLockedUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.inputTokenBalance = constants.BIGINT_ZERO;
      vaultSnapshots.outputTokenSupply = constants.BIGINT_ZERO;
      vaultSnapshots.outputTokenPriceUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.pricePerShare = constants.BIGDECIMAL_ZERO;
  
      /* Version: 1.3.0
      vaultSnapshots.dailySupplySideRevenueUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.cumulativeSupplySideRevenueUSD = constants.BIGDECIMAL_ZERO;
  
      vaultSnapshots.dailyProtocolSideRevenueUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.cumulativeProtocolSideRevenueUSD = constants.BIGDECIMAL_ZERO;
  
      vaultSnapshots.dailyTotalRevenueUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.cumulativeTotalRevenueUSD = constants.BIGDECIMAL_ZERO;
      */
    
      vaultSnapshots.blockNumber = block.number;
      vaultSnapshots.timestamp = block.timestamp;
  
      vaultSnapshots.save();
    }
  
    return vaultSnapshots;
  }
  
  export function getOrCreateVaultsHourlySnapshots(
    vaultId: string,
    block: ethereum.Block
  ): VaultHourlySnapshot {
    let id: string = vaultId
      .concat("-")
      .concat((block.timestamp.toI64() / constants.SECONDS_PER_HOUR).toString());
    let vaultSnapshots = VaultHourlySnapshot.load(id);
  
    if (!vaultSnapshots) {
      vaultSnapshots = new VaultHourlySnapshot(id);
      vaultSnapshots.protocol = constants.PROTOCOL_ID;
      vaultSnapshots.vault = vaultId;
  
      vaultSnapshots.totalValueLockedUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.inputTokenBalance = constants.BIGINT_ZERO;
      vaultSnapshots.outputTokenSupply = constants.BIGINT_ZERO;
      vaultSnapshots.outputTokenPriceUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.pricePerShare = constants.BIGDECIMAL_ZERO;
        
      /* Version: 1.3.0
      vaultSnapshots.hourlySupplySideRevenueUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.cumulativeSupplySideRevenueUSD = constants.BIGDECIMAL_ZERO;
  
      vaultSnapshots.hourlyProtocolSideRevenueUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.cumulativeProtocolSideRevenueUSD = constants.BIGDECIMAL_ZERO;
  
      vaultSnapshots.hourlyTotalRevenueUSD = constants.BIGDECIMAL_ZERO;
      vaultSnapshots.cumulativeTotalRevenueUSD = constants.BIGDECIMAL_ZERO;
      */
  
      vaultSnapshots.blockNumber = block.number;
      vaultSnapshots.timestamp = block.timestamp;
  
      vaultSnapshots.save();
    }
  
    return vaultSnapshots;
  }

export function updateVaultSnapshots(
    vaultAddress: Address,
    block: ethereum.Block
  ): void {
    let vault = Vault.load(vaultAddress.toHexString());
    if (!vault) return;
  
    const vaultDailySnapshots = getOrCreateVaultsDailySnapshots(
      vaultAddress.toHexString(),
      block
    );
    const vaultHourlySnapshots = getOrCreateVaultsHourlySnapshots(
      vaultAddress.toHexString(),
      block
    );
  
    vaultDailySnapshots.totalValueLockedUSD = vault.totalValueLockedUSD;
    vaultHourlySnapshots.totalValueLockedUSD = vault.totalValueLockedUSD;
  
    vaultDailySnapshots.inputTokenBalance = vault.inputTokenBalance;
    vaultHourlySnapshots.inputTokenBalance = vault.inputTokenBalance;
  
    vaultDailySnapshots.outputTokenSupply = vault.outputTokenSupply!;
    vaultHourlySnapshots.outputTokenSupply = vault.outputTokenSupply!;
  
    vaultDailySnapshots.outputTokenPriceUSD = vault.outputTokenPriceUSD;
    vaultHourlySnapshots.outputTokenPriceUSD = vault.outputTokenPriceUSD;
  
    vaultDailySnapshots.pricePerShare = vault.pricePerShare;
    vaultHourlySnapshots.pricePerShare = vault.pricePerShare;
  
    vaultDailySnapshots.rewardTokenEmissionsAmount = vault.rewardTokenEmissionsAmount;
    vaultHourlySnapshots.rewardTokenEmissionsAmount = vault.rewardTokenEmissionsAmount;
  
    vaultDailySnapshots.rewardTokenEmissionsUSD = vault.rewardTokenEmissionsUSD;
    vaultHourlySnapshots.rewardTokenEmissionsUSD = vault.rewardTokenEmissionsUSD;
  
    /* Version: 1.3.0
    vaultDailySnapshots.cumulativeProtocolSideRevenueUSD =
      vault.cumulativeProtocolSideRevenueUSD;
    vaultHourlySnapshots.cumulativeProtocolSideRevenueUSD =
      vault.cumulativeProtocolSideRevenueUSD;
  
    vaultDailySnapshots.cumulativeSupplySideRevenueUSD =
      vault.cumulativeSupplySideRevenueUSD;
    vaultHourlySnapshots.cumulativeSupplySideRevenueUSD =
      vault.cumulativeSupplySideRevenueUSD;
  
    vaultDailySnapshots.cumulativeTotalRevenueUSD =
      vault.cumulativeTotalRevenueUSD;
    vaultHourlySnapshots.cumulativeTotalRevenueUSD =
      vault.cumulativeTotalRevenueUSD;
  
    */
   
    vaultDailySnapshots.blockNumber = block.number;
    vaultHourlySnapshots.blockNumber = block.number;
  
    vaultDailySnapshots.timestamp = block.timestamp;
    vaultHourlySnapshots.timestamp = block.timestamp;
  
    vaultDailySnapshots.save();
    vaultHourlySnapshots.save();
  }