class API_USERS {
  init($axios) {
    this.$axios = $axios
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

  async createUser(user) {
    return await this.$axios.$post(`user/users/new`, user)
  }

  async updateUser(id, user) {
    return await this.$axios.$post(`user/users/${id}`, user)
  }

  async delete(id) {
    return await this.$axios.delete(`user/users/${id}`)
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

  async updateData(data) {
    return await this.$axios.$put(`user/users/${data.id}`, data)
  }

  async updateLocale(id, locale) {
    return await this.$axios.$put(
      `user/users/changeLocale/${id}`,
      {},
      {
        params: {
          locale,
        },
      }
    )
  }

  async changePassword(id, oldPassword, newPassword) {
    return await this.$axios.$put(
      `user/users/updatePassword/${id}`,
      {},
      {
        params: {
          oldPassword,
          newPassword,
        },
      }
    )
  }

  async getUserSignupData(token) {
    return await this.$axios.$get(`b2b/users/inviteToken/${token}`)
  }

  async createOrganization(data) {
    return await this.$axios.$post(`b2b/new`, data)
  }
}

export default new API_USERS()
