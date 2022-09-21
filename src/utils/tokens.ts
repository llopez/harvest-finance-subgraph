import { Address } from "@graphprotocol/graph-ts";
import { ERC20Contract } from "../../generated/Controller/ERC20Contract";
import { Token } from "../../generated/schema";

class TokenAttributes {
  address: Address;
  name: string;
  symbol: string;
  decimals: i32;
}

export function initializeToken(attributes: TokenAttributes): Token {
  const id = attributes.address.toHexString();
  const token = new Token(id);
  token.name = attributes.name;
  token.symbol = attributes.symbol;
  token.decimals = attributes.decimals;

  return token;
}

export function findOrInitializeToken(attributes: TokenAttributes): Token {
  const id = attributes.address.toHexString();

  let token = Token.load(id);

  if (token) return token;

  return initializeToken(attributes);
}

class Erc20Value {
  name: string;
  symbol: string;
  decimals: i32;

  constructor(name: string, symbol: string, decimal: i32) {
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimal;
  }
}

export function extractErc20Values(contract: ERC20Contract): Erc20Value | null {
  const nameCall = contract.try_name();
  const symbolCall = contract.try_symbol();
  const decimalsCall = contract.try_decimals();

  if (nameCall.reverted) return null;
  if (symbolCall.reverted) return null;
  if (decimalsCall.reverted) return null;

  return new Erc20Value(nameCall.value, symbolCall.value, decimalsCall.value);
}
