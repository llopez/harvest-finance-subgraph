import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { SharePriceChangeLog } from "../generated/Controller/Controller"

export function createSharePriceChangeLogEvent(
  vault: Address,
  strategy: Address,
  oldSharePrice: BigInt,
  newSharePrice: BigInt,
  timestamp: BigInt
): SharePriceChangeLog {
  let sharePriceChangeLogEvent = changetype<SharePriceChangeLog>(newMockEvent())

  sharePriceChangeLogEvent.parameters = new Array()

  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam("strategy", ethereum.Value.fromAddress(strategy))
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam(
      "oldSharePrice",
      ethereum.Value.fromUnsignedBigInt(oldSharePrice)
    )
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam(
      "newSharePrice",
      ethereum.Value.fromUnsignedBigInt(newSharePrice)
    )
  )
  sharePriceChangeLogEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return sharePriceChangeLogEvent
}
