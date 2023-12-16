class API_PRODUCTS {
  init($axios) {
    this.$axios = $axios
    return this
  }

  async getAllLicenses(organizationId) {
    return await this.$axios.$get(`/product/licenses/${organizationId}/all`)
  }

  async createLicense(data) {
    return await this.$axios.$post(`/product/licenses/new`, data)
  }

  async deleteLicense(licenseId) {
    return await this.$axios.$delete(`/product/licenses/${licenseId}`)
  }

  async getAllProducts() {
    return await this.$axios.$get(`/product/products/all`)
  }
}
export default new API_PRODUCTS()
