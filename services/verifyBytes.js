import jscrypto from 'jscrypto'
import secp256k1 from 'secp256k1'
import terra from '@terra-money/terra.js'

export const verifyBytes = (bytes, signBytesResult) => {
  let _a;
  signBytesResult.signature = new Uint8Array(signBytesResult.signature)
  signBytesResult.public_key = terra.PublicKey.fromData(JSON.parse(signBytesResult.public_key))
  const publicKey = (_a = signBytesResult.public_key) === null || _a === void 0 ? void 0 : _a.toProto();

  if (publicKey && 'key' in publicKey) {
    return secp256k1.ecdsaVerify(signBytesResult.signature, Buffer.from(jscrypto.SHA256.hash(new jscrypto.Word32Array(bytes)).toString(), 'hex'), publicKey.key);
  }

  return false
}
