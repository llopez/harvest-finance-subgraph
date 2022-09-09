import { Address, ethereum, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { createMockedFunction, newMockCall, assert } from "matchstick-as";
import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";

export function mockCall(
  vault: Address,
  strategy: Address
): AddVaultAndStrategyCall {
  let to = Address.fromString("0x222412af183bceadefd72e4cb1b71f1889953b1c");
  let from = Address.fromString("0x0000000000000000000000000000000000000001");
  let call = newMockCall();
  call.to = to;
  call.from = from;
  call.inputValues = [
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault)),
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy)),
  ];

  return changetype<AddVaultAndStrategyCall>(call);
}

export function mockERC20(
  address: Address,
  name: string,
  symbol: string,
  decimals: i32
): void {
  createMockedFunction(address, "name", "name():(string)").returns([
    ethereum.Value.fromString(name),
  ]);
  createMockedFunction(address, "symbol", "symbol():(string)").returns([
    ethereum.Value.fromString(symbol),
  ]);
  createMockedFunction(address, "decimals", "decimals():(uint8)").returns([
    ethereum.Value.fromI32(decimals),
  ]);
}

export function assertERC20(
  entity: string,
  address: Address,
  name: string,
  symbol: string,
  decimals: BigInt | null
): void {
  assert.fieldEquals(
    entity,
    address.toHexString(),
    "id",
    address.toHexString()
  );
  assert.fieldEquals(entity, address.toHexString(), "name", name);
  assert.fieldEquals(entity, address.toHexString(), "symbol", symbol);

  if (decimals)
    assert.fieldEquals(
      entity,
      address.toHexString(),
      "decimals",
      decimals.toString()
    );
}

export function assertToken(
  address: Address,
  name: string,
  symbol: string,
  decimals: BigInt
): void {
  assertERC20("Token", address, name, symbol, decimals);
}

export function assertVault(
  address: Address,
  name: string,
  symbol: string,
  inputToken: Address,
  outputToken: Address,
  depositLimit: BigInt,
  createdTimestamp: BigInt,
  createdBlockNumber: BigInt,
  totalValueLockedUSD: BigDecimal,
  inputTokenBalance: BigInt
): void {
  assertERC20("Vault", address, name, symbol, null);

  assert.fieldEquals(
    "Vault",
    address.toHexString(),
    "inputToken",
    inputToken.toHexString()
  );

  assert.fieldEquals(
    "Vault",
    address.toHexString(),
    "outputToken",
    outputToken.toHexString()
  );

  assert.fieldEquals(
    "Vault",
    address.toHexString(),
    "depositLimit",
    depositLimit.toString()
  );
}
