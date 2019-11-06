import service from './service'

export default {
  login(data) {
    return service('/login', data, 'formdata')
  },
  getInfo() {
    return service('/info')
  },
  logout() {
    return service('/logout')
  }
}
