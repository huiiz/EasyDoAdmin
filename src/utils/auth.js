import Cookies from 'js-cookie'

const AccessToken = 'access_token'
const RefreshToken = 'refresh_token'

export function getAccessToken() {
  return Cookies.get(AccessToken)
}

export function getRefreshToken() {
  return Cookies.get(RefreshToken)
}

export function setToken(access_token, refresh_token) {
  Cookies.set(AccessToken, access_token)
  return Cookies.set(RefreshToken, refresh_token)
}

export function removeToken() {
  Cookies.remove(RefreshToken)
  return Cookies.remove(AccessToken)
}
