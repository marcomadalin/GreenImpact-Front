class API_ORGANIZATIONS {
  init($axios) {
    this.$axios = $axios
    return this
  }

  async getAllOrganizations() {
    return await this.$axios.$get(`/user/organizations/all`)
  }

  async getAllUsers(organizationId) {
    return await this.$axios.$get(
      `/user/organizations/${organizationId}/allUsers`
    )
  }

  async removeUser(organizationId, userId) {
    return await this.$axios.$delete(
      `/user/organizations/${organizationId}/removeUser`,
      {
        params: {
          userId,
        },
      }
    )
  }

  async getOrganization(organizationId) {
    return await this.$axios.$get(`/user/organizations/${organizationId}`)
  }

  async createOrganization(data) {
    return await this.$axios.$post(`/user/organizations/new`, data)
  }
}
export default new API_ORGANIZATIONS()
