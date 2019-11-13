const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  name: state => state.user.name,
  roleCode: state => state.user.roleCode
}
export default getters
