import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/system/article',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/system/article/'+id,
    method: 'get',
  })
}

export function getTags(content) {
  return request({
    url: '/system/tags',
    method: 'post',
    data: {content}
  })
}

export function getCates() {
  return request({
    url: '/system/cates',
    method: 'get',
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/system/article/',
    method: 'post',
    data
  })
}

export function updateArticle(data, id) {
  return request({
    url: '/system/article/'+id+'/',
    method: 'put',
    data
  })
}
