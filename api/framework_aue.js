class API_AUE {
  apiEndpoint = '/b2b/aue'

  init($axios) {
    this.$axios = $axios
    return this
  }

  async plansImpact(data) {
    return await this.$axios.$post(`${this.apiEndpoint}/plansImpact/`, data)
  }
}
export default new API_AUE()
