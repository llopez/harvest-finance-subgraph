import {
  describe,
  test,
  clearStore,
  createMockedFunction,
  assert,
  afterEach,
} from "matchstick-as/assembly/index";
import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  handleAddVaultAndStrategy,
  handleSetFeeRewardForwarder,
} from "../src/controller";
import {
  mockCall,
  mockERC20,
  assertToken,
  assertVault,
  assertProtocol,
  mockController,
  mockFeeRewardForwarder,
  mockSetFeeRewardForwarderCall,
} from "./controller-utils";
import RewardToken from "../src/models/RewardToken";
import Vault from "../src/models/Vault";

const controllerAddress = Address.fromString(
  "0x222412af183bceadefd72e4cb1b71f1889953b1c"
);

const feeRewardForwarderAddress = Address.fromString(
  "0x0000000000000000000000000000000000000020"
);

const rewardTokenAddress = Address.fromString(
  "0x0000000000000000000000000000000000000021"
);

// Controller.feeRewardForwarder
mockController(controllerAddress, feeRewardForwarderAddress);

// FeeRewardForwarder.farm
mockFeeRewardForwarder(feeRewardForwarderAddress, rewardTokenAddress);

mockERC20(rewardTokenAddress, "FARM", "farm", 6);

describe("Controller", () => {
  afterEach(() => {
    clearStore();
  });

  describe("addVaultAndStrategy", () => {
    test("creates Vault, Tokens and RewardToken", () => {
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

      // RewardToken Assertion

      const rewardTokenId = RewardToken.generateId(
        "DEPOSIT",
        rewardTokenAddress
      );

      assert.fieldEquals("RewardToken", rewardTokenId, "type", "DEPOSIT");
      assert.fieldEquals(
        "RewardToken",
        rewardTokenId,
        "token",
        rewardTokenAddress.toHexString()
      );

      assert.fieldEquals(
        "Vault",
        vaultAddress.toHexString(),
        "rewardTokens",
        "[".concat(rewardTokenId).concat("]") // comparing string array
      );

      assertToken(rewardTokenAddress, "FARM", "farm", BigInt.fromI32(6));
    });
  });

  describe("setFeeRewardForwarder", () => {
    test("creates RewardToken and Token", () => {
      const call = mockSetFeeRewardForwarderCall(feeRewardForwarderAddress);

      handleSetFeeRewardForwarder(call);

      const id = RewardToken.generateId("DEPOSIT", rewardTokenAddress);

      assert.fieldEquals("RewardToken", id, "type", "DEPOSIT");
      assert.fieldEquals(
        "RewardToken",
        id,
        "token",
        rewardTokenAddress.toHexString()
      );

      assertToken(rewardTokenAddress, "FARM", "farm", BigInt.fromI32(6));
    });
  });
});
