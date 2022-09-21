import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { VaultContract } from "../../generated/Controller/VaultContract";
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

class VaultValue {
  underlying: Address;
  name: string;
  symbol: string;
  decimals: i32;

  constructor(underlying: Address, name: string, symbol: string, decimal: i32) {
    this.underlying = underlying;
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimal;
  }
}

export function extractVaultValues(contract: VaultContract): VaultValue | null {
  const underlyingCall = contract.try_underlying();
  const nameCall = contract.try_name();
  const symbolCall = contract.try_symbol();
  const decimalsCall = contract.try_decimals();

  if (underlyingCall.reverted) return null;
  if (nameCall.reverted) return null;
  if (symbolCall.reverted) return null;
  if (decimalsCall.reverted) return null;

  return new VaultValue(
    underlyingCall.value,
    nameCall.value,
    symbolCall.value,
    decimalsCall.value
  );
}
