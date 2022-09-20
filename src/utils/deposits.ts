import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Deposit } from "../../generated/schema";
import { Deposit as DepositEvent } from "../../generated/Controller/VaultContract";

class DepositAttributes {
  id: string;
  hash: Bytes;
  logIndex: BigInt;
  protocol: string;
  to: Address;
  from: Address;
  blockNumber: BigInt;
  timestamp: BigInt;
  asset: Address;
  amount: BigInt;
  amountUSD: BigDecimal;
  vault: Address;
}

export function generateDepositId(event: DepositEvent): string {
  return event.transaction.hash.toHexString().concat(event.logIndex.toString());
}

export function initializeDeposit(attributes: DepositAttributes): Deposit {
  const deposit = new Deposit(attributes.id);
  deposit.hash = attributes.hash.toHexString();
  deposit.logIndex = attributes.logIndex.toI32();
  deposit.protocol = attributes.protocol;
  deposit.to = attributes.to.toHexString();
  deposit.from = attributes.from.toHexString();
  deposit.blockNumber = attributes.blockNumber;
  deposit.timestamp = attributes.timestamp;
  deposit.asset = attributes.asset.toHexString();
  deposit.amount = attributes.amount;
  deposit.amountUSD = attributes.amountUSD;
  deposit.vault = attributes.vault.toHexString();

  return deposit;
}

export function findOrInitializeDeposit(
  attributes: DepositAttributes
): Deposit {
  const deposit = Deposit.load(attributes.id);

  if (deposit) return deposit;

  return initializeDeposit(attributes);
}
