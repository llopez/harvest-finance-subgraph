import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import {
  assertDeposit,
  createDepositEvent,
  createTransferEvent,
} from "./vault-utils";
import { handleDeposit, handleTransfer } from "../src/vault";
import { generateDepositId } from "../src/utils/deposits";
import Vault from "../src/models/Vault";

const vaultAddress = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);

function createVault(): Vault {
  const inputTokenAddress = Address.fromString(
    "0x0000000000000000000000000000000000000002"
  );
  const outputTokenAddress = Address.fromString(
    "0x0000000000000000000000000000000000000003"
  );
  const protocolAddress = Address.fromString(
    "0x0000000000000000000000000000000000000004"
  );

  const vault = Vault.build({
    address: vaultAddress,
    name: "FARM_USDC",
    symbol: "fUSDC",
    inputToken: inputTokenAddress,
    outputToken: outputTokenAddress,
    depositLimit: BigInt.fromI32(0),
    createdTimestamp: BigInt.fromI32(0),
    createdBlockNumber: BigInt.fromI32(0),
    totalValueLockedUSD: BigDecimal.fromString("0"),
    inputTokenBalance: BigInt.fromI32(0),
    protocol: protocolAddress.toHexString(),
  });

  const feeId = "DEPOSIT-".concat(vaultAddress.toHexString());

  vault.fees = [feeId];

  vault.save();

  return vault;
}

describe("Vault", () => {
  afterEach(() => {
    clearStore();
  });

  describe("handleDeposit", () => {
    test("updates inputTokenBalance", () => {
      const vault = createVault();

      const beneficiaryAddress = Address.fromString(
        "0x0000000000000000000000000000000000000009"
      );
      const amount = BigInt.fromI32(100);
      const event = createDepositEvent(amount, beneficiaryAddress);
      event.address = Address.fromString(vault.id);

      handleDeposit(event);

      assert.fieldEquals("Vault", vault.id, "inputTokenBalance", "100");
    });

    test("creates Deposit", () => {
      const vault = createVault();

      const fromAddress = Address.fromString(
        "0x0000000000000000000000000000000000000010"
      );

      const beneficiaryAddress = Address.fromString(
        "0x0000000000000000000000000000000000000009"
      );
      const amount = BigInt.fromI32(100);
      const event = createDepositEvent(amount, beneficiaryAddress);
      event.address = Address.fromString(vault.id);
      event.transaction.from = fromAddress;
      handleDeposit(event);

      const depositId = generateDepositId(event);

      assertDeposit(depositId, {
        hash: event.transaction.hash,
        to: beneficiaryAddress,
        from: fromAddress,
        asset: Address.fromString(vault.inputToken),
        amount: amount,
        vault: vaultAddress,
        logIndex: BigInt.fromI32(1),
        protocol: vault.protocol,
        blockNumber: BigInt.fromI32(1),
        timestamp: BigInt.fromI32(1),
        amountUSD: BigDecimal.fromString("0"),
      });
    });
  });

  describe("handleTransfer", () => {
    describe("when transfer comes from zero address (minting)", () => {
      test("updates outputTokenSupply", () => {
        const vault = createVault();

        const zeroAddress = Address.zero();
        const toAddress = Address.fromString(
          "0x0000000000000000000000000000000000000001"
        );

        const amount = BigInt.fromString("200");

        const event = createTransferEvent(zeroAddress, toAddress, amount);

        event.address = vaultAddress;

        handleTransfer(event);

        assert.fieldEquals(
          "Vault",
          vault.id,
          "outputTokenSupply",
          amount.toString()
        );
      });
    });
  });
});
