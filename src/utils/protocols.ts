import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import { YieldAggregator } from "../../generated/schema";

class ProtocolAttributes {
  address: Address;
  name: string;
  slug: string;
  schemaVersion: string;
  subgraphVersion: string;
  methodologyVersion: string;
  network: string;
  type: string;
  totalValueLockedUSD: BigDecimal;
  protocolControlledValueUSD: BigDecimal;
  cumulativeSupplySideRevenueUSD: BigDecimal;
  cumulativeProtocolSideRevenueUSD: BigDecimal;
  cumulativeTotalRevenueUSD: BigDecimal;
  cumulativeUniqueUsers: i32;
}

export function initializeProtocol(
  attributes: ProtocolAttributes
): YieldAggregator {
  const id = attributes.address.toHexString();
  const protocol = new YieldAggregator(id);
  protocol.name = attributes.name;
  protocol.slug = attributes.slug;
  protocol.schemaVersion = attributes.schemaVersion;
  protocol.subgraphVersion = attributes.subgraphVersion;
  protocol.methodologyVersion = attributes.methodologyVersion;
  protocol.network = attributes.network;
  protocol.type = attributes.type;
  protocol.totalValueLockedUSD = attributes.totalValueLockedUSD;
  protocol.protocolControlledValueUSD = attributes.protocolControlledValueUSD;
  protocol.cumulativeSupplySideRevenueUSD =
    attributes.cumulativeSupplySideRevenueUSD;
  protocol.cumulativeProtocolSideRevenueUSD =
    attributes.cumulativeProtocolSideRevenueUSD;
  protocol.cumulativeTotalRevenueUSD = attributes.cumulativeTotalRevenueUSD;
  protocol.cumulativeUniqueUsers = attributes.cumulativeUniqueUsers;

  return protocol;
}

export function findOrInitializeProtocol(
  attributes: ProtocolAttributes
): YieldAggregator {
  const id = attributes.address.toHexString();

  const protocol = YieldAggregator.load(id);

  if (protocol) return protocol;

  return initializeProtocol(attributes);
}
