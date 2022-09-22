import { Address } from "@graphprotocol/graph-ts";
import {
  afterEach,
  assert,
  beforeEach,
  clearStore,
  describe,
  test,
} from "matchstick-as";
import Token from "../../src/models/Token";

describe("Token", () => {
  afterEach(() => {
    clearStore();
  });

  describe("build", () => {
    test("builds Token instance from attributes", () => {
      const token = Token.build({
        address: Address.zero(),
        symbol: "tk1",
        name: "token 1",
        decimals: 6,
      });

      assert.stringEquals(token.id, Address.zero().toHexString());
      assert.stringEquals(token.name, "token 1");
      assert.stringEquals(token.symbol, "tk1");
      assert.i32Equals(token.decimals, 6);
    });
  });
  describe("create", () => {
    test("creates Token record from attributes", () => {
      const address = Address.zero();
      const id = address.toHexString();

      const token = Token.create({
        address,
        symbol: "tk1",
        name: "token 1",
        decimals: 6,
      });

      assert.fieldEquals("Token", id, "name", "token 1");
      assert.fieldEquals("Token", id, "symbol", "tk1");
      assert.fieldEquals("Token", id, "decimals", "6");
    });
  });
  describe("findOrInitialize", () => {
    describe("when record already exist", () => {
      beforeEach(() => {
        Token.create({
          address: Address.zero(),
          symbol: "symbol from db",
          name: "name from db",
          decimals: 6,
        });
      });

      test("builds Token instance from record", () => {
        const token = Token.findOrInitialize({
          id: Address.zero().toHexString(),
          symbol: "tk1",
          name: "token 1",
          decimals: 6,
        });

        assert.stringEquals(token.id, Address.zero().toHexString());
        assert.stringEquals(token.name, "name from db");
        assert.stringEquals(token.symbol, "symbol from db");
        assert.i32Equals(token.decimals, 6);
      });
    });
    describe("when record does not exist", () => {
      test("builds Token instance from attributes", () => {
        const token = Token.findOrInitialize({
          id: Address.zero().toHexString(),
          symbol: "tk1",
          name: "token 1",
          decimals: 6,
        });

        assert.stringEquals(token.id, Address.zero().toHexString());
        assert.stringEquals(token.name, "token 1");
        assert.stringEquals(token.symbol, "tk1");
        assert.i32Equals(token.decimals, 6);
      });
    });
  });
});
