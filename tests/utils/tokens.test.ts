import { Address } from "@graphprotocol/graph-ts";
import {
  describe,
  assert,
  test,
  beforeEach,
  clearStore,
  afterEach,
} from "matchstick-as";
import { Token } from "../../generated/schema";

import { findOrInitializeToken } from "../../src/utils/tokens";

const address = Address.fromString(
  "0x0000000000000000000000000000000000000001"
);

describe("tokens", () => {
  afterEach(() => {
    clearStore();
  });

  describe("findOrInitialize", () => {
    describe("when token already exist", () => {
      beforeEach(() => {
        let t = new Token(address.toHexString());
        t.name = "USD Coin";
        t.symbol = "USDC";
        t.decimals = 18;
        t.save();
      });

      test("returns token from store", () => {
        const token = findOrInitializeToken(
          address,
          "Token Name",
          "Token Symbol",
          6
        );
        assert.stringEquals(token.id, address.toHexString());
        assert.stringEquals(token.name, "USD Coin");
        assert.stringEquals(token.symbol, "USDC");
        assert.i32Equals(token.decimals, 18);
      });
    });

    describe("when token does not exist yet", () => {
      test("returns a new token instance", () => {
        const token = findOrInitializeToken(
          address,
          "Token Name",
          "Token Symbol",
          6
        );
        assert.stringEquals(token.id, address.toHexString());
        assert.stringEquals(token.name, "Token Name");
        assert.stringEquals(token.symbol, "Token Symbol");
        assert.i32Equals(token.decimals, 6);
      });
    });
  });
});
