class API_PRODUCTS {
  init($axios) {
    this.$axios = $axios
    return this
  }

  async getAllLicenses(organizationId) {
    return await this.$axios.$get(`/product/licenses/${organizationId}/all`)
  }
}
export default new API_PRODUCTS()
