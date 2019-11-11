import service from './service'

export default {
  addTemplate(data) {
    return service('/template/add', data)
  },
  getTemplateList(data) {
    return service('/template/list', data)
  },
  deleteTemplate(data) {
    return service('/template/delete', data)
  },
  updateTemplate(data) {
    return service('/template/update', data)
  }
}
