import {
  describe,
  test,
  clearStore,
  afterAll,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { handleAddVaultAndStrategy } from "../src/controller";
import {
  mockCall,
  mockERC20,
  assertToken,
  assertVault,
} from "./controller-utils";

describe("Controller", () => {
  afterAll(() => {
    clearStore();
  });

  describe("addVaultAndStrategy", () => {
    test("creates Vault and Tokens", () => {
      let vaultAddress = Address.fromString(
        "0x0000000000000000000000000000000000000002"
      );
      let strategyAddress = Address.fromString(
        "0x0000000000000000000000000000000000000003"
      );

      const inputTokenAddress = Address.fromString(
        "0x0000000000000000000000000000000000000004"
      );

      createMockedFunction(
        vaultAddress,
        "underlying",
        "underlying():(address)"
      ).returns([ethereum.Value.fromAddress(inputTokenAddress)]);

      mockERC20(inputTokenAddress, "USD Coin", "USDC", 6);
      mockERC20(vaultAddress, "FARM_USDC", "fUSDC", 6);

      const call = mockCall(vaultAddress, strategyAddress);

      handleAddVaultAndStrategy(call);

      // Vault Assertions

      assertVault(
        vaultAddress,
        "FARM_USDC",
        "fUSDC",
        inputTokenAddress,
        vaultAddress,
        BigInt.fromI32(0),
        call.block.timestamp,
        call.block.number,
        BigDecimal.fromString("0"),
        BigInt.fromI32(0)
      );

      // Input Token Assertions

      assertToken(inputTokenAddress, "USD Coin", "USDC", BigInt.fromI32(6));

      // Output Token Assertions

      assertToken(vaultAddress, "FARM_USDC", "fUSDC", BigInt.fromI32(6));
    });
  });
});
