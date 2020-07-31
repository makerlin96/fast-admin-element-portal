import request from '@/utils/request'
const url = '/sys/menu'
export function getMenuDataList() {
  return request({
    url: url,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}
export function del(ids) {
  return request({
    url: url,
    method: 'delete',
    data: ids
  })
}

export function getMenuById(id) {
  return request({
    url: url + '/info/' + id,
    method: 'get'
  })
}
