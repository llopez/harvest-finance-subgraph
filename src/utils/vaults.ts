import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Vault } from "../../generated/schema";

export function initializeVault(
  address: Address,
  name: string,
  symbol: string,
  inToken: Address,
  outToken: Address,
  depositLimit: BigInt,
  createdTimestamp: BigInt,
  createdBlockNumber: BigInt,
  totalValueLockedUSD: BigDecimal,
  inputTokenBalance: BigInt
): Vault {
  const id = address.toHexString();

  const vault = new Vault(id);

  vault.name = name;
  vault.symbol = symbol;
  vault.inputToken = inToken.toHexString();
  vault.outputToken = outToken.toHexString();
  vault.depositLimit = depositLimit;
  vault.createdTimestamp = createdTimestamp;
  vault.createdBlockNumber = createdBlockNumber;
  vault.totalValueLockedUSD = totalValueLockedUSD;
  vault.inputTokenBalance = inputTokenBalance;

  return vault;
}

export function findOrInitializeVault(
  address: Address,
  name: string,
  symbol: string,
  inToken: Address,
  outToken: Address,
  depositLimit: BigInt,
  createdTimestamp: BigInt,
  createdBlockNumber: BigInt,
  totalValueLockedUSD: BigDecimal,
  inputTokenBalance: BigInt
): Vault {
  const id = address.toHexString();

  let vault = Vault.load(id);

  if (vault) return vault;

  return initializeVault(
    address,
    name,
    symbol,
    inToken,
    outToken,
    depositLimit,
    createdTimestamp,
    createdBlockNumber,
    totalValueLockedUSD,
    inputTokenBalance
  );
}
