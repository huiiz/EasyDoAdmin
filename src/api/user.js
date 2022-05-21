import request from '@/utils/request'
import { getRefreshToken } from '@/utils/auth'

export function login(data) {
  return request({
    url: 'system/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: 'system/register/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'system/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: 'system/logout',
    method: 'post'
  })
}

export function refresh() {
  return request({
    url: 'auth/refresh',
    method: 'post',
    data: {
      refresh: getRefreshToken()
    }
  })
}

export function fetchList(query) {
  return request({
    url: '/system/ulist',
    method: 'get',
    params: query
  })
}


export function invite(data) {
  return request({
    url: 'system/createinvite',
    method: 'post',
    data
  })
}


export function changeType(data, uid) {
  return request({
    url: 'system/utype/'+uid+'/',
    method: 'put',
    data
  })
}