import { Address } from "@graphprotocol/graph-ts";
import { RewardToken as BaseRewardToken } from "../../generated/schema";

class FindOrInitializeAttributes {
  id: string;
  token: string;
  type: string;
}

class BuildAttributes {
  address: Address;
  token: string;
  type: string;
}

class RewardToken extends BaseRewardToken {
  static findOrInitialize(attributes: FindOrInitializeAttributes): RewardToken {
    let instance = changetype<RewardToken>(this.load(attributes.id));

    if (instance) return instance;

    return this.build({
      address: Address.fromString(attributes.id),
      token: attributes.token,
      type: attributes.type,
    });
  }

  static build(attributes: BuildAttributes): RewardToken {
    const id = this.generateId(attributes.type, attributes.address);

    const instance = new RewardToken(id);
    instance.token = attributes.token;
    instance.type = attributes.type;

    return instance;
  }

  static create(attributes: BuildAttributes): RewardToken {
    const instance = this.build(attributes);
    instance.save();
    return instance;
  }

  static generateId(type: string, address: Address): string {
    return type.concat("-").concat(address.toHexString());
  }
}

export default RewardToken;
