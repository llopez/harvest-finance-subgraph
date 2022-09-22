import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Withdraw as BaseWithdraw } from "../../generated/schema";
import { Attributes } from "./Deposit";

class Withdraw extends BaseWithdraw {
  static generateId(hash: Bytes, logIndex: BigInt): string {
    return hash.toHexString().concat(logIndex.toString());
  }

  static findOrInitialize(attributes: Attributes): Withdraw {
    const id = this.generateId(attributes.hash, attributes.logIndex);

    let instance = changetype<Withdraw>(this.load(id));

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

  static build(attributes: Attributes): Withdraw {
    const id = this.generateId(attributes.hash, attributes.logIndex);

    const instance = new Withdraw(id);
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

  static create(attributes: Attributes): Withdraw {
    const instance = this.build(attributes);
    instance.save();
    return instance;
  }
}

export default Withdraw;
