import request from '@/utils/request'

export function fetchChartData() {
  return request({
    url: '/system/charts',
    method: 'get'
  })
}

