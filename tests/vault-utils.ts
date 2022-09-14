import { newMockEvent } from "matchstick-as";
import {
  Deposit as DepositEvent,
  Transfer as TransferEvent,
} from "../generated/Controller/VaultContract";
import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts";

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
