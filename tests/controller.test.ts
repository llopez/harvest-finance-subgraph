import {
  assert,
  describe,
  test,
  clearStore,
  afterAll,
  newMockCall,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { AddVaultAndStrategyCall } from "../generated/Controller/ControllerContract";
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

      createMockedFunction(vaultAddress, "name", "name():(string)").returns([
        ethereum.Value.fromString("Vault 1"),
      ]);

      createMockedFunction(
        vaultAddress,
        "symbol",
        "symbol():(string)"
      ).returns([ethereum.Value.fromString("V1")]);

      let call = mockCall(vaultAddress, strategyAddress);

      handleAddVaultAndStrategy(call);

      assert.fieldEquals(
        "Vault",
        vaultAddress.toHexString(),
        "id",
        vaultAddress.toHexString()
      );
      assert.fieldEquals(
        "Vault",
        vaultAddress.toHexString(),
        "name",
        "Vault 1"
      );
      assert.fieldEquals("Vault", vaultAddress.toHexString(), "symbol", "V1");
    });
  });
});
