import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Vault } from "../../generated/schema";

class VaultAttributes {
  address: Address;
  name: string;
  symbol: string;
  inputToken: Address;
  outputToken: Address;
  depositLimit: BigInt;
  createdTimestamp: BigInt;
  createdBlockNumber: BigInt;
  totalValueLockedUSD: BigDecimal;
  inputTokenBalance: BigInt;
  protocol: string;
}

export function initializeVault(attributes: VaultAttributes): Vault {
  const id = attributes.address.toHexString();

  const vault = new Vault(id);

  vault.name = attributes.name;
  vault.symbol = attributes.symbol;
  vault.inputToken = attributes.inputToken.toHexString();
  vault.outputToken = attributes.outputToken.toHexString();
  vault.depositLimit = attributes.depositLimit;
  vault.createdTimestamp = attributes.createdTimestamp;
  vault.createdBlockNumber = attributes.createdBlockNumber;
  vault.totalValueLockedUSD = attributes.totalValueLockedUSD;
  vault.inputTokenBalance = attributes.inputTokenBalance;
  vault.protocol = attributes.protocol;

  return vault;
}

export function findOrInitializeVault(attributes: VaultAttributes): Vault {
  const id = attributes.address.toHexString();

  let vault = Vault.load(id);

  if (vault) return vault;

  return initializeVault(attributes);
}
