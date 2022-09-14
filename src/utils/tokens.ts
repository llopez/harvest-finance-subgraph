import { Address } from "@graphprotocol/graph-ts";
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
