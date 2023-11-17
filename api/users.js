class API_USERS {
  organizationUUID = null
  apiEndpoint = '/user/'

  init($axios, organizationUUID) {
    this.$axios = $axios
    this.organizationUUID = organizationUUID
    this.apiEndpoint = `/user/${this.organizationUUID}`
    return this
  }

  async getOrganizations(userId) {
    return await this.$axios.$get(`/user/users/${userId}/myOrganizations`)
  }

  async changeOrganization(organizationId) {
    return await this.$axios.$put(
      `user/users/changeOrganization?organizationId=${organizationId}`
    )
  }

  async whoami() {
    return await this.$axios.$get(`/user/authentication/whoami`)
  }

  async getOrganizationImage(organizationUUID) {
    return await this.$axios.$get(`b2b/${organizationUUID}/getImagePath`)
  }

  async updateUserRole(id, data) {
    return await this.$axios.$put(
      `${this.apiEndpoint}/users/${id}/updateRole`,
      data
    )
  }

  async getAll() {
    return await this.$axios.$get(`${this.apiEndpoint}/users`)
  }

  async get(id) {
    return await this.$axios.$get(`${this.apiEndpoint}/users/${id}`)
  }

  async getUser(userUUID) {
    return await this.$axios.$get(`/b2b/users/${userUUID}`)
  }

  async create(data) {
    return await this.$axios.post(`${this.apiEndpoint}/users/new`, data)
  }

  async createFromInvite(data, tokenOut) {
    return await this.$axios.post(
      `${this.apiEndpoint}/users/newFromInvite/${tokenOut}`,
      data
    )
  }

  async delete(id) {
    return await this.$axios.delete(`${this.apiEndpoint}/users/${id}`)
  }

  async invite(userEmail, userRole) {
    return await this.$axios.post(
      `${this.apiEndpoint}/invite?userEmail=${userEmail}&userRole=${userRole}`
    )
  }

  async getOrganizationRoles() {
    return await this.$axios.$get(`${this.apiEndpoint}/roles`)
  }

  async addOrganizationImage(image) {
    const data = new FormData()
    data.append('image', image)
    return await this.$axios.$post(`${this.apiEndpoint}/addImage`, data)
  }

  async deleteOrgImage() {
    return await this.$axios.$delete(`${this.apiEndpoint}/image`)
  }

  async changePassword(data) {
    return await this.$axios.$post(`b2b/users/changePassword`, data)
  }

  async updateData(data) {
    return await this.$axios.$put(`b2b/users/update`, data)
  }

  async getUserSignupData(token) {
    return await this.$axios.$get(`b2b/users/inviteToken/${token}`)
  }

  async createOrganization(data) {
    return await this.$axios.$post(`b2b/new`, data)
  }

  async getLicenses(organizationUUID) {
    return await this.$axios.$get(`b2b/${organizationUUID}/licenses/`)
  }

  async addLicense(organizationUUID, data) {
    return await this.$axios.$post(`b2b/${organizationUUID}/newLicense`, data)
  }

  async deleteLicense(organizationUUID, licenseId) {
    return await this.$axios.$delete(
      `b2b/${organizationUUID}/licenses/${licenseId}`
    )
  }

  async getAllOrganizations() {
    return await this.$axios.$get(`b2b/organizations`)
  }

  async getAllProducts() {
    return await this.$axios.$get(`b2b/products`)
  }

  async whoAmI() {
    return await this.$axios.$get(`b2b/users/whoami`)
  }
}

export default new API_USERS()
