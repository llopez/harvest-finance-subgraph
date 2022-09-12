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
  assertProtocol,
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

      assertProtocol(
        Address.fromString("0x222412af183bceadefd72e4cb1b71f1889953b1c"),
        "Harvest Finance",
        "harvest-finance",
        "0.0.1",
        "0.0.1",
        "0.0.1",
        "MAINNET",
        "YIELD",
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        0
      );

      // TODO: check Vault.protocol

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
        BigInt.fromI32(0),
        "0x222412af183bceadefd72e4cb1b71f1889953b1c"
      );

      // Input Token Assertions

      assertToken(inputTokenAddress, "USD Coin", "USDC", BigInt.fromI32(6));

      // Output Token Assertions

      assertToken(vaultAddress, "FARM_USDC", "fUSDC", BigInt.fromI32(6));
    });
  });
});
