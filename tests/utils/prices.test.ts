import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { assert, describe, test } from "matchstick-as";
import {
  CHAIN_LINK_CONTRACT_ADDRESS,
  CHAIN_LINK_USD_ADDRESS,
  getChainLinkPricePerToken,
  getPrice,
  getUniswapPricePerToken,
  UNISWAP_ROUTER_CONTRACT_ADDRESS,
  usdcAddress,
  wethAddress,
} from "../../src/utils/prices";
import {
  mockChainLink,
  mockERC20,
  mockUniswapRouter,
} from "../controller-utils";

const tokenAddress = Address.fromString(
  "0x6b175474e89094c44da98b954eedeac495271d0f"
);

describe("prices", () => {
  describe("getChainLinkPricePerToken", () => {
    test("returns token price", () => {
      mockChainLink(
        CHAIN_LINK_CONTRACT_ADDRESS,
        tokenAddress,
        CHAIN_LINK_USD_ADDRESS,
        BigInt.fromString("99975399"),
        8
      );

      const result = getChainLinkPricePerToken(tokenAddress);

      assert.stringEquals("0.99975399", result!.toString());
    });
  });

  describe("getUniswapPricePerToken", () => {
    test("returns token price", () => {
      mockERC20(tokenAddress, "DAI", "DAI", 18);
      mockERC20(usdcAddress, "USDC", "USDC", 6);
      mockUniswapRouter(
        UNISWAP_ROUTER_CONTRACT_ADDRESS,
        BigInt.fromString("1000000000000000000"), // 1 dai
        [tokenAddress, wethAddress, usdcAddress],
        BigInt.fromString("991234")
      );

      const result = getUniswapPricePerToken(tokenAddress);

      assert.stringEquals("0.991234", result!.toString());
    });
  });

  describe("getPrice", () => {
    test("returns amount in USD", () => {
      const result = getPrice(tokenAddress, BigDecimal.fromString("2"));

      assert.stringEquals("1.99950798", result.toString());
    });
  });
});
