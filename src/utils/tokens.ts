import { Address } from "@graphprotocol/graph-ts";
import { ERC20Contract } from "../../generated/Controller/ERC20Contract";
import { Token } from "../../generated/schema";

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

export function getErc20Decimals(address: Address): i32 {
  const erc20Contract = ERC20Contract.bind(address);
  const callResult = erc20Contract.try_decimals();
  return callResult.value;
}

export namespace tokens {
  export function findOrInitialize(address: Address): Token {
    const id = address.toHexString();

    let token = Token.load(id);

    if (token) return token;

    return initialize(id);
  }

  export function initialize(id: string): Token {
    const token = new Token(id);

    token.name = "";
    token.symbol = "";
    token.decimals = 0;

    return token;
  }
}
