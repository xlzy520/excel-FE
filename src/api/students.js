import service from './service'

export default {
  addStudent(data) {
    return service('/students/add', data)
  },
  getStudentList(data) {
    return service('/students/list', data)
  },
  deleteStudent(data) {
    return service('/students/delete', data)
  },
  updateStudent(data) {
    return service('/students/update', data)
  }
}
