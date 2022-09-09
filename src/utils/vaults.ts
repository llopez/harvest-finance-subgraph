import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { ERC20Contract } from "../../generated/Controller/ERC20Contract";
import { VaultContract } from "../../generated/Controller/VaultContract";
import { Token, Vault } from "../../generated/schema";

export function findOrInitializeVault(
  address: Address,
  _inputToken: Address | null,
  _outputToken: Address | null
): Vault {
  const id = address.toHexString();

  let vault = Vault.load(id);

  if (vault) return vault;

  vault = new Vault(address.toHexString());

  const vaultContract = VaultContract.bind(address);
  const underlying = vaultContract.try_underlying().value;
  const erc20Contract = ERC20Contract.bind(underlying);

  const inputToken = new Token(underlying.toHexString());
  inputToken.name = erc20Contract.try_name().value;
  inputToken.symbol = erc20Contract.try_symbol().value;
  inputToken.decimals = erc20Contract.try_decimals().value;
  inputToken.save();

  const outputToken = new Token(address.toHexString());
  outputToken.name = vaultContract.try_name().value;
  outputToken.symbol = vaultContract.try_symbol().value;
  outputToken.decimals = vaultContract.try_decimals().value;
  outputToken.save();

  vault.inputToken = inputToken.id;
  vault.outputToken = outputToken.id;

  vault.depositLimit = BigInt.fromI32(0);

  return vault;
}
