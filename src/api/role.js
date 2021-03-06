import request from '@/utils/request'
const url = '/sys/role'
export function getDataList() {
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

export function getInfo(id) {
  return request({
    url: url + '/info/' + id,
    method: 'get'
  })
}

export function getPermissions() {
  return request({
    url: url + '/permission',
    method: 'get'
  })
}

export function del(data) {
  return request({
    url: url,
    method: 'delete',
    data
  })
}
