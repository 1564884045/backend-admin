import globalSettings from '@/setting'

const storageType = globalSettings.storageType;
const tokenKey = globalSettings.tokenKey;

/**
 *
 * @description 获取accessToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getAccessToken() {
  if (storageType) {
    if ('localStorage' === storageType) {
      return localStorage.getItem(tokenKey)
    } else if ('sessionStorage' === storageType) {
      return sessionStorage.getItem(tokenKey)
    } else {
      return localStorage.getItem(tokenKey)
    }
  } else {
    return localStorage.getItem(tokenKey)
  }
}

/**
 *
 * @description 存储accessToken
 * @param accessToken
 * @returns {void|*}
 */
export function setAccessToken(accessToken) {
  console.log('存储accessToken',accessToken)
  if (storageType) {
    if ('localStorage' === storageType) {
      return localStorage.setItem(tokenKey, accessToken)
    } else if ('sessionStorage' === storageType) {
      return sessionStorage.setItem(tokenKey, accessToken)
    } else {
      return localStorage.setItem(tokenKey, accessToken)
    }
  } else {
    return localStorage.setItem(tokenKey, accessToken)
  }
}

/**
 *
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  if (storageType) {
    if ('localStorage' === storageType) {
      return localStorage.removeItem(tokenKey)
    } else if ('sessionStorage' === storageType) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(tokenKey)
    }
  } else {
    return localStorage.removeItem(tokenKey)
  }
}
