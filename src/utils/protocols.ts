import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import { YieldAggregator } from "../../generated/schema";

export function initializeProtocol(
  address: Address,
  name: string,
  slug: string,
  schemaVersion: string,
  subgraphVersion: string,
  methodologyVersion: string,
  network: string,
  type: string,
  totalValueLockedUSD: BigDecimal,
  protocolControlledValueUSD: BigDecimal,
  cumulativeSupplySideRevenueUSD: BigDecimal,
  cumulativeProtocolSideRevenueUSD: BigDecimal,
  cumulativeTotalRevenueUSD: BigDecimal,
  cumulativeUniqueUsers: i32
): YieldAggregator {
  const id = address.toHexString();
  const protocol = new YieldAggregator(id);
  protocol.name = name;
  protocol.slug = slug;
  protocol.schemaVersion = schemaVersion;
  protocol.subgraphVersion = subgraphVersion;
  protocol.methodologyVersion = methodologyVersion;
  protocol.network = network;
  protocol.type = type;
  protocol.totalValueLockedUSD = totalValueLockedUSD;
  protocol.protocolControlledValueUSD = protocolControlledValueUSD;
  protocol.cumulativeSupplySideRevenueUSD = cumulativeSupplySideRevenueUSD;
  protocol.cumulativeProtocolSideRevenueUSD = cumulativeProtocolSideRevenueUSD;
  protocol.cumulativeTotalRevenueUSD = cumulativeTotalRevenueUSD;
  protocol.cumulativeUniqueUsers = cumulativeUniqueUsers;

  return protocol;
}

export function findOrInitializeProtocol(
  address: Address,
  name: string,
  slug: string,
  schemaVersion: string,
  subgraphVersion: string,
  methodologyVersion: string,
  network: string,
  type: string,
  totalValueLockedUSD: BigDecimal,
  protocolControlledValueUSD: BigDecimal,
  cumulativeSupplySideRevenueUSD: BigDecimal,
  cumulativeProtocolSideRevenueUSD: BigDecimal,
  cumulativeTotalRevenueUSD: BigDecimal,
  cumulativeUniqueUsers: i32
): YieldAggregator {
  const id = address.toHexString();

  const protocol = YieldAggregator.load(id);

  if (protocol) return protocol;

  return initializeProtocol(
    address,
    name,
    slug,
    schemaVersion,
    subgraphVersion,
    methodologyVersion,
    network,
    type,
    totalValueLockedUSD,
    protocolControlledValueUSD,
    cumulativeSupplySideRevenueUSD,
    cumulativeProtocolSideRevenueUSD,
    cumulativeTotalRevenueUSD,
    cumulativeUniqueUsers
  );
}
