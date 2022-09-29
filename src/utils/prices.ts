import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { ChainLinkContract } from "../../generated/Controller/ChainLinkContract";
import { YearnLensContract } from "../../generated/Controller/YearnLensContract";

export const CHAIN_LINK_CONTRACT_ADDRESS = Address.fromString(
  "0x47fb2585d2c56fe188d0e6ec628a38b74fceeedf"
);
export const YEARN_LENS_CONTRACT_ADDRESS = Address.fromString(
  "0x83d95e0d5f402511db06817aff3f9ea88224b030"
);

export const CHAIN_LINK_USD_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000348"
);

export function getPricePerToken(tokenAddress: Address): BigDecimal {
  const chainLinkPricePerToken = getChainLinkPricePerToken(tokenAddress);

  if (chainLinkPricePerToken) return chainLinkPricePerToken;

  const yearnLensPricePerToken = getYearnLensPricePerToken(tokenAddress);

  if (yearnLensPricePerToken) return yearnLensPricePerToken;

  return BigDecimal.fromString("0");
}

export function getYearnLensPricePerToken(
  tokenAddress: Address
): BigDecimal | null {
  const contract = YearnLensContract.bind(YEARN_LENS_CONTRACT_ADDRESS);

  const callResult = contract.try_getPriceUsdcRecommended(tokenAddress);

  if (callResult.reverted) {
    log.warning("getPriceUsdcRecommended Reverted token: {}", [
      tokenAddress.toHexString(),
    ]);
    return null;
  }

  return callResult.value.toBigDecimal();
}

export function getChainLinkPricePerToken(
  tokenAddress: Address
): BigDecimal | null {
  const contract = ChainLinkContract.bind(CHAIN_LINK_CONTRACT_ADDRESS);

  const latestRoundDataCall = contract.try_latestRoundData(
    tokenAddress,
    CHAIN_LINK_USD_ADDRESS
  );

  if (latestRoundDataCall.reverted) {
    log.warning("latestRoundDataCall Reverted base: {}", [
      tokenAddress.toHexString(),
    ]);
    return null;
  }

  const decimalsCall = contract.try_decimals(
    tokenAddress,
    CHAIN_LINK_USD_ADDRESS
  );

  if (decimalsCall.reverted) {
    log.warning("decimalsCall Reverted base: {}", [tokenAddress.toHexString()]);
    return null;
  }

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
