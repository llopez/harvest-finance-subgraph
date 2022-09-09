import { Address } from "@graphprotocol/graph-ts";
import { Token } from "../../generated/schema";

export function findOrInitializeToken(
  address: Address,
  name: string,
  symbol: string,
  decimals: i32
): Token {
  const id = address.toHexString();

  let token = Token.load(id);

  if (token) return token;

  token = new Token(id);
  token.name = name;
  token.symbol = symbol;
  token.decimals = decimals;

  return token;
}
