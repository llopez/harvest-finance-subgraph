import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { assert, createMockedFunction, describe, test } from "matchstick-as";
import {
  CHAIN_LINK_CONTRACT_ADDRESS,
  CHAIN_LINK_USD_ADDRESS,
  getPrice,
  getPricePerToken,
} from "../../src/utils/prices";

function mockChainLink(
  contractAddress: Address,
  baseAddress: Address,
  quoteAddress: Address,
  value: BigInt,
  decimals: i32
): void {
  createMockedFunction(
    contractAddress,
    "latestRoundData",
    "latestRoundData(address,address):(uint80,int256,uint256,uint256,uint80)"
  )
    .withArgs([
      ethereum.Value.fromAddress(baseAddress),
      ethereum.Value.fromAddress(quoteAddress),
    ])
    .returns([
      ethereum.Value.fromI32(0),
      ethereum.Value.fromUnsignedBigInt(value),
      ethereum.Value.fromI32(0),
      ethereum.Value.fromI32(0),
      ethereum.Value.fromI32(0),
    ]);

  createMockedFunction(
    contractAddress,
    "decimals",
    "decimals(address,address):(uint8)"
  )
    .withArgs([
      ethereum.Value.fromAddress(baseAddress),
      ethereum.Value.fromAddress(quoteAddress),
    ])
    .returns([ethereum.Value.fromI32(decimals)]);
}

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
