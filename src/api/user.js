import request from '@/utils/request'
const url = '/sys/user'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: url + '/permissions',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}

export function getCaptchaImg(timestamp) {
  return request({
    url: '/captcha/' + timestamp,
    method: 'get'
  })
}

export function getDataList(data) {
  return request({
    url: url,
    method: 'get',
    params: data
  })
}
