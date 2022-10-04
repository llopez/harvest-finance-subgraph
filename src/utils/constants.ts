import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";

export namespace constants {
  export const BIG_INT_ZERO = BigInt.zero();
  export const BIG_DECIMAL_ZERO = BigDecimal.zero();
  export const CONTROLLER_ADDRESS = Address.fromString(
    "0x222412af183bceadefd72e4cb1b71f1889953b1c"
  );
}
