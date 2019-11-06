import service from './service'

export default {
  addUser() {
    return service('/user/add')
  },
  getUserList(data) {
    return service('/user/list', data)
  },
  deleteUser(data) {
    return service('/user/delete', data)
  },
  resetUserPassword(data) {
    return service('/user/resetPassword', data)
  },
  logout() {
    return service('/logout')
  }
}
