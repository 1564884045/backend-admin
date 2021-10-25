import JSEncrypt from 'jsencrypt'

/**
 *
 * @description RSA加密
 * @param data
 * @param publicKey 公钥
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data,publicKey) {
  if (publicKey === '') {
    return data
  }
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(JSON.stringify(data));
}

/**
 *
 * @description RSA解密
 * @param data
 * @param privateKey 私钥解密
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function decryptedData(data,privateKey) {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(
    `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
  );
  data = decrypt.decrypt(JSON.stringify(data))
  return data
}
