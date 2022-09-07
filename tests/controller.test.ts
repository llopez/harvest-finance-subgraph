import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  newMockCall,
} from "matchstick-as/assembly/index";
import { AddVaultAndStrategyCall } from "../generated/Controller/Controller";
import { Address, ethereum } from "@graphprotocol/graph-ts";
import { handleAddVaultAndStrategy } from "../src/controller";

function mockCall(vault: Address, strategy: Address): AddVaultAndStrategyCall {
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

describe("Controller", () => {
  afterAll(() => {
    clearStore();
  });

  describe("addVaultAndStrategy", () => {
    test("creates Vault", () => {
      let vaultAddress = Address.fromString(
        "0x0000000000000000000000000000000000000002"
      );
      let strategyAddress = Address.fromString(
        "0x0000000000000000000000000000000000000003"
      );

      let call = mockCall(vaultAddress, strategyAddress);

      handleAddVaultAndStrategy(call);

      assert.fieldEquals(
        "Vault",
        vaultAddress.toHexString(),
        "id",
        vaultAddress.toHexString()
      );
    });
  });
});
