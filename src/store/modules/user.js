import userService from '@/api/user'
import { setToken, removeToken } from '@/utils/cookie'
import { resetRouter } from '@/router'

const state = {
  name: '',
  roleCode: ''
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLE_CODE: (state, roleCode) => {
    state.roleCode = roleCode
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      userService.login({ username: username.trim(), password: password }).then(res => {
        setToken(res.appToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      userService.getInfo().then(res => {
        const { username, roleCode } = res
        commit('SET_NAME', username)
        commit('SET_ROLE_CODE', roleCode)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      userService.logout().then(() => {
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

