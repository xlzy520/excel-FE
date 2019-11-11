import service from './service'

export default {
  getCountingDetailById(data) {
    return service('/counting/list', data)
  },
  deleteTemplate(data) {
    return service('/template/delete', data)
  },
  updateTemplate(data) {
    return service('/template/update', data)
  }
}
