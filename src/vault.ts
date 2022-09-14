import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Deposit as DepositEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent,
} from "../generated/Controller/VaultContract";
import { Vault } from "../generated/schema";

export function handleWithdraw(event: WithdrawEvent): void {}

export function handleDeposit(event: DepositEvent): void {
  const amount = event.params.amount;
  // const beneficiary = event.params.beneficiary;
  const vaultAddress = event.address;

  const vault = Vault.load(vaultAddress.toHexString());

  if (!vault) return;

  

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
