import { Address, BigDecimal, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Deposit as BaseDeposit } from "../../generated/schema";

class Attributes {
  hash: Bytes;
  logIndex: BigInt;
  protocol: string;
  to: Address;
  from: Address;
  blockNumber: BigInt;
  timestamp: BigInt;
  asset: Address;
  amount: BigInt;
  amountUSD: BigDecimal;
  vault: Address;
}

class Deposit extends BaseDeposit {
  static generateId(hash: Bytes, logIndex: BigInt): string {
    return hash.toHexString().concat(logIndex.toString());
  }

  static findOrInitialize(attributes: Attributes): Deposit {
    const id = this.generateId(attributes.hash, attributes.logIndex);

    let instance = changetype<Deposit>(this.load(id));

    if (instance) return instance;

    return this.build({
      hash: attributes.hash,
      logIndex: attributes.logIndex,
      protocol: attributes.protocol,
      to: attributes.to,
      from: attributes.from,
      blockNumber: attributes.blockNumber,
      timestamp: attributes.timestamp,
      asset: attributes.asset,
      amount: attributes.amount,
      amountUSD: attributes.amountUSD,
      vault: attributes.vault,
    });
  }

  static build(attributes: Attributes): Deposit {
    const id = this.generateId(attributes.hash, attributes.logIndex);

    const instance = new Deposit(id);
    instance.hash = attributes.hash.toHexString();
    instance.logIndex = attributes.logIndex.toI32();
    instance.protocol = attributes.protocol;
    instance.to = attributes.to.toHexString();
    instance.from = attributes.from.toHexString();
    instance.blockNumber = attributes.blockNumber;
    instance.timestamp = attributes.timestamp;
    instance.asset = attributes.asset.toHexString();
    instance.amount = attributes.amount;
    instance.amountUSD = attributes.amountUSD;
    instance.vault = attributes.vault.toHexString();

    return instance;
  }

  static create(attributes: Attributes): Deposit {
    const instance = this.build(attributes);
    instance.save();
    return instance;
  }
}

export default Deposit;
