import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import { YieldAggregator as BaseProtocol } from "../../generated/schema";

class FindOrInitializeAttributes {
  id: string;
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

class BuildAttributes {
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

class Protocol extends BaseProtocol {
  static findOrInitialize(attributes: FindOrInitializeAttributes): Protocol {
    let instance = changetype<Protocol>(this.load(attributes.id));

    if (instance) return instance;

    return this.build({
      address: Address.fromString(attributes.id),
      name: attributes.name,
      slug: attributes.slug,
      schemaVersion: attributes.schemaVersion,
      subgraphVersion: attributes.subgraphVersion,
      methodologyVersion: attributes.methodologyVersion,
      network: attributes.network,
      type: attributes.type,
      totalValueLockedUSD: attributes.totalValueLockedUSD,
      protocolControlledValueUSD: attributes.protocolControlledValueUSD,
      cumulativeSupplySideRevenueUSD: attributes.cumulativeSupplySideRevenueUSD,
      cumulativeProtocolSideRevenueUSD:
        attributes.cumulativeProtocolSideRevenueUSD,
      cumulativeTotalRevenueUSD: attributes.cumulativeTotalRevenueUSD,
      cumulativeUniqueUsers: attributes.cumulativeUniqueUsers,
    });
  }

  static build(attributes: BuildAttributes): Protocol {
    const id = attributes.address.toHexString();
    const instance = new Protocol(id);
    instance.name = attributes.name;
    instance.slug = attributes.slug;
    instance.schemaVersion = attributes.schemaVersion;
    instance.subgraphVersion = attributes.subgraphVersion;
    instance.methodologyVersion = attributes.methodologyVersion;
    instance.network = attributes.network;
    instance.type = attributes.type;
    instance.totalValueLockedUSD = attributes.totalValueLockedUSD;
    instance.protocolControlledValueUSD = attributes.protocolControlledValueUSD;
    instance.cumulativeSupplySideRevenueUSD =
      attributes.cumulativeSupplySideRevenueUSD;
    instance.cumulativeProtocolSideRevenueUSD =
      attributes.cumulativeProtocolSideRevenueUSD;
    instance.cumulativeTotalRevenueUSD = attributes.cumulativeTotalRevenueUSD;
    instance.cumulativeUniqueUsers = attributes.cumulativeUniqueUsers;

    return instance;
  }

  static create(attributes: BuildAttributes): Protocol {
    const instance = this.build(attributes);
    instance.save();
    return instance;
  }
}

export default Protocol;
