import { login, logout, getInfo, refresh, register } from '@/api/user'
import { getAccessToken, getRefreshToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import store from '@/store'


const getDefaultState = () => {
  return {
    access_token: getAccessToken(),
    refresh_token: getRefreshToken(),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ACCESS_TOKEN: (state, access_token) => {
    state.access_token = access_token
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_ACCESS_TOKEN', data.access)
        commit('SET_REFRESH_TOKEN', data.refresh)
        setToken(data.access, data.refresh)
        resolve()
      }).catch(error => {
        console.log('error')
        reject(error)
      })
    })
  },

  // user register
  register({ commit }, userInfo) {
    const { phone, username, password, repass, invite } = userInfo
    return new Promise((resolve, reject) => {
      register({ phone: phone, username: username.trim(), password: password, invite: invite }).then(response => {
        const { data } = response
        resolve()
      }).catch(error => {
        console.log('error')
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.access).then(response => {
        const { data, code } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, username, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_USERNAME', username)
        commit('SET_AVATAR', avatar)
        resolve(data)

      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.access_token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      refresh(state.access_token).then(response => {
        // removeToken() // must remove  token  first
        const { access, refresh } = response
        commit('SET_ACCESS_TOKEN', access)
        commit('SET_REFRESH_TOKEN', refresh)
        setToken(access, refresh)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })

  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

