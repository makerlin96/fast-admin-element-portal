import { constantRoutes, errorRoutes } from '@/router'
import Layout from '@/layout'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  const accessedRouters = []
  routes.forEach(router => {
    if (router.component) {
      if (router.component === 'Layout') {
        router.component = Layout
      } else {
        const component = router.component
        router.component = resolve => require(['@/views/' + component], resolve)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRoutes(router.children)
    }
    accessedRouters.push(router)
  })
  // console.log(accessedRouters)
  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: [],
  buttons: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  }
}

const actions = {
  generateRoutes({ commit }, { routes, buttons }) {
    return new Promise((resolve, reject) => {
      console.log('开始构建路由')
      const accessedRoutes = filterAsyncRoutes(routes).concat(errorRoutes)
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_BUTTONS', buttons)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
