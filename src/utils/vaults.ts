import { Address } from "@graphprotocol/graph-ts";
import { VaultContract } from "../../generated/Controller/VaultContract";

class VaultValue {
  underlying: Address;
  name: string;
  symbol: string;
  decimals: i32;

  constructor(underlying: Address, name: string, symbol: string, decimal: i32) {
    this.underlying = underlying;
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimal;
  }
}

export function extractVaultValues(contract: VaultContract): VaultValue | null {
  const underlyingCall = contract.try_underlying();
  const nameCall = contract.try_name();
  const symbolCall = contract.try_symbol();
  const decimalsCall = contract.try_decimals();

  if (underlyingCall.reverted) return null;
  if (nameCall.reverted) return null;
  if (symbolCall.reverted) return null;
  if (decimalsCall.reverted) return null;

  return new VaultValue(
    underlyingCall.value,
    nameCall.value,
    symbolCall.value,
    decimalsCall.value
  );
}
