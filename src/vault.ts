import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent,
} from "../generated/Controller/VaultContract";

import Vault from "./models/Vault";

import Deposit from "./models/Deposit";

export function handleWithdraw(event: WithdrawEvent): void {}

export function handleDeposit(event: DepositEvent): void {
  const amount = event.params.amount;
  const beneficiary = event.params.beneficiary;
  const vaultAddress = event.address;

  const vault = Vault.load(vaultAddress.toHexString());

  if (!vault) return;

  const deposit = Deposit.build({
    hash: event.transaction.hash,
    logIndex: event.logIndex,
    protocol: vault.protocol,
    to: beneficiary,
    from: event.transaction.from,
    blockNumber: event.block.number,
    timestamp: event.block.timestamp,
    asset: Address.fromString(vault.inputToken),
    amount: amount,
    amountUSD: BigDecimal.fromString("0"),
    vault: Address.fromString(vault.id),
  });

  deposit.save();

  vault.inputTokenBalance = vault.inputTokenBalance.plus(amount);
  vault.save();
}

function handleMint(event: TransferEvent): void {
  // const from = event.params.from;
  // const to = event.params.to;
  const amount = event.params.value;
  const vaultAddress = event.address;

  const vault = Vault.load(vaultAddress.toHexString());

  if (!vault) return;

  if (!vault.outputTokenSupply) {
    vault.outputTokenSupply = BigInt.fromI32(0);
  }

  vault.outputTokenSupply = vault.outputTokenSupply!.plus(amount);

  vault.save();
}

export function handleTransfer(event: TransferEvent): void {
  const from = event.params.from;

  if (from == Address.zero()) {
    handleMint(event);
    return;
  }
}
