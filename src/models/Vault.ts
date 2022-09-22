import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Vault as BaseVault } from "../../generated/schema";

class FindOrInitializeAttributes {
  id: string;
  name: string;
  symbol: string;
  inputToken: Address;
  outputToken: Address;
  depositLimit: BigInt;
  createdTimestamp: BigInt;
  createdBlockNumber: BigInt;
  totalValueLockedUSD: BigDecimal;
  inputTokenBalance: BigInt;
  protocol: string;
}

class BuildAttributes {
  address: Address;
  name: string;
  symbol: string;
  inputToken: Address;
  outputToken: Address;
  depositLimit: BigInt;
  createdTimestamp: BigInt;
  createdBlockNumber: BigInt;
  totalValueLockedUSD: BigDecimal;
  inputTokenBalance: BigInt;
  protocol: string;
}

class Vault extends BaseVault {
  static findOrInitialize(attributes: FindOrInitializeAttributes): Vault {
    let instance = changetype<Vault>(this.load(attributes.id));

    if (instance) return instance;

    return this.build({
      address: Address.fromString(attributes.id),
      name: attributes.name,
      symbol: attributes.symbol,
      inputToken: attributes.inputToken,
      outputToken: attributes.outputToken,
      depositLimit: attributes.depositLimit,
      createdTimestamp: attributes.createdTimestamp,
      createdBlockNumber: attributes.createdBlockNumber,
      totalValueLockedUSD: attributes.totalValueLockedUSD,
      inputTokenBalance: attributes.inputTokenBalance,
      protocol: attributes.protocol,
    });
  }

  static build(attributes: BuildAttributes): Vault {
    const id = attributes.address.toHexString();
    const instance = new Vault(id);
    instance.name = attributes.name;
    instance.symbol = attributes.symbol;
    instance.inputToken = attributes.inputToken.toHexString();
    instance.outputToken = attributes.outputToken.toHexString();
    instance.depositLimit = attributes.depositLimit;
    instance.createdTimestamp = attributes.createdTimestamp;
    instance.createdBlockNumber = attributes.createdBlockNumber;
    instance.totalValueLockedUSD = attributes.totalValueLockedUSD;
    instance.inputTokenBalance = attributes.inputTokenBalance;
    instance.protocol = attributes.protocol;

    return instance;
  }

  static create(attributes: BuildAttributes): Vault {
    const instance = this.build(attributes);
    instance.save();
    return instance;
  }
}

export default Vault;
