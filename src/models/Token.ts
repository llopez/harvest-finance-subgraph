import { Address } from "@graphprotocol/graph-ts";
import { Token as BaseToken } from "../../generated/schema";

class FindOrInitializeAttributes {
  id: string;
  name: string;
  symbol: string;
  decimals: i32;
}

class BuildAttributes {
  address: Address;
  name: string;
  symbol: string;
  decimals: i32;
}

class Token extends BaseToken {
  static findOrInitialize(attributes: FindOrInitializeAttributes): Token {
    let instance = changetype<Token>(this.load(attributes.id));

    if (instance) return instance;

    return this.build({
      address: Address.fromString(attributes.id),
      name: attributes.name,
      symbol: attributes.symbol,
      decimals: attributes.decimals,
    });
  }

  static build(attributes: BuildAttributes): Token {
    const id = attributes.address.toHexString();
    const instance = new Token(id);
    instance.name = attributes.name;
    instance.symbol = attributes.symbol;
    instance.decimals = attributes.decimals;

    return instance;
  }

  static create(attributes: BuildAttributes): Token {
    const instance = this.build(attributes);
    instance.save();
    return instance;
  }
}

export default Token;
