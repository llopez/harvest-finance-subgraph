import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { assert, describe, test } from "matchstick-as";
import {
  CHAIN_LINK_CONTRACT_ADDRESS,
  CHAIN_LINK_USD_ADDRESS,
  getPrice,
  getPricePerToken,
} from "../../src/utils/prices";
import { mockChainLink } from "../controller-utils";

const tokenAddress = Address.fromString(
  "0x6b175474e89094c44da98b954eedeac495271d0f"
);

describe("prices", () => {
  describe("getPricePerToken", () => {
    test("returns token price", () => {
      mockChainLink(
        CHAIN_LINK_CONTRACT_ADDRESS,
        tokenAddress,
        CHAIN_LINK_USD_ADDRESS,
        BigInt.fromString("99975399"),
        8
      );

      const result = getPricePerToken(tokenAddress);

      assert.stringEquals("0.99975399", result.toString());
    });
  });

  describe("getPrice", () => {
    test("returns amount in USD", () => {
      const result = getPrice(tokenAddress, BigDecimal.fromString("2"));

      assert.stringEquals("1.99950798", result.toString());
    });
  });
});
