import service from './service'

export default {
  addUser(data) {
    return service('/user/add', data)
  },
  getUserList(data) {
    return service('/user/list', data)
  },
  deleteUser(data) {
    return service('/user/delete', data)
  },
  updateUser(data) {
    return service('/user/update', data)
  }
}
