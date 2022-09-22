import { ERC20Contract } from "../../generated/Controller/ERC20Contract";

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
