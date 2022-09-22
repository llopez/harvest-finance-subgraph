import { newMockEvent, assert } from "matchstick-as";
import {
  Deposit as DepositEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent,
} from "../generated/Controller/VaultContract";
import {
  BigInt,
  Address,
  ethereum,
  Bytes,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export function createWithdrawEvent(
  amount: BigInt,
  beneficiary: Address
): WithdrawEvent {
  let mockEvent = newMockEvent();

  let event = new WithdrawEvent(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    null
  );

  event.parameters = [
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    ),
    new ethereum.EventParam(
      "amount",
      ethereum.Value.fromUnsignedBigInt(amount)
    ),
  ];

  return event;
}

export function createDepositEvent(
  amount: BigInt,
  beneficiary: Address
): DepositEvent {
  let mockEvent = newMockEvent();

  let event = new DepositEvent(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    null
  );

  event.parameters = [
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    ),
    new ethereum.EventParam(
      "amount",
      ethereum.Value.fromUnsignedBigInt(amount)
    ),
  ];

  return event;
}

export function createTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt
): TransferEvent {
  let mockEvent = newMockEvent();

  let event = new TransferEvent(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    null
  );

  event.parameters = [
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from)),
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to)),
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(amount)),
  ];

  return event;
}

class AssertEventAttributes {
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

export function assertDeposit(
  id: string,
  attributes: AssertEventAttributes
): void {
  assert.fieldEquals("Deposit", id, "hash", attributes.hash.toHexString());

  assert.fieldEquals("Deposit", id, "to", attributes.to.toHexString());

  assert.fieldEquals("Deposit", id, "from", attributes.from.toHexString());

  assert.fieldEquals("Deposit", id, "asset", attributes.asset.toHexString());

  assert.fieldEquals("Deposit", id, "amount", attributes.amount.toString());

  assert.fieldEquals("Deposit", id, "vault", attributes.vault.toHexString());

  assert.fieldEquals("Deposit", id, "logIndex", attributes.logIndex.toString());

  assert.fieldEquals("Deposit", id, "protocol", attributes.protocol);

  assert.fieldEquals(
    "Deposit",
    id,
    "blockNumber",
    attributes.blockNumber.toString()
  );

  assert.fieldEquals(
    "Deposit",
    id,
    "timestamp",
    attributes.timestamp.toString()
  );

  assert.fieldEquals(
    "Deposit",
    id,
    "amountUSD",
    attributes.amountUSD.toString()
  );
}

export function assertWithdraw(
  id: string,
  attributes: AssertEventAttributes
): void {
  assert.fieldEquals("Withdraw", id, "hash", attributes.hash.toHexString());

  assert.fieldEquals("Withdraw", id, "to", attributes.to.toHexString());

  assert.fieldEquals("Withdraw", id, "from", attributes.from.toHexString());

  assert.fieldEquals("Withdraw", id, "asset", attributes.asset.toHexString());

  assert.fieldEquals("Withdraw", id, "amount", attributes.amount.toString());

  assert.fieldEquals("Withdraw", id, "vault", attributes.vault.toHexString());

  assert.fieldEquals(
    "Withdraw",
    id,
    "logIndex",
    attributes.logIndex.toString()
  );

  assert.fieldEquals("Withdraw", id, "protocol", attributes.protocol);

  assert.fieldEquals(
    "Withdraw",
    id,
    "blockNumber",
    attributes.blockNumber.toString()
  );

  assert.fieldEquals(
    "Withdraw",
    id,
    "timestamp",
    attributes.timestamp.toString()
  );

  assert.fieldEquals(
    "Withdraw",
    id,
    "amountUSD",
    attributes.amountUSD.toString()
  );
}
