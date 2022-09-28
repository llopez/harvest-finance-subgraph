import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { ChainLinkContract } from "../../generated/Controller/ChainLinkContract";

export const CHAIN_LINK_CONTRACT_ADDRESS = Address.fromString(
  "0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf"
);

export const CHAIN_LINK_USD_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000348"
);

export function getPricePerToken(tokenAddress: Address): BigDecimal {
  const contract = ChainLinkContract.bind(CHAIN_LINK_CONTRACT_ADDRESS);

  const latestRoundDataCall = contract.try_latestRoundData(
    tokenAddress,
    CHAIN_LINK_USD_ADDRESS
  );

  if (latestRoundDataCall.reverted) return BigDecimal.fromString("0");

  const decimalsCall = contract.try_decimals(
    tokenAddress,
    CHAIN_LINK_USD_ADDRESS
  );

  if (decimalsCall.reverted) return BigDecimal.fromString("0");

  const decimals = decimalsCall.value;

  const decimalsBase10 = BigInt.fromI32(10).pow(decimals as u8);

  return latestRoundDataCall.value.value1
    .toBigDecimal()
    .div(decimalsBase10.toBigDecimal());
}

export function getPrice(
  tokenAddress: Address,
  amount: BigDecimal
): BigDecimal {
  return getPricePerToken(tokenAddress).times(amount);
}
